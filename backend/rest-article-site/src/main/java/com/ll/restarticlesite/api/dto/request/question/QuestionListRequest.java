package com.ll.restarticlesite.api.dto.request.question;

import lombok.Data;

@Data
public class QuestionListRequest {
    private int page = 0;
    private String kw = "";
    private String sort = "createdAt";
}