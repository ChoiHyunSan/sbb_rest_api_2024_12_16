package com.ll.restarticlesite.domain.user;

import com.ll.restarticlesite.domain.BaseEntity;
import com.ll.restarticlesite.security.Role;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Getter
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true, callSuper = false)
@AllArgsConstructor
@ToString
public class User extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    @EqualsAndHashCode.Include
    private long id;

    @Column(unique = true)
    private String username;
    private String email;
    private String password;

    @ElementCollection(fetch = FetchType.EAGER)
    @Enumerated(EnumType.STRING)
    private Set<Role> roles = new HashSet<>();

    private String picture;    // 프로필 이미지 URL

    private String provider;   // 소셜 로그인 제공자

    private String providerId; // 소셜 로그인 제공자에서의 ID

    protected User() {}

    public static User createUser(String username, String email, String password) {
        User user = new User();
        user.username = username;
        user.email = email;
        user.password = password;
        return user;
    }

    public static User createSocialUser(String nickname, String email, String picture, String provider, String providerId) {
        User author = new User();
        author.username = nickname;
        author.email = email;
        author.password = UUID.randomUUID().toString(); // 소셜 로그인 유저는 임의의 비밀번호
        author.picture = picture;
        author.provider = provider;
        author.providerId = providerId;
        return author;
    }

    // 소셜 로그인 정보 업데이트 메서드
    public User update(String username, String picture) {
        this.username = username;
        this.picture = picture;
        return this;
    }

    public void modifyPassword(String newPassword) {
        this.password = newPassword;
    }
}
