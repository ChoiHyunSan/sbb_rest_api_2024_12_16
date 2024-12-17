package com.ll.restarticlesite.api.dto.response.question;

import com.ll.restarticlesite.domain.question.Question;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class QuestionListResponse {

    // 필요한 내용
    // 조회용 아이디, 제목, 내용, 조회수, 최근 수정 날짜, 작성자명
    private Long id;
    private String subject;
    private String content;
    private Integer views;
    private LocalDateTime updateAt;
    private String author;

    public static QuestionListResponse createQuestionListResponse(Question question) {
        return QuestionListResponse.builder()
                .id(question.getId())
                .subject(question.getSubject())
                .content(question.getContent())
                .updateAt(question.getModifiedAt())
                .views(question.getAnswerList().size())
                .author(question.getUser().getUsername())
                .build();
    }
}
