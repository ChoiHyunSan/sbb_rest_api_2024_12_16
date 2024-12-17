package com.ll.restarticlesite.domain.answer;

import com.ll.restarticlesite.api.dto.request.answer.AnswerListRequest;
import com.ll.restarticlesite.api.dto.response.answer.AnswerListResponse;
import com.ll.restarticlesite.domain.question.Question;
import com.ll.restarticlesite.domain.question.QuestionService;
import com.ll.restarticlesite.domain.user.User;
import com.ll.restarticlesite.domain.user.UserService;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.ll.restarticlesite.domain.answer.QAnswer.answer;

@Service
@RequiredArgsConstructor
public class AnswerService {

    private final QuestionService questionService;
    private final UserService userService;
    private final AnswerRepository answerRepository;
    private final static int ANSWER_PAGE_SIZE = 10;
    private final JPAQueryFactory queryFactory;

    public List<AnswerListResponse> getAnswerResponsePage(final int page) {
        Pageable pageable = PageRequest.of(page, ANSWER_PAGE_SIZE);
        return queryFactory
                .selectFrom(answer)
                .leftJoin(answer.question).fetchJoin()
                .leftJoin(answer.user).fetchJoin()
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch()
                .stream()
                .map(AnswerListResponse::createAnswerListRequest)
                .toList();
    }

    public Answer createAnswer(final String username, final Long questionId,final String content) {
        Question question = questionService.findById(questionId);
        User user = userService.findByUsername(username);
        return answerRepository.save(Answer.createAnswer(question, content, user));
    }
}
