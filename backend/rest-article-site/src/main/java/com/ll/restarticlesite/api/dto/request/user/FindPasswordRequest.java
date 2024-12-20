package com.ll.restarticlesite.api.dto.request.user;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class FindPasswordRequest {
    @NotNull
    private String username;
    @NotNull
    private String email;
}
