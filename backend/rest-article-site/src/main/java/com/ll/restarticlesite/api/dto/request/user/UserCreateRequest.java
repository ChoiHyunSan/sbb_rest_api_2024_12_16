package com.ll.restarticlesite.api.dto.request.user;

import lombok.Data;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Data
public class UserCreateRequest {
    @NotBlank(message = "{validation.required}")
    @Size(min = 3, max = 20, message = "{validation.size.min}")
    private String username;

    @NotBlank(message = "{validation.required}")
    @Size(min = 8, max = 20, message = "{validation.size.min}")
    private String password1;

    @NotBlank(message = "{validation.required}")
    private String password2;

    @NotBlank(message = "{validation.required}")
    @Email(message = "{validation.email}")
    private String email;
}
