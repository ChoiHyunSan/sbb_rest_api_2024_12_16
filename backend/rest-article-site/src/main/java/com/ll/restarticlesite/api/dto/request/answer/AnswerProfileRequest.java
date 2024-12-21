package com.ll.restarticlesite.api.dto.request.answer;

import com.ll.restarticlesite.domain.answer.Answer;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class AnswerProfileRequest {
    private String content;
    private LocalDateTime createDate;
}