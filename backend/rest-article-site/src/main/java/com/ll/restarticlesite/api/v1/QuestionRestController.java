package com.ll.restarticlesite.api.v1;

import com.ll.restarticlesite.api.dto.request.QuestionDetailRequest;
import com.ll.restarticlesite.api.dto.request.QuestionListRequest;
import com.ll.restarticlesite.api.dto.response.QuestionDetailResponse;
import com.ll.restarticlesite.api.dto.response.QuestionListResponse;
import com.ll.restarticlesite.domain.question.Question;
import com.ll.restarticlesite.domain.question.QuestionService;
import com.ll.restarticlesite.global.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/question")
public class QuestionRestController {

    private final QuestionService questionService;

    /**
     * 질문 리스트 데이터 반환 (권한 or 인증 필요 X)
     * @param questionListRequest 페이지 , 키워드, 카테고리
     * @return 질문 리스트
     */
    @GetMapping("/list")
    public List<QuestionListResponse> getQuestions(
            @ModelAttribute QuestionListRequest questionListRequest){

        log.info("questionListRequest : {}", questionListRequest.toString());
        return questionService.getQuestionList(
                questionListRequest.getPage(),
                questionListRequest.getKw(),
                questionListRequest.getSort()
        );
    }

    @GetMapping("/detail/{id}")
    public ResponseEntity<QuestionDetailResponse> getQuestionDetail(
            @PathVariable Long id,
            @ModelAttribute QuestionDetailRequest questionDetailRequest){

        return questionService.getQuestionDetail(id, questionDetailRequest.getAnswerPage(), questionDetailRequest.getSort())
                .map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
