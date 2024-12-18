package com.ll.restarticlesite.api.dto.response.answer;

import com.ll.restarticlesite.domain.answer.Answer;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class AnswerCreateResponse {
    private Long id;
    private String content;

    public static AnswerCreateResponse createAnswerCreateResponse(Answer answer) {
        return AnswerCreateResponse.builder()
                .id(answer.getId())
                .content(answer.getContent())
                .build();
    }
}
