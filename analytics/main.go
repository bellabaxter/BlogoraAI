package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq" // PostgreSQL driver — blank import registers it
)

// db is global so all handlers share one connection pool
var db *sql.DB

type ViewCountResponse struct {
	PostID string `json:"postId"`
	Views  int64  `json:"views"`
}

func main() {
	// Build DSN from env vars (set these to match your existing Spring Boot DB config)
	dsn := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		getEnv("DB_HOST", "localhost"),
		getEnv("DB_PORT", "5432"),
		getEnv("DB_USER", "postgres"),
		getEnv("DB_PASSWORD", ""),
		getEnv("DB_NAME", "blog"),
		getEnv("DB_SSLMODE", "disable"),
	)

	var err error
	db, err = sql.Open("postgres", dsn)
	if err != nil {
		log.Fatalf("Failed to open DB: %v", err)
	}
	defer db.Close()

	if err = db.Ping(); err != nil {
		log.Fatalf("Could not reach PostgreSQL: %v", err)
	}
	log.Println("Connected to PostgreSQL")

	// Create the post_views table if it doesn't exist yet.
	// This runs once at startup — safe to keep here.
	if err = runMigration(); err != nil {
		log.Fatalf("Migration failed: %v", err)
	}

	// Gin router
	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins: []string{"*"}, // tighten to your domain in production
		AllowMethods: []string{"GET", "POST", "OPTIONS"},
		AllowHeaders: []string{"Content-Type", "Authorization"},
	}))

	analytics := r.Group("/analytics")
	{
		// POST /analytics/view/:postId  — record a view
		analytics.POST("/view/:postId", handleView)

		// GET  /analytics/count/:postId — get current view count
		analytics.GET("/count/:postId", handleCount)
	}

	r.GET("/health", handleHealth)

	port := getEnv("PORT", "8081")
	log.Printf("Analytics service running on :%s", port)
	if err := r.Run(":" + port); err != nil && err != http.ErrServerClosed {
		log.Fatalf("Server failed: %v", err)
	}
}

// runMigration creates the post_views table if it doesn't already exist.
// The table sits in your existing PostgreSQL database alongside your blog tables.
//
// Schema:
//
//	post_id  TEXT PRIMARY KEY  — matches the post ID used by your Spring Boot app
//	views    BIGINT            — total view count
func runMigration() error {
	_, err := db.Exec(`
		CREATE TABLE IF NOT EXISTS post_views (
			post_id  TEXT   PRIMARY KEY,
			views    BIGINT NOT NULL DEFAULT 0
		)
	`)
	return err
}

// POST /analytics/view/:postId
// Uses an "upsert":
//   - If no row exists for this post yet → INSERT with views = 1
//   - If a row exists → add 1 to views
//
// This is fully atomic — no race condition even under heavy traffic.
func handleView(c *gin.Context) {
	postID := c.Param("postId")

	var newCount int64
	err := db.QueryRow(`
		INSERT INTO post_views (post_id, views)
		VALUES ($1, 1)
		ON CONFLICT (post_id)
		DO UPDATE SET views = post_views.views + 1
		RETURNING views
	`, postID).Scan(&newCount)

	if err != nil {
		log.Printf("DB upsert error for post %s: %v", postID, err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to record view"})
		return
	}

	c.JSON(http.StatusOK, ViewCountResponse{PostID: postID, Views: newCount})
}

// GET /analytics/count/:postId
// Returns the current view count. Returns 0 if the post has never been viewed.
func handleCount(c *gin.Context) {
	postID := c.Param("postId")

	var count int64
	err := db.QueryRow(`
		SELECT views FROM post_views WHERE post_id = $1
	`, postID).Scan(&count)

	if err == sql.ErrNoRows {
		// Never viewed — return 0 instead of 404
		c.JSON(http.StatusOK, ViewCountResponse{PostID: postID, Views: 0})
		return
	}
	if err != nil {
		log.Printf("DB query error for post %s: %v", postID, err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch view count"})
		return
	}

	c.JSON(http.StatusOK, ViewCountResponse{PostID: postID, Views: count})
}

// GET /health
func handleHealth(c *gin.Context) {
	// Also ping the DB so health check catches DB outages
	if err := db.Ping(); err != nil {
		c.JSON(http.StatusServiceUnavailable, gin.H{"status": "db unreachable"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "ok"})
}

func getEnv(key, fallback string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}
	return fallback
}
