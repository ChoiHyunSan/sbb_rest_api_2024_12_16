package com.ll.restarticlesite.domain.user;

import com.ll.restarticlesite.global.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public User findByUsername(String username) {
        return userRepository.findByUsername(username).orElseThrow(() -> new ResourceNotFoundException("User Not Found"));
    }

    public void modifyPassword(String username, String oldPassword, String newPassword, String oldPassword1) {

    }
}
