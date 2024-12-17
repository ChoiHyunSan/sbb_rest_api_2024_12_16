package com.ll.restarticlesite.api.dto.request.category;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CategoryCreateRequest {
    private String name;

    public static CategoryCreateRequest createCategoryCreateRequest(String name) {
        return CategoryCreateRequest.builder()
                .name(name).build();
    }
}
