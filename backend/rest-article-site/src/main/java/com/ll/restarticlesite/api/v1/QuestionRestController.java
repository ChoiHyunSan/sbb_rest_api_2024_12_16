package com.ll.restarticlesite.api.v1;

import com.ll.restarticlesite.api.dto.request.QuestionCreateRequest;
import com.ll.restarticlesite.api.dto.request.QuestionDetailRequest;
import com.ll.restarticlesite.api.dto.request.QuestionListRequest;
import com.ll.restarticlesite.api.dto.response.QuestionCreateResponse;
import com.ll.restarticlesite.api.dto.response.QuestionDetailResponse;
import com.ll.restarticlesite.api.dto.response.QuestionListResponse;
import com.ll.restarticlesite.domain.category.Category;
import com.ll.restarticlesite.domain.category.CategoryService;
import com.ll.restarticlesite.domain.question.QuestionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

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
    public ResponseEntity<List<Category>> createQuestion(){
        // TODO : 미인증 시, 예외 반환
        return Optional.of(categoryService.getCategories())
                .map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * 권한 & 인증 필요
     * @return
     */
    @PostMapping
    public ResponseEntity<Void> createQuestion(@RequestBody QuestionCreateRequest request){
        // TODO : 미인증 시, 예외 반환 + username 실제 username 으로 넘기기
        log.info("questionCreateRequest : {}", request.toString());
        questionService.createQuestion(/*username*/ "user1", request.getSubject(), request.getContent(), request.getCategory());
        return ResponseEntity.ok().build();
    }

    /**
     * 권한 & 인증 필요
     * @param id 질문 ID
     * @return
     */
    @GetMapping("/{id}/edit")
    public ResponseEntity<QuestionCreateResponse> modifyQuestion(@PathVariable Long id){
        // TODO : 미인증 시, 예외 반환
        return ResponseEntity.ok(questionService.getCreateResponse(id));
    }

    /**
     * 권한 & 인증 필요
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
}
