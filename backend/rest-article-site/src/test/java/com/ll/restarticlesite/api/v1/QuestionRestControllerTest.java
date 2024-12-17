package com.ll.restarticlesite.api.v1;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

import com.ll.restarticlesite.api.dto.request.question.QuestionCreateRequest;
import com.ll.restarticlesite.domain.category.Category;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import com.fasterxml.jackson.databind.ObjectMapper;


@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class QuestionRestControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("질문 목록 조회 - 성공")
    void getQuestions_success() throws Exception {
        mockMvc.perform(get("/api/v1/questions")
                        .param("page", "0")
                        .param("kw", "테스트")
                        .param("sort", "latest"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[*].id").exists())
                .andExpect(jsonPath("$[*].subject").exists())
                .andExpect(jsonPath("$[*].content").exists())
                .andExpect(jsonPath("$[*].views").exists())
                .andExpect(jsonPath("$[*].updateAt").exists())
                .andExpect(jsonPath("$[*].author").exists())
                .andDo(print());
    }

    @Test
    @DisplayName("질문 상세 조회 - 성공")
    void getQuestionDetail_success() throws Exception {
        Long questionId = 1L; // 존재하는 질문 ID 가정

        mockMvc.perform(get("/api/v1/questions/{id}", questionId)
                        .param("answerPage", "0")
                        .param("sort", "latest"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(questionId))
                .andExpect(jsonPath("$.subject").exists())
                .andExpect(jsonPath("$.content").exists())
                .andExpect(jsonPath("$.createDate").exists())
                .andExpect(jsonPath("$.author").exists())
                .andExpect(jsonPath("$.answerPage").exists())
                .andExpect(jsonPath("$.likes").exists())
                .andExpect(jsonPath("$.views").exists())
                .andDo(print());
    }

    @Test
    @DisplayName("질문 상세 조회 - 실패 (없는 ID)")
    void getQuestionDetail_notFound() throws Exception {
        Long nonExistentId = 9999L;

        mockMvc.perform(get("/api/v1/questions/{id}", nonExistentId)
                        .param("answerPage", "0")
                        .param("sort", "latest"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.timestamp").exists())
                .andDo(print());
    }

    @Test
    @DisplayName("새 질문 작성을 위한 카테고리 목록 조회")
    void getCategories_success() throws Exception {
        mockMvc.perform(get("/api/v1/questions/new"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[*].id").exists())
                .andExpect(jsonPath("$[*].name").exists())
                .andDo(print());
    }

    @Test
    @DisplayName("질문 생성 - 성공")
    void createQuestion_success() throws Exception {
        // given
        Category category = Category.createCategory("테스트 카테고리");
        QuestionCreateRequest request = new QuestionCreateRequest();
        request.setSubject("테스트 제목");
        request.setContent("테스트 내용");
        request.setCategory(category);

        mockMvc.perform(post("/api/v1/questions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andDo(print());
    }

    @Test
    @DisplayName("질문 수정을 위한 데이터 조회")
    void getQuestionForModify_success() throws Exception {
        Long questionId = 1L; // 존재하는 질문 ID 가정

        mockMvc.perform(get("/api/v1/questions/{id}/edit", questionId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.subject").exists())
                .andExpect(jsonPath("$.content").exists())
                .andExpect(jsonPath("$.categories").isArray())
                .andDo(print());
    }

    @Test
    @DisplayName("질문 수정 - 성공")
    void modifyQuestion_success() throws Exception {
        // given
        Long questionId = 1L; // 존재하는 질문 ID 가정
        Category category = Category.createCategory("수정된 카테고리");
        QuestionCreateRequest request = new QuestionCreateRequest();
        request.setSubject("수정된 제목");
        request.setContent("수정된 내용");
        request.setCategory(category);

        mockMvc.perform(put("/api/v1/questions/{id}", questionId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andDo(print());
    }

    @Test
    @DisplayName("질문 삭제 - 성공")
    void deleteQuestion_success() throws Exception {
        // given
        Long questionId = 1L; // 존재하는 질문 ID (테스트 데이터 필요)

        // when & then
        mockMvc.perform(delete("/api/v1/questions/{id}", questionId))
                .andExpect(status().isNoContent())
                .andDo(print());
    }

    @Test
    @DisplayName("질문 삭제 - 실패 (없는 ID)")
    void deleteQuestion_notFound() throws Exception {
        // given
        Long nonExistentId = 9999L;

        // when & then
        mockMvc.perform(delete("/api/v1/questions/{id}", nonExistentId))
                .andExpect(status().isNotFound())
                .andDo(print());
    }

    @Test
    @DisplayName("질문 삭제 - 실패 (권한 없음)")
    void deleteQuestion_forbidden() throws Exception {
        // given
        Long questionId = 16L; // 다른 사용자가 작성한 질문 ID (테스트 데이터 필요)

        // when & then
        mockMvc.perform(delete("/api/v1/questions/{id}", questionId))
                .andExpect(status().isForbidden())
                .andDo(print());
    }

    @Test
    @DisplayName("질문 투표 - 성공")
    void voteQuestion_success() throws Exception {
        // given
        Long questionId = 1L; // 존재하는 질문 ID (테스트 데이터 필요)

        // when & then
        mockMvc.perform(post("/api/v1/questions/vote/{id}", questionId))
                .andExpect(status().isOk())
                .andDo(print());
    }
}