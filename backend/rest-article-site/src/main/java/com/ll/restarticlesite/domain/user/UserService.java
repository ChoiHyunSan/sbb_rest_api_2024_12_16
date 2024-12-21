package com.ll.restarticlesite.domain.user;

import com.ll.restarticlesite.api.dto.request.ProfileRequest;
import com.ll.restarticlesite.api.dto.request.answer.AnswerProfileRequest;
import com.ll.restarticlesite.api.dto.request.comment.CommentProfileRequest;
import com.ll.restarticlesite.api.dto.request.question.QuestionProfileRequest;
import com.ll.restarticlesite.api.dto.response.user.FindPasswordResponse;
import com.ll.restarticlesite.domain.answer.AnswerRepository;
import com.ll.restarticlesite.domain.comment.CommentRepository;
import com.ll.restarticlesite.domain.question.QuestionRepository;
import com.ll.restarticlesite.global.exception.InvalidInputException;
import com.ll.restarticlesite.global.exception.ResourceNotFoundException;
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
    private final AnswerRepository answerRepository;
    private final QuestionRepository questionRepository;
    private final CommentRepository commentRepository;

    public void modifyPassword(String username, String oldPassword, String newPassword, String oldPassword1) {
        User user = getUser(username);
        if(!passwordEncoder.matches(oldPassword, user.getPassword()) || !newPassword.equals(oldPassword1)) {
            throw new InvalidInputException("Email Not Equal");
        }
        user.modifyPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    public void createUser(String username, String email, String password1, String password2) {
        if(!password1.equals(password2)) {
            throw new InvalidInputException("Email Not Equal");
        }

        User user = User.createUser(username, email, passwordEncoder.encode(password1));
        userRepository.save(user);
    }

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

    public ProfileRequest getProfile(String username) {
        User user = getUser(username);
        List<AnswerProfileRequest> answerProfileRequests = answerRepository.findByUser(user).stream()
                .map(AnswerProfileRequest::createAnswerProfileRequest).toList();
        List<QuestionProfileRequest> questionProfileRequests = questionRepository.findByUser(user).stream()
                .map(QuestionProfileRequest::createQuestionProfileRequest).toList();
        List<CommentProfileRequest> commentProfileRequests = commentRepository.findByUser(user).stream()
                .map(CommentProfileRequest::createCommentProfileRequest).toList();

        return ProfileRequest.createProfileRequest(
                createUserProfileRequest(user),
                questionProfileRequests,
                answerProfileRequests,
                commentProfileRequests);
    }

    private static String createNewPassword() {
        return UUID.randomUUID().toString().substring(0, 5);
    }

    public User getUser(String username) {
        return userRepository.findByUsername(username).orElseThrow(() -> new ResourceNotFoundException("User Not Found"));
    }
}
