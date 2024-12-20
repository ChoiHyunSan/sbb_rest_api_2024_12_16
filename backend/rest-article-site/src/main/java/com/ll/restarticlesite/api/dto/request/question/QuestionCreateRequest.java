package com.ll.restarticlesite.api.dto.request.question;

import com.ll.restarticlesite.domain.category.Category;
import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Data
public class QuestionCreateRequest {
    @NotBlank(message = "제목은 필수항목입니다")
    @Size(min = 3, message = "제목은 3자 이상이어야 합니다")
    private String subject;

    @NotBlank(message = "내용은 필수항목입니다")
    @Size(min = 10, message = "내용은 10자 이상이어야 합니다")
    private String content;

    @NotNull(message = "카테고리는 필수항목입니다")
    private Category category;
}
