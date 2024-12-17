package com.ll.restarticlesite.api.dto.request.answer;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@AllArgsConstructor
public class AnswerCreateRequest {
    private String content;
}
