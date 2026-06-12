package com.example.blogging.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.blogging.models.User;

/**
 * Posts entity class
 * 
 * @author Mahak Chauhan
 */

@Repository
public interface UserRepo extends JpaRepository<User, Integer> {

    User findByName(String name);

    User findByEmail(String email);

    User findByEmailAndPassword(String email, String password);
}
