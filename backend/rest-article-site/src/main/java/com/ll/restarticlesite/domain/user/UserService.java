package com.ll.restarticlesite.domain.user;

import com.ll.restarticlesite.api.dto.request.ProfileRequest;
import com.ll.restarticlesite.api.dto.request.answer.AnswerProfileRequest;
import com.ll.restarticlesite.api.dto.request.comment.CommentProfileRequest;
import com.ll.restarticlesite.api.dto.request.question.QuestionProfileRequest;
import com.ll.restarticlesite.api.dto.response.user.FindPasswordResponse;
import com.ll.restarticlesite.global.exception.InvalidInputException;
import com.ll.restarticlesite.global.exception.ResourceNotFoundException;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

import static com.ll.restarticlesite.api.dto.request.user.UserProfileRequest.createUserProfileRequest;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserQueryRepository userQueryRepository;

    @Transactional
    public void modifyPassword(String username, String oldPassword, String newPassword, String oldPassword1) {
        User user = getUser(username);
        if(!passwordEncoder.matches(oldPassword, user.getPassword()) || !newPassword.equals(oldPassword1)) {
            throw new InvalidInputException("Email Not Equal");
        }
        user.modifyPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    @Transactional
    public void createUser(String username, String email, String password1, String password2) {
        if(!password1.equals(password2)) {
            throw new InvalidInputException("Email Not Equal");
        }

        User user = User.createUser(username, email, passwordEncoder.encode(password1));
        userRepository.save(user);
    }

    @Transactional
    public FindPasswordResponse findPassword(String username,String email) {
        User user = getUser(username);
        if(!user.getEmail().equals(email)) {
            throw new InvalidInputException("Email Not Equal");
        }

        String newPassword = createNewPassword();
        user.modifyPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        return new FindPasswordResponse(newPassword);
    }

    @Transactional
    public ProfileRequest getProfile(String username) {
        User user = getUser(username);
        List<AnswerProfileRequest> answers = userQueryRepository.findAnswerProfilesByUserId(user.getId());
        List<QuestionProfileRequest> questions = userQueryRepository.findQuestionProfilesByUserId(user.getId());
        List<CommentProfileRequest> comments = userQueryRepository.findCommentProfilesByUserId(user.getId());
        return ProfileRequest.createProfileRequest(
                createUserProfileRequest(user),
                questions,
                answers,
                comments);
    }

    private static String createNewPassword() {
        return UUID.randomUUID().toString().substring(0, 5);
    }

    public User getUser(String username) {
        return userRepository.findByUsername(username).orElseThrow(() -> new ResourceNotFoundException("User Not Found"));
    }
}
