package com.ll.restarticlesite.api.dto.request;

import com.ll.restarticlesite.domain.category.Category;
import lombok.Data;

@Data
public class QuestionCreateRequest {
    private String subject;
    private String content;
    private Category category;
}
