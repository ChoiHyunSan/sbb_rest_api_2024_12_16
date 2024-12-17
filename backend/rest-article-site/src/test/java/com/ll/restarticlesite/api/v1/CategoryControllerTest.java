package com.ll.restarticlesite.api.v1;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.ll.restarticlesite.api.dto.request.category.CategoryCreateRequest;
import com.ll.restarticlesite.domain.category.CategoryService;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class CategoryControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private CategoryService categoryService;

    @Test
    @DisplayName("카테고리 폼 페이지 접근 - 성공")
    void getCategoryForm_success() throws Exception {
        // when & then
        mockMvc.perform(get("/api/v1/categories/new"))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("카테고리 생성 - 성공")
    void createCategory_success() throws Exception {
        // given
        CategoryCreateRequest request = CategoryCreateRequest.createCategoryCreateRequest("테스트 카테고리");
        String content = objectMapper.writeValueAsString(request);

        // when & then
        mockMvc.perform(post("/api/v1/categories")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(content))
                .andExpect(status().isCreated());
    }

    @Test
    @DisplayName("카테고리 생성 - 실패 (잘못된 요청 바디)")
    void createCategory_fails_invalidRequestBody() throws Exception {
        // given
        String invalidContent = "invalid json format";

        // when & then
        mockMvc.perform(post("/api/v1/categories")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidContent))
                .andExpect(status().isBadRequest());
    }
}