package com.ll.restarticlesite.api.v1;

import com.ll.restarticlesite.api.dto.request.user.UserCreateRequest;
import com.ll.restarticlesite.api.dto.request.user.UserPasswordUpdateRequest;
import com.ll.restarticlesite.domain.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequiredArgsConstructor
@RequestMapping("/api/v1/users")
public class UserController {

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
        // TODO : 회원가입 처리
        return ResponseEntity.ok().build();
    }

    // 로그인은 스프링 시큐리티로 대체
    // 비밀번호 찾기 (비밀번호 폼 이동 요청, 비밀번호 변경 요청)
    // 추후에 만들기
}
