package com.ll.restarticlesite.domain.user;

import com.ll.restarticlesite.global.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User findByUsername(String username) {
        return userRepository.findByUsername(username).orElseThrow(() -> new ResourceNotFoundException("User Not Found"));
    }

    public void modifyPassword(String username, String oldPassword, String newPassword, String oldPassword1) {

    }

    public void createUser(String username, String email, String password1, String password2) {
        if(!password1.equals(password2)) {
            // TODO : 예외 던지기
        }

        User user = User.createUser(username, email, passwordEncoder.encode(password1));
        userRepository.save(user);
    }
}
