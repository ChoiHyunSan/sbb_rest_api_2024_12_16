package com.ll.restarticlesite.api.dto.request.user;

import com.ll.restarticlesite.domain.user.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class UserProfileRequest {
    private String name;
    private String email;

    public static UserProfileRequest createUserProfileRequest(User author) {
        return UserProfileRequest.builder()
                .name(author.getUsername())
                .email(author.getEmail())
                .build();
    }
}
