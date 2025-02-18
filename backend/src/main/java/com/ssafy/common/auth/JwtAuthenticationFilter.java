package com.ssafy.common.auth;

import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.ssafy.api.service.UserService;
import com.ssafy.common.util.JwtTokenUtil;
import com.ssafy.common.util.ResponseBodyWriteUtil;
import com.ssafy.db.entity.User;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;

/**
 * 요청 헤더에 jwt 토큰이 있는 경우, 토큰 검증 및 인증 처리 로직 정의.
 */
public class JwtAuthenticationFilter extends BasicAuthenticationFilter {
	private UserService userService;
	
	public JwtAuthenticationFilter(AuthenticationManager authenticationManager, UserService userService) {
		super(authenticationManager);
		this.userService = userService;
	}

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {

        try {
            // If header is present, try grab user principal from database and perform authorization
            Authentication authentication = getAuthentication(request);
            // jwt 토큰으로 부터 획득한 인증 정보(authentication) 설정.
            SecurityContextHolder.getContext().setAuthentication(authentication);
        } catch (Exception ex) {
            ResponseBodyWriteUtil.sendError(request, response, ex);
            return;
        }
        
        filterChain.doFilter(request, response);
	}

    @Transactional(readOnly = true)
    public Authentication getAuthentication(HttpServletRequest request) throws Exception {
        // 1️⃣ Authorization 헤더에서 가져오기
        String token = extractToken(request);

        if (token != null) {
            JWTVerifier verifier = JwtTokenUtil.getVerifier();
            JwtTokenUtil.handleError(token);
            DecodedJWT decodedJWT = verifier.verify(token.replace(JwtTokenUtil.TOKEN_PREFIX, ""));
            String userId = decodedJWT.getSubject();

            if (userId != null) {
                User user = userService.getUserByUserId(userId);
                if (user != null) {
                    SsafyUserDetails userDetails = new SsafyUserDetails(user);
                    UsernamePasswordAuthenticationToken jwtAuthentication =
                            new UsernamePasswordAuthenticationToken(userId, null, userDetails.getAuthorities());
                    jwtAuthentication.setDetails(userDetails);
                    return jwtAuthentication;
                }
            }
        }
        return null;
    }

    private String extractToken(HttpServletRequest request) {
        // 1️⃣ Authorization 헤더 확인
        String headerToken = request.getHeader(JwtTokenUtil.HEADER_STRING);
        if (headerToken != null && headerToken.startsWith(JwtTokenUtil.TOKEN_PREFIX)) {
            return headerToken;
        }

        // 2️⃣ HttpOnly 쿠키에서 가져오기
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                System.out.println("🔍 [DEBUG] 쿠키 이름: " + cookie.getName() + ", 값: " + cookie.getValue());
                if ("access_token".equals(cookie.getName())) {
                    return JwtTokenUtil.TOKEN_PREFIX + cookie.getValue(); // Bearer 붙이기
                }
            }
        }

        System.out.println("❌ [ERROR] access_token 쿠키가 서버에 없음.");
        return null;
    }

}
