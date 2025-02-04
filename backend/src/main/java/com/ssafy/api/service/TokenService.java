package com.ssafy.api.service;

import com.ssafy.common.util.JwtTokenUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class TokenService {

    public String createNewAccessToken(String refreshToken) {
        // 리프레시 토큰 검증
        if (!JwtTokenUtil.isValidToken(refreshToken)) {
            throw new IllegalArgumentException("Invalid or expired refresh token");
        }

        // 리프레시 토큰에서 사용자 ID 추출
        String userId = JwtTokenUtil.getVerifier().verify(refreshToken).getSubject();

        // 새로운 액세스 토큰 생성
        return JwtTokenUtil.getToken(userId);
    }
}
