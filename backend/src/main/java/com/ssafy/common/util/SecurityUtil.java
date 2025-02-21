package com.ssafy.common.util;

import com.ssafy.common.auth.SsafyUserDetails;
import com.ssafy.db.entity.User;
import com.ssafy.db.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolderStrategy;
import org.springframework.stereotype.Component;

@Component
public class SecurityUtil {

    private final UserRepository userRepository;
    private final SecurityContextHolderStrategy securityContextHolderStrategy;

    public SecurityUtil(UserRepository userRepository, SecurityContextHolderStrategy securityContextHolderStrategy) {
        this.userRepository = userRepository;
        this.securityContextHolderStrategy = securityContextHolderStrategy;
    }

    public User getCurrentUser() {
        Authentication auth = securityContextHolderStrategy.getContext().getAuthentication();
        if (auth == null) {
            throw new SecurityException("인증된 사용자 정보가 없습니다.");
        }
        Object principal = auth.getPrincipal();
        String userId;
        if (principal instanceof SsafyUserDetails) {
            userId = ((SsafyUserDetails) principal).getUsername();
        } else if (principal instanceof String) {
            userId = (String) principal;
        } else {
            throw new SecurityException("인증 정보 형식이 올바르지 않습니다: " + principal.getClass().getName());
        }
        return userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
    }
}
