package com.example.blogging.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.blogging.models.Post;

/**
 * Posts entity class
 * 
 * @author Mahak Chauhan
 */

public interface PostRepo extends JpaRepository<Post, Integer> {
    List<Post> findByCat(String cat);

    List<Post> findByUserId(Integer uid);

    @Query("SELECT p FROM Post p WHERE p.title LIKE %:key%")
    List<Post> searchByTitle(@Param("key") String key);
}
