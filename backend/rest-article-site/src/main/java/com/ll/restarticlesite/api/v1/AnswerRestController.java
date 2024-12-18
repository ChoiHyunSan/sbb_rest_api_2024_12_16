package com.ll.restarticlesite.api.v1;

import com.ll.restarticlesite.api.dto.request.answer.AnswerCreateRequest;
import com.ll.restarticlesite.api.dto.request.answer.AnswerListRequest;
import com.ll.restarticlesite.api.dto.response.answer.AnswerCreateResponse;
import com.ll.restarticlesite.api.dto.response.answer.AnswerListResponse;
import com.ll.restarticlesite.api.dto.response.answer.AnswerDetailResponse;
import com.ll.restarticlesite.domain.answer.Answer;
import com.ll.restarticlesite.domain.answer.AnswerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.ll.restarticlesite.api.dto.response.answer.AnswerDetailResponse.createAnswerResponse;

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
    public ResponseEntity<AnswerDetailResponse> addAnswer(@PathVariable Long id,
                                                          @RequestBody AnswerCreateRequest request){
        // TODO : 미인증 시, 예외 반환
        // TODO : user1을 현재 세션의 username 으로 검색하게끔 수정
        Answer answer = answerService.createAnswer(/*username*/ "user1", id, request.getContent());
        createAnswerResponse(answer);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(createAnswerResponse(answer));
    }

    /**
     * 권한 & 인증 필요 , 작성자 본인여부 확인 필요
     * @param id 답변 ID
     * @return 기존 답변 값 및 상태 코드 전달
     */
    @GetMapping("/edit/{id}")
    public ResponseEntity<AnswerCreateResponse> modifyAnswer(@PathVariable Long id){
        // TODO : 질문 작성자가 본인인지 확인하는 절차 필요
        return ResponseEntity.ok().body(answerService.getAnswerCreateResponse(/*username*/"user1", id));
    }

    /**
     * 권한 & 인증 필요 , 작성자 본인여부 확인 필요
     * @param id 답변 ID
     * @return 상태 코드 전달 (페이징을 다시 해야하므로, 다시 Detail 을 조사하는 편이 나은 것으로 판단.)
     */
    @PutMapping("/{id}")
    public ResponseEntity<Void> modifyAnswer(@PathVariable Long id,
                                             @RequestBody AnswerCreateRequest request){
        answerService.modifyAnswer(/*username*/"user1", id, request.getContent());
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
        answerService.deleteAnswer(/*username*/ "user1", id);
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
        answerService.voteAnswer(/*username*/ "user1", id);
        return ResponseEntity.ok().build();
    }
}
