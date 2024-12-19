package com.ll.restarticlesite.api.dto.request.user;

import lombok.Data;

@Data
public class UserPasswordUpdateRequest {
    private String oldPassword;
    private String newPassword;
    private String checkPassword;
}
