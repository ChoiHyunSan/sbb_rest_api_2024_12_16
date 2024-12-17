package com.ll.restarticlesite.api.dto.response;

import com.ll.restarticlesite.domain.category.Category;
import lombok.Data;

import java.util.List;

@Data
public class QuestionCreateResponse {
    private String subject;
    private String content;
    private List<Category> categories;

    public static QuestionCreateResponse createQuestionCreateResponse(List<Category> categories, String subject, String content) {
        QuestionCreateResponse response = new QuestionCreateResponse();
        response.subject = subject;
        response.content = content;
        response.categories = categories;
        return response;
    }
}
