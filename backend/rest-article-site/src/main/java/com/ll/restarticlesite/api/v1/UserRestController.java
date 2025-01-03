package com.ll.restarticlesite.api.v1;

import com.ll.restarticlesite.api.dto.request.ProfileRequest;
import com.ll.restarticlesite.api.dto.request.user.FindPasswordRequest;
import com.ll.restarticlesite.api.dto.request.user.UserCreateRequest;
import com.ll.restarticlesite.api.dto.request.user.UserPasswordUpdateRequest;
import com.ll.restarticlesite.api.dto.response.user.FindPasswordResponse;
import com.ll.restarticlesite.domain.user.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

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
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/edit")
    public ResponseEntity<Void> requestUserUpdate(){
        return ResponseEntity.ok().build();
    }

    /**
     * 권한 & 인증 필요
     * @param request
     * @return 상태 코드 반환
     */
    @PreAuthorize("isAuthenticated()")
    @PutMapping
    public ResponseEntity<Void> updateUser(@RequestBody UserPasswordUpdateRequest request){
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
    @PostMapping()
    public ResponseEntity<?> signup(@Valid @RequestBody UserCreateRequest request) {
        log.info(request.toString());
        userService.createUser(request.getUsername(), request.getEmail(), request.getPassword1(), request.getPassword2());
        return ResponseEntity.ok().build();
    }

    /**
     * 권한 인증 필요
     * @return 로그인 상태에 대한 상태코드 반환
     */
    @GetMapping("/status")
    public ResponseEntity<?> checkAuthStatus(Principal principal) {
        if (principal != null) {
            Map<String, Object> response = new HashMap<>();
            response.put("username", principal.getName());
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    /**
     * 권한 인증 필요
     * @return 프로필 정보 및 상태코드 반환
     */
    @GetMapping("/profile")
    public ResponseEntity<ProfileRequest> profile(Principal principal) {
        return ResponseEntity.ok().body(userService.getProfile(principal.getName()));
    }

    /**
     * 권한 인증 필요
     * @param request 기존 비밀번호 및 새 비밀번호 값
     * @return 비밀번호 변경에 대한 상태코드 반환
     */
    @PatchMapping("/update-password")
    public ResponseEntity<Void> updatePassword(Principal principal,
                                               @Valid @RequestBody UserPasswordUpdateRequest request) {
        userService.modifyPassword(principal.getName(),
                request.getOldPassword(),
                request.getNewPassword(),
                request.getCheckPassword());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/find-password")
    public ResponseEntity<FindPasswordResponse> findPassword(Principal principal,
                                                             @Valid @RequestBody FindPasswordRequest request) {
        return ResponseEntity.ok().body(userService.findPassword(request.getUsername(), request.getEmail()));
    }
}
