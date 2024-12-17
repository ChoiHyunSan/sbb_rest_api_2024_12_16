package com.ll.restarticlesite.api.v1;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ll.restarticlesite.api.dto.request.answer.AnswerCreateRequest;
import com.ll.restarticlesite.api.dto.response.answer.AnswerListResponse;
import com.ll.restarticlesite.domain.answer.Answer;
import com.ll.restarticlesite.domain.answer.AnswerRepository;
import com.ll.restarticlesite.domain.question.Question;
import com.ll.restarticlesite.domain.question.QuestionRepository;
import com.ll.restarticlesite.domain.user.User;
import com.ll.restarticlesite.domain.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
public class AnswerRestControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private AnswerRepository answerRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private UserRepository userRepository;

    private User testUser;
    private Question testQuestion;

    @BeforeEach
    void setUp() {
        // 테스트용 사용자 생성
        testUser = userRepository.save(User.builder()
                .username("testUser")
                .email("test@test.com")
                .password("password")
                .build());

        // 테스트용 질문 생성
        testQuestion = questionRepository.save(Question.builder()
                .subject("테스트 질문")
                .content("테스트 질문 내용")
                .user(testUser)
                .answerList(new ArrayList<>())
                .build());

        // 테스트용 답변들 생성
        for (int i = 1; i <= 3; i++) {
            Answer answer = Answer.createAnswer(
                    testQuestion,
                    "테스트 답변 " + i,
                    testUser
            );
            answerRepository.save(answer);
        }
    }

    @Test
    @DisplayName("답변 목록 조회 - N+1 문제 확인")
    void getAnswers() throws Exception {
        // given
        // 추가 테스트 데이터 생성
        User anotherUser = userRepository.save(User.builder()
                .username("anotherUser")
                .email("another@test.com")
                .password("password")
                .build());

        Question anotherQuestion = questionRepository.save(Question.builder()
                .subject("다른 질문")
                .content("다른 질문 내용")
                .user(anotherUser)
                .answerList(new ArrayList<>())
                .build());

        // 다른 사용자, 다른 질문에 대한 답변 추가
        for (int i = 1; i <= 3; i++) {
            Answer answer = Answer.createAnswer(
                    anotherQuestion,
                    "다른 답변 " + i,
                    anotherUser
            );
            answerRepository.save(answer);
        }

        System.out.println("=== 답변 목록 조회 시작 ===");

        // when & then
        String response = mockMvc.perform(get("/api/v1/answers")
                        .param("page", "0"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(10)))
                .andReturn()
                .getResponse()
                .getContentAsString();

        System.out.println("=== 응답 내용 ===");
        System.out.println(response);
        System.out.println("=== 테스트 종료 ===");
    }

    @Test
    @DisplayName("답변 생성 - 성공")
    void addAnswer() throws Exception {
        // given
        String newAnswerContent = "새로운 답변입니다.";
        AnswerCreateRequest request = new AnswerCreateRequest(newAnswerContent);

        // when
        mockMvc.perform(post("/api/v1/answers/" + testQuestion.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.content").value(newAnswerContent));

        // then
        Answer savedAnswer = answerRepository.findAll().stream()
                .filter(a -> a.getContent().equals(newAnswerContent))
                .findFirst()
                .orElseThrow();

        System.out.println(savedAnswer.getUser().getUsername());

        assertThat(savedAnswer).isNotNull();
        assertThat(savedAnswer.getContent()).isEqualTo(newAnswerContent);
        assertThat(savedAnswer.getQuestion().getId()).isEqualTo(testQuestion.getId());
    }

    @Test
    @DisplayName("답변 생성 - 잘못된 질문 ID")
    void addAnswer_withInvalidQuestionId() throws Exception {
        // given
        Long invalidQuestionId = 999999L;
        AnswerCreateRequest request = new AnswerCreateRequest("새로운 답변");

        // when & then
        mockMvc.perform(post("/api/v1/answers/" + invalidQuestionId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound());
    }
}