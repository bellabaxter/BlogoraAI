package com.example.blogging.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.example.blogging.models.Post;
import com.example.blogging.models.User;
import com.example.blogging.repo.PostRepo;
import com.example.blogging.repo.UserRepo;

@Service
public class PostServiceImpl implements PostService {

    @Autowired
    private PostRepo postRepo;

    @Autowired
    private UserRepo userRepo;

    @Override
    public List<Post> getAllPosts(String cat) {
        if (cat != null) {
            return postRepo.findByCat(cat);
        } else {
            return postRepo.findAll();
        }
    }

    @Override
    public Post getPostById(Integer id) {
        return postRepo.findById(id).orElse(null);
    }

    @Override
    public Post createPost(Post post) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User is not authenticated");
        }

        String email = authentication.getName();
        User currentUser = userRepo.findByEmail(email);
        if (currentUser == null) {
            throw new RuntimeException("Authenticated user not found");
        }

        post.setUser(currentUser);
        return postRepo.save(post);
    }

    @Override
    public Boolean deletePost(Integer id) {
        Post post = postRepo.findById(id).orElse(null);
        if (post != null) {
            postRepo.delete(post);
            return true;
        } else {
            return false;
        }
    }

    @Override
    public Post updatePost(Integer id, Post post) {

        Post existingPost = postRepo.findById(id).orElse(null);
        if (existingPost != null) {
            existingPost.setTitle(post.getTitle());
            existingPost.setContent(post.getContent());
            existingPost.setCat(post.getCat());
            existingPost.setImg(post.getImg());
            return postRepo.save(existingPost);
        } else {
            return null;
        }
    }

}
