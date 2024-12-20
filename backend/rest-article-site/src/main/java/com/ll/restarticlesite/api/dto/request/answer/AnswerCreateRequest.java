package com.ll.restarticlesite.api.dto.request.answer;

import lombok.AllArgsConstructor;
import lombok.Data;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Data
@AllArgsConstructor
public class AnswerCreateRequest {
    @NotBlank(message = "{validation.required}")
    @Size(min = 5, message = "{validation.size.min}")
    private String content;
}
