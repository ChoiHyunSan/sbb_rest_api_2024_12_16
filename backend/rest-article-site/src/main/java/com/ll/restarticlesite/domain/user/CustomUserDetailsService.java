package com.ll.restarticlesite.domain.user;

import lombok.RequiredArgsConstructor;
import lombok.ToString;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> _siteUser = userRepository.findByUsername(username);
        if (_siteUser.isEmpty()) {
            throw new UsernameNotFoundException("사용자를 찾을 수 없습니다.");
        }
        User siteUser = _siteUser.get();
        List<GrantedAuthority> authorities = new ArrayList<>();

        log.info(siteUser.toString());

        if ("admin".equals(username)) authorities.add(new SimpleGrantedAuthority(UserRole.ADMIN.getValue()));
        else authorities.add(new SimpleGrantedAuthority(UserRole.USER.getValue()));
        return new org.springframework.security.core.userdetails.User(siteUser.getUsername(), siteUser.getPassword(), authorities);
    }
}
