package com.ll.restarticlesite.api.dto.response.comment;

import com.ll.restarticlesite.domain.comment.Comment;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class CommentDetailResponse {
    private String username;
    private String content;
    private LocalDateTime createdAt
            ;

    public static CommentDetailResponse createCommentResponse(Comment comment) {
        return CommentDetailResponse.builder()
                .content(comment.getContent())
                .username(comment.getUser().getUsername())
                .createdAt(comment.getCreatedAt())
                .build();
    }
}
