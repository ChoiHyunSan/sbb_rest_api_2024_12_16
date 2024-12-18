package com.ll.restarticlesite.domain.answer;

import com.ll.restarticlesite.api.dto.request.answer.AnswerListRequest;
import com.ll.restarticlesite.api.dto.response.answer.AnswerCreateResponse;
import com.ll.restarticlesite.api.dto.response.answer.AnswerDetailResponse;
import com.ll.restarticlesite.api.dto.response.answer.AnswerListResponse;
import com.ll.restarticlesite.domain.question.Question;
import com.ll.restarticlesite.domain.question.QuestionService;
import com.ll.restarticlesite.domain.user.User;
import com.ll.restarticlesite.domain.user.UserService;
import com.ll.restarticlesite.global.exception.ResourceNotFoundException;
import com.ll.restarticlesite.global.exception.UnauthorizedException;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.ll.restarticlesite.api.dto.response.answer.AnswerCreateResponse.createAnswerCreateResponse;
import static com.ll.restarticlesite.domain.answer.QAnswer.answer;

@Service
@RequiredArgsConstructor
public class AnswerService {

    private final QuestionService questionService;
    private final UserService userService;
    private final AnswerRepository answerRepository;
    private final static int ANSWER_PAGE_SIZE = 10;
    private final JPAQueryFactory queryFactory;
    private final static String RESOURCE_ERROR_MSG = "Answer Resource Not Found";

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

    public AnswerCreateResponse getAnswerCreateResponse(String username, Long id) {
        Answer answer = answerRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException(RESOURCE_ERROR_MSG));
        if(!answer.getUser().getUsername().equals(username)) {
            throw new UnauthorizedException("현재 접속한 유저가 작성한 글이 아닙니다. Username : " + username + " Answer Id : " + id);
        }
        return createAnswerCreateResponse(answer);
    }

    public AnswerDetailResponse modifyAnswer(String username, Long id, String content) {
        Answer answer = answerRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException(RESOURCE_ERROR_MSG));
        if(!answer.getUser().getUsername().equals(username)) {
            throw new UnauthorizedException("현재 접속한 유저가 작성한 글이 아닙니다. Username : " + username + " Answer Id : " + id);
        }
        answer.modify(content);
        return AnswerDetailResponse.createAnswerResponse(answerRepository.save(answer));
    }

    public void deleteAnswer(String username, Long id) {
        Answer answer = answerRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException(RESOURCE_ERROR_MSG));
        if(!answer.getUser().getUsername().equals(username)){
            throw new UnauthorizedException("유저와 답변의 작성자가 일치하지 않습니다. 유저 : " + username + ", 답변 : " + answer.getUser().getUsername());
        }
        answerRepository.delete(answer);
    }

    public void voteAnswer(String username, Long id) {
        Answer answer = answerRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException(RESOURCE_ERROR_MSG));
        User user = userService.findByUsername(username);
        answer.getVoter().add(user);
        answerRepository.save(answer);
    }
}
