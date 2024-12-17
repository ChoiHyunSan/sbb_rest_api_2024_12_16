package com.ll.restarticlesite.api.v1;

import com.ll.restarticlesite.api.dto.request.answer.AnswerCreateRequest;
import com.ll.restarticlesite.api.dto.request.answer.AnswerListRequest;
import com.ll.restarticlesite.api.dto.response.answer.AnswerListResponse;
import com.ll.restarticlesite.api.dto.response.answer.AnswerResponse;
import com.ll.restarticlesite.domain.answer.Answer;
import com.ll.restarticlesite.domain.answer.AnswerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.ll.restarticlesite.api.dto.response.answer.AnswerResponse.createAnswerResponse;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/answers")
public class AnswerRestController {

    private final AnswerService answerService;

    /**
     * 권한 & 인증 필요 X
     * @param request page
     * @return 반환 상태 코드 전달
     */
    @GetMapping
    public ResponseEntity<List<AnswerListResponse>> getAnswers(@ModelAttribute AnswerListRequest request){
        List<AnswerListResponse> responses = answerService.getAnswerResponsePage(request.getPage());
        return ResponseEntity.ok(responses);
    }

    /**
     * 인증 & 권한 필요
     * @param id 질문 ID
     * @param request page
     * @return 생성한 Answer 정보 및 상태 코드 전달
     */
    @PostMapping("/{id}")
    public ResponseEntity<AnswerResponse> addAnswer(@PathVariable Long id,
                                                        @RequestBody AnswerCreateRequest request){
        // TODO : 미인증 시, 예외 반환
        // TODO : user1을 현재 세션의 username으로 검색하게끔 수정
        Answer answer = answerService.createAnswer(/*username*/ "user1", id, request.getContent());
        createAnswerResponse(answer);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(createAnswerResponse(answer));
    }
}
