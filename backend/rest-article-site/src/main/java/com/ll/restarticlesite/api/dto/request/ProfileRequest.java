package com.ll.restarticlesite.api.dto.request;

import com.ll.restarticlesite.api.dto.request.answer.AnswerProfileRequest;
import com.ll.restarticlesite.api.dto.request.question.QuestionProfileRequest;
import com.ll.restarticlesite.api.dto.request.user.UserProfileRequest;
import com.ll.restarticlesite.api.dto.request.comment.CommentProfileRequest;
import lombok.Data;

import java.util.List;

@Data
public class ProfileRequest {
    private UserProfileRequest userProfileRequest;
    private List<QuestionProfileRequest> questionProfileRequest;
    private List<AnswerProfileRequest> answerProfileRequest;
    private List<CommentProfileRequest> commentProfileRequest;

    public static ProfileRequest createProfileRequest(UserProfileRequest userProfileRequest,
                                                      List<QuestionProfileRequest> questionProfileRequest,
                                                       List<AnswerProfileRequest> answerProfileRequest,
                                                       List<CommentProfileRequest> commentProfileRequest) {
        ProfileRequest profileRequest = new ProfileRequest();
        profileRequest.answerProfileRequest = answerProfileRequest;
        profileRequest.userProfileRequest = userProfileRequest;
        profileRequest.questionProfileRequest  = questionProfileRequest;
        profileRequest.commentProfileRequest = commentProfileRequest;
        return profileRequest;
    }
}
