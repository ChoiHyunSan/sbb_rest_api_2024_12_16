package com.ll.restarticlesite.api.dto.request;

import com.ll.restarticlesite.api.dto.request.answer.AnswerProfileRequest;
import com.ll.restarticlesite.api.dto.request.question.QuestionProfileRequest;
import com.ll.restarticlesite.api.dto.request.user.UserProfileRequest;
import lombok.Data;

import java.util.List;

@Data
public class ProfileRequest {
    private UserProfileRequest userProfileRequest;
    private List<QuestionProfileRequest> questionProfileRequest;
    private List<AnswerProfileRequest> answerProfileRequest;

    public static ProfileRequest createProfileRequest(UserProfileRequest userProfileRequest,
                                                      List<QuestionProfileRequest> questionProfileRequest,
                                                       List<AnswerProfileRequest> answerProfileRequest) {
        ProfileRequest profileRequest = new ProfileRequest();
        profileRequest.answerProfileRequest = answerProfileRequest;
        profileRequest.userProfileRequest = userProfileRequest;
        profileRequest.questionProfileRequest  = questionProfileRequest;
        return profileRequest;
    }
}
