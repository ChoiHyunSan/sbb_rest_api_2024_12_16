package com.ll.restarticlesite.api.dto.response.answer;


import com.ll.restarticlesite.domain.answer.Answer;
import lombok.Builder;
import lombok.Getter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Builder
public class AnswerResponse {

    private Long id;
    private String content;
    private LocalDateTime createDate;
    private LocalDateTime modifyDate;
    private String author;
    private Integer likes;

    public static AnswerResponse createAnswerResponse(Answer answer) {
        return AnswerResponse.builder()
                .id(answer.getId())
                .content(answer.getContent())
                .createDate(answer.getCreatedAt())
                .modifyDate(answer.getModifiedAt())
                .author(answer.getUser().getUsername())
                .likes(answer.getVoter().size())
                .build();
    }

    public static Page<AnswerResponse> answerResponsePagingList(List<Answer> answers, int page, int size, Comparator<Answer> cmp){
        List<Answer> sortedAnswers = answers.stream()
                .sorted(cmp)
                .toList();

        if (sortedAnswers.isEmpty()) {
            return new PageImpl<>(Collections.emptyList(), PageRequest.of(page, size), 0);
        }

        int start = page * size;
        if (start >= sortedAnswers.size()) {
            return new PageImpl<>(Collections.emptyList(), PageRequest.of(page, size), sortedAnswers.size());
        }

        int end = Math.min(start + size, sortedAnswers.size());

        List<AnswerResponse> pageContent = sortedAnswers.subList(start, end)
                .stream()
                .map(AnswerResponse::createAnswerResponse)
                .collect(Collectors.toList());

        return new PageImpl<>(pageContent, PageRequest.of(page, size), sortedAnswers.size());
    }
}
