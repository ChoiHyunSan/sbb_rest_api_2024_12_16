package com.ll.restarticlesite.api.dto.response;

import com.ll.restarticlesite.domain.question.Question;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
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
        QuestionListResponse response = new QuestionListResponse();
        response.setId(question.getId());
        response.setSubject(question.getSubject());
        response.setContent(question.getContent());
        response.setUpdateAt(question.getModifiedAt());
        response.setAuthor(question.getAuthor().getUsername());
        return response;
    }
}
