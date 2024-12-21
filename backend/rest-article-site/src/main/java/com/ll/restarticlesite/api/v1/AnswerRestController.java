package com.ll.restarticlesite.api.v1;

import com.ll.restarticlesite.api.dto.request.answer.AnswerCreateRequest;
import com.ll.restarticlesite.api.dto.request.answer.AnswerListRequest;
import com.ll.restarticlesite.api.dto.request.comment.CommentCreateRequest;
import com.ll.restarticlesite.api.dto.response.answer.AnswerCreateResponse;
import com.ll.restarticlesite.api.dto.response.answer.AnswerListResponse;
import com.ll.restarticlesite.api.dto.response.answer.AnswerDetailResponse;
import com.ll.restarticlesite.api.dto.response.comment.CommentDetailResponse;
import com.ll.restarticlesite.domain.answer.Answer;
import com.ll.restarticlesite.domain.answer.AnswerService;
import com.ll.restarticlesite.domain.comment.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.security.Principal;
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
    @PreAuthorize("isAuthenticated()")
    @PostMapping("/{id}")
    public ResponseEntity<AnswerDetailResponse> addAnswer(@PathVariable Long id,
                                                          @Valid @RequestBody AnswerCreateRequest request,
                                                          Principal principal){
        Answer answer = answerService.createAnswer(principal.getName(), id, request.getContent());
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
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/edit/{id}")
    public ResponseEntity<AnswerCreateResponse> modifyAnswer(@PathVariable Long id,
                                                             Principal principal){
        return ResponseEntity.ok().body(answerService.getAnswerCreateResponse(principal.getName(), id));
    }

    /**
     * 권한 & 인증 필요 , 작성자 본인여부 확인 필요
     * @param id 답변 ID
     * @return 상태 코드 전달 (페이징을 다시 해야하므로, 다시 Detail 을 조사하는 편이 나은 것으로 판단.)
     */
    @PreAuthorize("isAuthenticated()")
    @PutMapping("/{id}")
    public ResponseEntity<Void> modifyAnswer(@PathVariable Long id,
                                             @Valid @RequestBody AnswerCreateRequest request,
                                             Principal principal){
        answerService.modifyAnswer(principal.getName(), id, request.getContent());
        return ResponseEntity.ok().build();
    }

    /**
     * 권한 인증 필요 + 자신이 작성한 질문에 한해서 가능
     * @param id 질문 ID
     * @return 처리 상태코드 반환
     */
    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("{id}")
    public ResponseEntity<Void> deleteAnswer(@PathVariable Long id,
                                             Principal principal){
        answerService.deleteAnswer(principal.getName(), id);
        return ResponseEntity.noContent().build();
    }

    /**
     * 권한 인증 필요
     * @param id 답변 ID
     * @return 처리 상태코드 반환
     */
    @PreAuthorize("isAuthenticated()")
    @PostMapping("/vote/{id}")
    public ResponseEntity<Void> voteAnswer(@PathVariable Long id,
                                           Principal principal){
        answerService.voteAnswer(principal.getName(), id);
        return ResponseEntity.ok().build();
    }


    @GetMapping("comment/{id}")
    public ResponseEntity<List<CommentDetailResponse>> getComments(@PathVariable Long id){
        return ResponseEntity.ok().body(answerService.getComments(id));
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/comment/{id}")
    public ResponseEntity<Void> commentAnswer(@PathVariable Long id,
                                              Principal principal,
                                              @RequestBody CommentCreateRequest request){
        answerService.commentAnswer(principal.getName(), id, request.getContent());
        return ResponseEntity.ok().build();
    }

}
