package com.ll.restarticlesite.api.dto.request.question;

import com.ll.restarticlesite.domain.question.Question;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
public class QuestionProfileRequest {
    private String subject;
    private LocalDateTime createdAt;

    public static QuestionProfileRequest createQuestionProfileRequest(Question question) {
        return QuestionProfileRequest.builder()
                .subject(question.getSubject())
                .createdAt(question.getCreatedAt())
                .build();
    }
}
