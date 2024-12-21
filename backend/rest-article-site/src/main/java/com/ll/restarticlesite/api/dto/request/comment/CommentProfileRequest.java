package com.ll.restarticlesite.api.dto.request.comment;

import com.ll.restarticlesite.domain.comment.Comment;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class CommentProfileRequest {
    private String content;
    private LocalDateTime createdAt;

    public static CommentProfileRequest createCommentProfileRequest(Comment comment) {
        return CommentProfileRequest.builder()
                .content(comment.getContent())
                .createdAt(comment.getCreatedAt())
                .build();
    }
}
