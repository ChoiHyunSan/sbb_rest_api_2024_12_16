package com.ll.restarticlesite.api.dto.request.user;

import com.ll.restarticlesite.domain.user.User;
import lombok.Data;

@Data
public class UserProfileRequest {
    private String name;
    private String email;

    public static UserProfileRequest createUserProfileRequest(User author) {
        UserProfileRequest dto = new UserProfileRequest();
        dto.setName(author.getUsername());
        dto.setEmail(author.getEmail());
        return dto;
    }
}
