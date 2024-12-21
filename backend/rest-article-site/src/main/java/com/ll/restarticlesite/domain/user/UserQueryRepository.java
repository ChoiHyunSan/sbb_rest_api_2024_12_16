package com.ll.restarticlesite.domain.user;

import com.ll.restarticlesite.api.dto.request.answer.AnswerProfileRequest;
import com.ll.restarticlesite.api.dto.request.comment.CommentProfileRequest;
import com.ll.restarticlesite.api.dto.request.question.QuestionProfileRequest;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

import static com.ll.restarticlesite.domain.answer.QAnswer.answer;
import static com.ll.restarticlesite.domain.comment.QComment.comment;
import static com.ll.restarticlesite.domain.question.QQuestion.question;

@Repository
@RequiredArgsConstructor
public class UserQueryRepository {

    private final JPAQueryFactory queryFactory;

    public List<AnswerProfileRequest> findAnswerProfilesByUserId(Long userId) {
        return queryFactory
                .select(Projections.constructor(AnswerProfileRequest.class,
                        answer.content,
                        answer.createdAt))
                .from(answer)
                .where(answer.user.id.eq(userId))
                .fetch();
    }

    public List<QuestionProfileRequest> findQuestionProfilesByUserId(Long userId) {
        return queryFactory
                .select(Projections.constructor(QuestionProfileRequest.class,
                        question.subject,
                        question.createdAt))
                .from(question)
                .where(question.user.id.eq(userId))
                .fetch();
    }

    public List<CommentProfileRequest> findCommentProfilesByUserId(Long userId) {
        return queryFactory
                .select(Projections.constructor(CommentProfileRequest.class,
                        comment.content,
                        comment.createdAt))
                .from(comment)
                .where(comment.user.id.eq(userId))
                .fetch();
    }
}
