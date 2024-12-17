package com.ll.restarticlesite.api.v1;

import com.ll.restarticlesite.api.dto.request.category.CategoryCreateRequest;
import com.ll.restarticlesite.domain.category.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/categories")
public class CategoryRestController {

    private final CategoryService categoryService;

    /**
     * 권한 (ADMIN 필요 ) & 인증 필요
     * @return
     */
    @GetMapping("/new")
    public ResponseEntity<Void> getCategoryForm(){
        // TODO : 인증 확인
        return ResponseEntity.ok().build();
    }

    /**
     * 권한 (ADMIN 필요) & 인증 필요
     * @param request 카테고리 DTO
     * @return 카테고리 추가 여부 상태 코드
     */
    @PostMapping
    public ResponseEntity<Void> createCategory(@RequestBody CategoryCreateRequest request) {
        categoryService.createCategory(request.getName());
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
