package com.example.blogging.service;

/**
 * PostService interface
 * 
 * @author Mahak Chauhan
 */
import java.util.List;

import com.example.blogging.models.Post;

public interface PostService {
    List<Post> getAllPosts(String cat);

    Post getPostById(Integer id);

    Post createPost(Post post);

    Boolean deletePost(Integer id);

    Post updatePost(Integer id, Post post);
}
