package com.ll.restarticlesite.api.dto.request.comment;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class CommentCreateRequest {
    @NotEmpty(message = "댓글 내용은 필수입니다.")
    private String content;
}
