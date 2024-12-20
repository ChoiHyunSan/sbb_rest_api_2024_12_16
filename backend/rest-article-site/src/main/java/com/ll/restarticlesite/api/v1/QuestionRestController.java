package com.ll.restarticlesite.api.v1;

import com.ll.restarticlesite.api.dto.request.question.QuestionCreateRequest;
import com.ll.restarticlesite.api.dto.request.question.QuestionDetailRequest;
import com.ll.restarticlesite.api.dto.request.question.QuestionListRequest;
import com.ll.restarticlesite.api.dto.response.question.QuestionCreateResponse;
import com.ll.restarticlesite.api.dto.response.question.QuestionDetailResponse;
import com.ll.restarticlesite.api.dto.response.question.QuestionListResponse;
import com.ll.restarticlesite.domain.category.Category;
import com.ll.restarticlesite.domain.category.CategoryService;
import com.ll.restarticlesite.domain.question.Question;
import com.ll.restarticlesite.domain.question.QuestionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

import static com.ll.restarticlesite.api.dto.response.question.QuestionListResponse.createQuestionListResponse;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/questions")
public class QuestionRestController {

    private final QuestionService questionService;
    private final CategoryService categoryService;

    /**
     * 질문 리스트 데이터 반환 (권한 or 인증 필요 X)
     * @param request 페이지 , 키워드, 카테고리
     * @return 질문 리스트
     */
    @GetMapping
    public ResponseEntity<List<QuestionListResponse>> getQuestions(
            @ModelAttribute QuestionListRequest request){

        log.info("questionListRequest : {}", request.toString());
        List<QuestionListResponse> response = questionService.getQuestionList(
                request.getPage(),
                request.getKw(),
                request.getSort()
        );
        return ResponseEntity.ok(response);
    }

    /**
     * 권한 or 인증 필요 X
     * @param id Question ID 생성
     * @param request 페이지, 정렬순서
     * @return
     */
    @GetMapping("/{id}")
    public ResponseEntity<QuestionDetailResponse> getQuestionDetail(
            @PathVariable Long id,
            @ModelAttribute QuestionDetailRequest request){

        return questionService.getQuestionDetail(id, request.getAnswerPage(), request.getSort())
                .map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * 권한 & 인증 필요
     * @return 선택용 카테고리 리스트 반환
     */
    @GetMapping("/new")
    public ResponseEntity<List<Category>> createQuestion(Principal principal){
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        return Optional.of(categoryService.getCategories())
                .map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * 권한 & 인증 필요
     * @return
     */
    @PostMapping
    public ResponseEntity<QuestionListResponse> createQuestion(@RequestBody QuestionCreateRequest request){
        // TODO : 미인증 시, 예외 반환 + username 실제 username 으로 넘기기
        log.info("questionCreateRequest : {}", request.toString());
        Question question = questionService.createQuestion(/*username*/ "user1", request.getSubject(), request.getContent(), request.getCategory());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(createQuestionListResponse(question));
    }

    /**
     * 권한 & 인증 필요 , 작성자 본인여부 확인 필요
     * @param id 질문 ID
     * @return
     */
    @GetMapping("/{id}/edit")
    public ResponseEntity<QuestionCreateResponse> modifyQuestion(@PathVariable Long id){
        // TODO : 미인증 시, 예외 반환
        return ResponseEntity.ok(questionService.getCreateResponse(id));
    }

    /**
     * 권한 & 인증 필요 , 작성자 본인여부 확인 필요
     * @param id
     * @param request
     * @return
     */
    @PutMapping("/{id}")
    public ResponseEntity<Void> modifyQuestion(@PathVariable Long id,
                                                 @RequestBody QuestionCreateRequest request) {
        // TODO : 미인증 시, 예외 반환
        questionService.modifyQuestion(id, request.getSubject(), request.getContent(), request.getCategory());
        return ResponseEntity.ok().build();
    }

    /**
     * 권한 인증 필요 + 자신이 작성한 질문에 한해서 가능
     * @param id 질문 ID
     * @return 처리 상태코드 반환
     */
    @DeleteMapping("{id}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable Long id){
        // TODO :  Username을 현재 세션의 username으로 검색하게끔 수정
        questionService.deleteQuestion(/*username*/ "user1", id);
        return ResponseEntity.noContent().build();
    }

    /**
     * 권한 인증 필요
     * @param id 질문 ID
     * @return 처리 상태코드 반환
     */
    @PostMapping("/vote/{id}")
    public ResponseEntity<Void> voteQuestion(@PathVariable Long id){
        // TODO :  Username을 현재 세션의 username으로 검색하게끔 수정
        questionService.voteQuestion(/*username*/ "user1", id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/views")
    public ResponseEntity<Void> viewQuestion(@PathVariable Long id){
        questionService.addViews(id);
        return ResponseEntity.ok().build();
    }
}
