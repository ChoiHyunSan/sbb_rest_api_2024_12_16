package com.ll.restarticlesite.domain.question;

import com.ll.restarticlesite.api.dto.response.question.QuestionCreateResponse;
import com.ll.restarticlesite.api.dto.response.question.QuestionDetailResponse;
import com.ll.restarticlesite.api.dto.response.question.QuestionListResponse;
import com.ll.restarticlesite.domain.answer.Answer;
import com.ll.restarticlesite.domain.category.Category;
import com.ll.restarticlesite.domain.category.CategoryService;
import com.ll.restarticlesite.domain.user.User;
import com.ll.restarticlesite.domain.user.UserService;
import com.ll.restarticlesite.global.exception.ResourceNotFoundException;
import com.ll.restarticlesite.global.exception.UnauthorizedException;
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

import static com.ll.restarticlesite.api.dto.response.question.QuestionCreateResponse.createQuestionCreateResponse;
import static com.ll.restarticlesite.api.dto.response.question.QuestionDetailResponse.createQuestionDetailResponse;
import static com.ll.restarticlesite.domain.question.QQuestion.question;
import static java.util.Comparator.comparing;
import static java.util.Comparator.comparingInt;

@Slf4j
@Service
@RequiredArgsConstructor
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final JPAQueryFactory queryFactory;
    private final UserService userService;
    private final CategoryService categoryService;
    private static final long PAGE_SIZE = 10;
    private final static int ANSWER_PAGE_SIZE = 5;

    private final static String RESOURCE_ERROR_MSG = "Question Resource Not Found";

    @Transactional
    public List<QuestionListResponse> getQuestionList(final int page, final String kw, final String sort) {
        return queryFactory.selectFrom(QQuestion.question)
                .leftJoin(QQuestion.question.user).fetchJoin()
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
                    .or(question.user.username.like("%" + kw + "%"));
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
            case "author" -> question.user.username.desc();
            default -> question.createdAt.desc(); // 기본값
        };
    }

    public Optional<QuestionDetailResponse> getQuestionDetail(final Long id, final int answerPage, final String sort) {
        Optional<Question> questionOpt = questionRepository.findById(id);
        if(questionOpt.isEmpty()){
            throw new ResourceNotFoundException("Question not found");
        }
        Question question = questionOpt.get();
        question.addViews();
        questionRepository.save(question);
        return Optional.of(createQuestionDetailResponse(question,
                answerPage,
                ANSWER_PAGE_SIZE,
                getComparator(sort)));
    }

    public static final String SORT_LATEST = "latest";
    private Comparator<Answer> getComparator(final String sort) {
        return SORT_LATEST.equals(sort)
                ? comparing(Answer::getCreatedAt).reversed()
                : comparingInt(a -> -a.getVoter().size());
    }

    public QuestionCreateResponse getCreateResponse(final Long id) {
        Optional<Question> byId = questionRepository.findById(id);
        if(byId.isEmpty()){
            throw new ResourceNotFoundException(RESOURCE_ERROR_MSG);
        }
        Question question = byId.get();

        return createQuestionCreateResponse(
                question.getCategory(),
                question.getSubject(),
                question.getContent()
        );
    }

    public Question createQuestion(final String username, final String subject, final String content, final Category category) {
        User byUsername = userService.findByUsername(username);
        log.info(byUsername.getUsername());
        Question question = Question.createQuestion(byUsername, subject, content, category);
        return questionRepository.save(question);
    }

    public void modifyQuestion(Long id, String subject, String content, Category category) {
        Question question = questionRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException(RESOURCE_ERROR_MSG));
        question.modify(subject, content, category);
        questionRepository.save(question);
    }

    public void deleteQuestion(String username, Long id) {
        Question question = questionRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException(RESOURCE_ERROR_MSG));
        if(!question.getUser().getUsername().equals(username)){
            throw new UnauthorizedException("유저와 질문의 작성자가 일치하지 않습니다. 유저 : " + username + ", 질문 : " + question.getUser().getUsername());
        }
        questionRepository.delete(question);
    }

    public void voteQuestion(String username, Long id) {
        Question question = questionRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException(RESOURCE_ERROR_MSG));
        User user = userService.findByUsername(username);
        question.getVoter().add(user);
        questionRepository.save(question);
    }

    public Question findById(Long questionId) {
        return questionRepository.findById(questionId).orElseThrow(() -> new ResourceNotFoundException(RESOURCE_ERROR_MSG));
    }
}
