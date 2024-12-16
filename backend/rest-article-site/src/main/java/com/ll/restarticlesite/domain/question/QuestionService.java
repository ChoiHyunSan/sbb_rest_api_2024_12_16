package com.ll.restarticlesite.domain.question;

import com.ll.restarticlesite.api.dto.response.QuestionListResponse;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.ll.restarticlesite.domain.question.QQuestion.question;

@Slf4j
@Service
@RequiredArgsConstructor
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final JPAQueryFactory queryFactory;

    @Transactional
    public List<QuestionListResponse> getQuestionList(int page, String kw, String sort) {
        return queryFactory.selectFrom(QQuestion.question)
                .leftJoin(QQuestion.question.author).fetchJoin()
                .where(hasKeyword(kw))
                .orderBy(getOrderSpecifier(sort))
                .offset(page * PAGE_SIZE)
                .limit(PAGE_SIZE)
                .fetch()
                .stream()
                .map(QuestionListResponse::createQuestionListResponse)
                .toList();
    }

    private BooleanBuilder hasKeyword(String kw) {
        BooleanBuilder builder = new BooleanBuilder();
        log.info("kw : {}", kw);

        if(kw.trim().isEmpty()) {
            builder.or(question.id.isNotNull());
        }else{
            builder.or(question.subject.like("%" + kw + "%"))
                    .or(question.content.like("%" + kw + "%"))
                    .or(question.author.username.like("%" + kw + "%"));
        }
        return builder;
    }

    private OrderSpecifier<?> getOrderSpecifier(String sort) {
        return switch (sort.toLowerCase()) {
            case "latest" -> question.createdAt.desc();
            case "oldest" -> question.createdAt.asc();
            case "views" -> question.views.desc();
            case "likes" -> question.voter.size().desc();
            case "answers" -> question.answerList.size().desc();
            case "author" -> question.author.username.desc();
            default -> question.createdAt.desc(); // 기본값
        };
    }

    private static final long PAGE_SIZE = 10;
}
