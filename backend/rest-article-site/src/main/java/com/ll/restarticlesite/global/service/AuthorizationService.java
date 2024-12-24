package com.ll.restarticlesite.global.service;

import com.ll.restarticlesite.domain.user.User;
import com.ll.restarticlesite.global.exception.ForbiddenException;
import com.ll.restarticlesite.global.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthorizationService {

    public void checkResourceOwner(String username, Ownable resource) {
        User resourceUser = resource.getUser();
        if(resourceUser == null) {
            throw new ResourceNotFoundException("User Not Found");
        }

        if(!resourceUser.getUsername().equals(username)) {
            throw new ForbiddenException(
                    "접속한 유저의 리소스가 아닙니다. Username: " + username +
                            " Resource: " + resource.getClass().getSimpleName() + " " + resource.getId());
        }
    }
}
