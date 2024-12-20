package com.ll.restarticlesite.api.dto.request.category;

import lombok.Builder;
import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Data
@Builder
public class CategoryCreateRequest {
    @NotBlank(message = "{validation.required}")
    @Size(min = 2, max = 20, message = "{validation.size.min}")
    private String name;

    public static CategoryCreateRequest createCategoryCreateRequest(String name) {
        return CategoryCreateRequest.builder()
                .name(name).build();
    }
}
