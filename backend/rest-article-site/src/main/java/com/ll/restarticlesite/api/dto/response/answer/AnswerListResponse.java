package com.ll.restarticlesite.api.dto.response.answer;

import com.ll.restarticlesite.api.dto.request.answer.AnswerListRequest;
import com.ll.restarticlesite.domain.answer.Answer;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class AnswerListResponse {
    private Long id;
    private String questionTitle;
    private String content;
    private LocalDateTime createdAt;
    private String author;
    private Integer commentCount;

    private static final int MAX_CONTENT_SIZE = 15;
    public static AnswerListResponse createAnswerListRequest(Answer answer) {
        String content = answer.getContent();
        if(content.length() > MAX_CONTENT_SIZE){
            content = content.substring(0, MAX_CONTENT_SIZE) + "...";
        }
        return AnswerListResponse.builder()
                .id(answer.getId())
                .questionTitle(answer.getQuestion().getSubject())
                .content(content)
                .createdAt(answer.getCreatedAt())
                .commentCount(answer.getCommentList().size())
                .author(answer.getUser().getUsername())
                .build();
    }
}
