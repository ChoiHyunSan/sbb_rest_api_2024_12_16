package com.ll.restarticlesite.api.dto.request.user;

import lombok.Data;

@Data
public class UserCreateRequest {
    private String username;
    private String password1;
    private String password2;
    private String email;
}
