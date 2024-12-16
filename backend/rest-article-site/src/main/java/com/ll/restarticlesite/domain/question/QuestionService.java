package com.ll.restarticlesite.domain.question;

import com.ll.restarticlesite.api.dto.response.QuestionDetailResponse;
import com.ll.restarticlesite.api.dto.response.QuestionListResponse;
import com.ll.restarticlesite.domain.answer.Answer;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;

import static com.ll.restarticlesite.api.dto.response.QuestionDetailResponse.createQuestionDetailResponse;
import static com.ll.restarticlesite.domain.question.QQuestion.question;
import static java.util.Comparator.comparing;
import static java.util.Comparator.comparingInt;

@Slf4j
@Service
@RequiredArgsConstructor
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final JPAQueryFactory queryFactory;
    private static final long PAGE_SIZE = 10;
    private final static int ANSWER_PAGE_SIZE = 5;

    @Transactional
    public List<QuestionListResponse> getQuestionList(final int page, final String kw, final String sort) {
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

    private BooleanBuilder hasKeyword(final String kw) {
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

    private OrderSpecifier<?> getOrderSpecifier(final String sort) {
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

    public Optional<QuestionDetailResponse> getQuestionDetail(final Long id, final int answerPage, final String sort) {
        Optional<Question> questionOpt = questionRepository.findById(id);
        if(questionOpt.isEmpty()){

        }
        return Optional.of(createQuestionDetailResponse(questionOpt.get(),
                answerPage,
                ANSWER_PAGE_SIZE,
                getComparator(sort)));
    }

    public static final String SORT_LATEST = "latest";
    private Comparator<Answer> getComparator(String sort) {
        return SORT_LATEST.equals(sort)
                ? comparing(Answer::getCreatedAt).reversed()
                : comparingInt(a -> -a.getVoter().size());
    }
}
