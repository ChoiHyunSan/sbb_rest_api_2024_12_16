package com.ll.restarticlesite.domain.answer;

import com.ll.restarticlesite.api.dto.response.answer.AnswerCreateResponse;
import com.ll.restarticlesite.api.dto.response.answer.AnswerDetailResponse;
import com.ll.restarticlesite.api.dto.response.answer.AnswerListResponse;
import com.ll.restarticlesite.api.dto.response.comment.CommentDetailResponse;
import com.ll.restarticlesite.domain.question.Question;
import com.ll.restarticlesite.domain.question.QuestionService;
import com.ll.restarticlesite.domain.user.User;
import com.ll.restarticlesite.domain.user.UserService;
import com.ll.restarticlesite.global.service.AuthorizationService;
import com.ll.restarticlesite.global.exception.ResourceNotFoundException;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.ll.restarticlesite.api.dto.response.answer.AnswerCreateResponse.createAnswerCreateResponse;
import static com.ll.restarticlesite.domain.answer.QAnswer.answer;
import static com.ll.restarticlesite.domain.comment.Comment.createComment;

@Service
@RequiredArgsConstructor
public class AnswerService {

    private final QuestionService questionService;
    private final UserService userService;
    private final AnswerRepository answerRepository;
    private final static int ANSWER_PAGE_SIZE = 10;
    private final JPAQueryFactory queryFactory;
    private final static String RESOURCE_ERROR_MSG = "Answer Resource Not Found";
    private final AuthorizationService authorizationService;

    @Transactional
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

    @Transactional
    public Answer createAnswer(final String username, final Long questionId,final String content) {
        Question question = questionService.getQuestion(questionId);
        User user = userService.getUser(username);
        return answerRepository.save(Answer.createAnswer(question, content, user));
    }

    @Transactional
    public AnswerCreateResponse getAnswerCreateResponse(String username, Long id) {
        Answer answer = getAnswer(id);
        authorizationService.checkResourceOwner(username, answer);
        return createAnswerCreateResponse(answer);
    }

    @Transactional
    public AnswerDetailResponse modifyAnswer(String username, Long id, String content) {
        Answer answer = getAnswer(id);
        authorizationService.checkResourceOwner(username, answer);
        answer.modify(content);
        return AnswerDetailResponse.createAnswerResponse(answerRepository.save(answer));
    }

    @Transactional
    public void deleteAnswer(String username, Long id) {
        Answer answer = getAnswer(id);
        authorizationService.checkResourceOwner(username, answer);
        answerRepository.delete(answer);
    }

    public void voteAnswer(String username, Long id) {
        Answer answer = getAnswer(id);
        User user = userService.getUser(username);
        answer.getVoter().add(user);
        answerRepository.save(answer);
    }

    public void commentAnswer(String name, Long id, String content) {
        Answer answer = getAnswer(id);
        User user = userService.getUser(name);
        answer.getCommentList().add(createComment(answer, user, content));
        answerRepository.save(answer);
    }

    public List<CommentDetailResponse> getComments(Long id) {
        return getAnswer(id)
                .getCommentList().stream()
                .map(CommentDetailResponse::createCommentResponse)
                .toList();
    }

    private Answer getAnswer(Long id) {
        return answerRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException(RESOURCE_ERROR_MSG));
    }
}
