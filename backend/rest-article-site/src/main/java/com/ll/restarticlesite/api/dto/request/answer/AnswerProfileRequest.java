package com.ll.restarticlesite.api.dto.request.answer;

import com.ll.restarticlesite.domain.answer.Answer;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class AnswerProfileRequest {
    private String content;
    private LocalDateTime createDate;

    public static AnswerProfileRequest createAnswerProfileRequest(Answer answer){
        AnswerProfileRequest dto = new AnswerProfileRequest();
        dto.setContent(answer.getContent());
        dto.setCreateDate(answer.getCreatedAt());
        return dto;
    }
}