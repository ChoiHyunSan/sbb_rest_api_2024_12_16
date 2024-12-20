package com.ll.restarticlesite.api.dto.request.question;

import com.ll.restarticlesite.domain.question.Question;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class QuestionProfileRequest {
    private String subject;
    private LocalDateTime createDate;

    public static QuestionProfileRequest createQuestionProfileRequest(Question question) {
        QuestionProfileRequest request = new QuestionProfileRequest();
        request.setSubject(question.getSubject());
        request.setCreateDate(question.getCreatedAt());
        return request;
    }
}
