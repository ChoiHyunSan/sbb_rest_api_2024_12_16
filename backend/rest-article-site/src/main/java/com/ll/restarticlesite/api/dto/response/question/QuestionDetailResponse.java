package com.ll.restarticlesite.api.dto.response.question;

import com.ll.restarticlesite.api.dto.response.answer.AnswerDetailResponse;
import com.ll.restarticlesite.domain.answer.Answer;
import com.ll.restarticlesite.domain.question.Question;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.domain.Page;

import java.time.LocalDateTime;
import java.util.Comparator;

@Data
@Builder
public class QuestionDetailResponse {

    private Long id;
    private String subject;
    private String content;
    private LocalDateTime createDate;
    private LocalDateTime modifyDate;
    private String author;
    private Page<AnswerDetailResponse> answerPage;
    private Integer answerCount;
    private Integer likes;
    private Long views;

    public static QuestionDetailResponse createQuestionDetailResponse(Question question, int pageNum, int size, int likes, Comparator<Answer> cmp) {
        return QuestionDetailResponse.builder()
                .id(question.getId())
                .subject(question.getSubject())
                .content(question.getContent())
                .createDate(question.getCreatedAt())
                .author(question.getUser().getUsername())
                .modifyDate(question.getModifiedAt())
                .answerPage(AnswerDetailResponse.answerResponsePagingList(question.getAnswerList(), pageNum, size, cmp))
                .likes(likes)
                .answerCount(question.getAnswerList().size())
                .views(question.getViews())
                .build();
    }
}
