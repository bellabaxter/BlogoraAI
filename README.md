# BlogoraAI

A full-stack blogging platform with AI-powered features and a dedicated analytics microservice to track post views.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Angular (TypeScript) |
| Backend API | Java Spring Boot |
| Analytics Service | Go + Gin |
| Main Database | PostgreSQL |
| Auth | JWT |

## Project Structure

```
BlogoraAI/
├── angularapp/                  # Angular frontend
│   └── src/app/
│       ├── components/
│       │   ├── home/            # Blog post listing
│       │   ├── view-post/       # Full post view (triggers analytics)
│       │   ├── create-post/     # Create / edit post
│       │   ├── my-post/         # Author's own posts
│       │   ├── analytics/       # Per-post analytics page
│       │   ├── login/
│       │   └── register/
│       ├── services/
│       │   ├── post.service.ts
│       │   ├── auth.service.ts
│       │   └── analytics.service.ts
│       └── models/
│           └── post.model.ts
│
├── api/                         # Spring Boot REST API
│   └── src/main/java/
│
└── analytics-service/           # Go analytics microservice
    ├── main.go
    ├── go.mod
    ├── Dockerfile
    ├── docker-compose.yml
    └── .env                     # ← never committed (see .env.example)
```

## Features

- Create, edit, and delete blog posts
- JWT-based authentication
- Per-post view count analytics
  - View count increments only when someone other than the post author visits
  - Powered by a separate Go microservice backed by PostgreSQL

## Routes

| Path | Component |
|---|---|
| `/` | Home — all posts |
| `/register` | Register |
| `/login` | Login |
| `/createpost` | Create a new post |
| `/edit-post/:id` | Edit an existing post |
| `/view-post/:id` | View full post (records a view) |
| `/my-post` | Your own posts |
| `/analytics/:id` | Analytics page for a post |

## Getting Started

### Prerequisites

- Node.js + Angular CLI
- Java 17+ and Maven
- PostgreSQL
- Docker Desktop (for the analytics service)

### 1. PostgreSQL Setup

Create the database your Spring Boot app uses. The analytics service will automatically create the `post_views` table on first startup — no manual SQL needed.

### 2. Spring Boot API

```bash
cd api
mvn spring-boot:run
```

### 3. Analytics Microservice (Go + Docker)

Copy your environment file:

```bash
cd analytics-service
cp .env.example .env
```

Fill in your credentials in `.env`:

```env
DB_HOST=host.docker.internal
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=your_db_name
DB_SSLMODE=disable
PORT=8081
```

Start the service:

```bash
docker compose up --build
```

The Go service runs on `http://localhost:8081`.

### 4. Angular Frontend

```bash
cd angularapp
npm install
ng serve
```

App runs on `http://localhost:4200`.

## Analytics Microservice API

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/analytics/view/:postId` | Record a view (atomic upsert) |
| `GET` | `/analytics/count/:postId` | Get total view count |
| `GET` | `/health` | Health check (also pings DB) |

### How view tracking works

```
User opens /view-post/42
    ↓
Angular checks: is current user the post author?
    ↓ No
Calls POST /analytics/view/42
    ↓
Go service runs atomic SQL upsert:
INSERT INTO post_views (post_id, views) VALUES ('42', 1)
ON CONFLICT (post_id) DO UPDATE SET views = post_views.views + 1
    ↓
Returns updated count → shown in UI
```

Author's own visits are never counted.

## Environment Variables

The analytics service reads all config from environment variables. Never hardcode credentials.

| Variable | Description | Default |
|---|---|---|
| `DB_HOST` | PostgreSQL host | `localhost` |
| `DB_PORT` | PostgreSQL port | `5432` |
| `DB_USER` | Database user | `postgres` |
| `DB_PASSWORD` | Database password | _(empty)_ |
| `DB_NAME` | Database name | `blog` |
| `DB_SSLMODE` | SSL mode | `disable` |
| `PORT` | Analytics service port | `8081` |

Copy `.env.example` → `.env` and fill in values. The `.env` file is gitignored.

## Running Analytics Service Locally (without Docker)

If you have Go installed:

```bash
cd analytics-service
go mod tidy

export DB_HOST=localhost
export DB_PASSWORD=your_password
export DB_NAME=your_db_name

go run main.go
```

## .gitignore

Make sure these are ignored:

```
analytics-service/.env
*.env
```

If you accidentally committed `.env`:

```bash
git rm --cached analytics-service/.env
git commit -m "remove .env from tracking"
```
