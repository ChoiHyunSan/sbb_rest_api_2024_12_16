package com.ll.restarticlesite.api.v1;

import com.ll.restarticlesite.api.dto.request.QuestionListRequest;
import com.ll.restarticlesite.api.dto.response.QuestionListResponse;
import com.ll.restarticlesite.domain.question.Question;
import com.ll.restarticlesite.domain.question.QuestionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/question")
public class QuestionRestController {

    private final QuestionService questionService;

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
}
