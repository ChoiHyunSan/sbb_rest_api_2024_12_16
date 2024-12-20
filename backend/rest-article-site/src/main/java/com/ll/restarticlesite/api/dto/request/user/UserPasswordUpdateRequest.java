package com.ll.restarticlesite.api.dto.request.user;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UserPasswordUpdateRequest {
    @NotNull
    private String oldPassword;
    @NotNull
    private String newPassword;
    @NotNull
    private String checkPassword;
}
