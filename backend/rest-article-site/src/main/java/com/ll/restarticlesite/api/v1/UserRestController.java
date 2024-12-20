package com.ll.restarticlesite.api.v1;

import com.ll.restarticlesite.api.dto.request.user.UserCreateRequest;
import com.ll.restarticlesite.api.dto.request.user.UserPasswordUpdateRequest;
import com.ll.restarticlesite.domain.user.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@Slf4j
@Controller
@RequiredArgsConstructor
@RequestMapping("/api/v1/user")
public class UserRestController {

    private final UserService userService;


    /**
     * 권한 & 인증 필요
     * @return 상태 코드 반환
     */
    @GetMapping("/edit")
    public ResponseEntity<Void> requestUserUpdate(){
        // TODO : 로그인 상태라면 회원 수정 폼으로 이동하도록 허용
        return ResponseEntity.ok().build();
    }

    /**
     * 권한 & 인증 필요
     * @param request
     * @return 상태 코드 반환
     */
    @PutMapping
    public ResponseEntity<Void> updateUser(@RequestBody UserPasswordUpdateRequest request){
        // TODO : 입력 값을 통해 기존 비밀번호와 대조 후, 동일하다면 새롭게 받은 비밀번호로 갱신한다.
        userService.modifyPassword("user1",
                request.getOldPassword(),
                request.getNewPassword(),
                request.getOldPassword());
        return ResponseEntity.ok().build();
    }

    /**
     * 권한 & 인증 필요 X
     * @param request 회원가입 폼 정보
     * @return 회원가입 성공여부 상태 코드 반환
     */
    @PostMapping
    public ResponseEntity<Void> createUser(@RequestBody UserCreateRequest request){
        log.info(request.toString());
        userService.createUser(request.getUsername(), request.getEmail(), request.getPassword1(), request.getPassword2());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/status")
    public ResponseEntity<Void> checkAuthStatus(Principal principal) {
        if (principal != null) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
}
