package com.ll.restarticlesite.api.dto.request.question;

import lombok.Data;

@Data
public class QuestionDetailRequest {
    private int answerPage;
    private String sort = "latest";
}
