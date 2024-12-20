package com.ll.restarticlesite.api.dto.response.question;

import com.ll.restarticlesite.domain.category.Category;
import lombok.Data;

import java.util.List;

@Data
public class QuestionCreateResponse {
    private String subject;
    private String content;
    private Category category;

    public static QuestionCreateResponse createQuestionCreateResponse(Category category, String subject, String content) {
        QuestionCreateResponse response = new QuestionCreateResponse();
        response.subject = subject;
        response.content = content;
        response.category = category;
        return response;
    }
}
