package com.example.blogging.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.blogging.models.Post;
import com.example.blogging.service.PostServiceImpl;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostServiceImpl postServiceImpl;

    @GetMapping
    public ResponseEntity<List<Post>> getAllPosts(@RequestParam(required = false) String cat) {
        return ResponseEntity.ok(postServiceImpl.getAllPosts(cat));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Post> getPostById(@PathVariable Integer id) {
        Post post = postServiceImpl.getPostById(id);
        return (post != null) ? ResponseEntity.ok(post) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<Post> createPost(@RequestBody Post post) {
        Post newPost = postServiceImpl.createPost(post);
        return ResponseEntity.ok(newPost);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> deletePost(@PathVariable Integer id) {
        Boolean deleted = postServiceImpl.deletePost(id);
        return ResponseEntity.ok(deleted);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Post> updatePost(@PathVariable Integer id, @RequestBody Post post) {
        Post updatedPost = postServiceImpl.updatePost(id, post);
        return (updatedPost != null) ? ResponseEntity.ok(updatedPost) : ResponseEntity.notFound().build();
    }

}
