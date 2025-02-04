package com.ssafy.api.controller;

import com.ssafy.common.util.CookieUtil;
import com.ssafy.db.entity.RefreshToken;
import com.ssafy.db.repository.RefreshTokenRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.api.request.UserLoginPostReq;
import com.ssafy.api.response.UserLoginPostRes;
import com.ssafy.api.service.UserService;
import com.ssafy.common.model.response.BaseResponseBody;
import com.ssafy.common.util.JwtTokenUtil;
import com.ssafy.db.entity.User;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.time.Duration;
import java.time.Instant;

/**
 * 인증 관련 API 요청 처리를 위한 컨트롤러 정의.
 */
@Tag(name = "Auth", description = "인증 API")
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

	private final UserService userService;         // 생성자 주입
	private final PasswordEncoder passwordEncoder; // PasswordEncoder 주입

	public static final String REFRESH_TOKEN_COOKIE_NAME = "refresh_token";
	public static final Duration REFRESH_TOKEN_DURATION = Duration.ofDays(14);
	public static final String ACCESS_TOKEN_COOKIE_NAME = "access_token";
	public static final Duration ACCESS_TOKEN_DURATION = Duration.ofDays(1);
	private final RefreshTokenRepository refreshTokenRepository;

	@PostMapping("/login")
	@Operation(summary = "로그인", description = "<strong>아이디와 패스워드</strong>를 통해 로그인 한다.")
	@ApiResponses({
			@ApiResponse(responseCode = "200", description = "성공"),
			@ApiResponse(responseCode = "401", description = "인증 실패"),
			@ApiResponse(responseCode = "404", description = "사용자 없음"),
			@ApiResponse(responseCode = "500", description = "서버 오류")
	})
	public ResponseEntity<BaseResponseBody> login(
			@RequestBody @Parameter(description = "로그인 정보", required = true) UserLoginPostReq loginInfo,
									HttpServletRequest request, HttpServletResponse response) {
		String userId = loginInfo.getId();
		String password = loginInfo.getPassword();

		User user = userService.getUserByUserId(userId);

		// 소셜 로그인 사용자는 일반 로그인 불가능!
		if (user.isSocialUser()) {
			throw new IllegalArgumentException("소셜 로그인 사용자는 일반 로그인할 수 없습니다.");
		}

		// 로그인 요청한 유저로부터 입력된 패스워드 와 디비에 저장된 유저의 암호화된 패스워드가 같은지 확인.(유효한 패스워드인지 여부 확인)
		if (passwordEncoder.matches(password, user.getPassword())) {
			// ✅ Access Token & Refresh Token 생성
			String accessToken = JwtTokenUtil.getToken(userId);
			String refreshToken = JwtTokenUtil.getToken(getExpirationDate(REFRESH_TOKEN_DURATION), userId);

			// ✅ Access Token 저장 (쿠키)
			addAccessTokenToCookie(request, response, accessToken);


			// ✅ Refresh Token 저장 (DB & 쿠키)
			saveRefreshToken(user.getId(), refreshToken);
			addRefreshTokenToCookie(request, response, refreshToken);

			// 유효한 패스워드가 맞는 경우, 로그인 성공으로 응답.(액세스 토큰을 포함하여 응답값 전달)
			return ResponseEntity.ok(BaseResponseBody.of(200, "Success"));
		}
		// 유효하지 않는 패스워드인 경우, 로그인 실패로 응답.
		return ResponseEntity.status(401).body(BaseResponseBody.of(401, "Invalid Password"));
	}

	@PostMapping("/logout")
	public ResponseEntity<BaseResponseBody> logout(HttpServletRequest request, HttpServletResponse response) {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		if (auth != null) {
			new SecurityContextLogoutHandler().logout(request, response, auth);
		}

		// ✅ Access Token & Refresh Token 삭제
		CookieUtil.deleteCookie(request, response, "access_token");
		CookieUtil.deleteCookie(request, response, "refresh_token");

		return ResponseEntity.ok(BaseResponseBody.of(200, "Logout Successful"));
	}

	// 리프레시 토큰 관련 메서드 구현

	private void saveRefreshToken(Long userId, String newRefreshToken) {
		RefreshToken refreshToken = refreshTokenRepository.findByUserId(userId)
				.map(entity -> entity.update(newRefreshToken))
				.orElse(new RefreshToken(userId, newRefreshToken));

		refreshTokenRepository.save(refreshToken);
	}

	private void addAccessTokenToCookie(HttpServletRequest request, HttpServletResponse response, String accessToken) {
		int cookieMinAge = (int) ACCESS_TOKEN_DURATION.getSeconds();

		CookieUtil.deleteCookie(request, response, ACCESS_TOKEN_COOKIE_NAME);
		CookieUtil.addCookie(response, ACCESS_TOKEN_COOKIE_NAME, accessToken, cookieMinAge);
	}

	private void addRefreshTokenToCookie(HttpServletRequest request, HttpServletResponse response, String refreshToken) {
		int cookieMaxAge = (int) REFRESH_TOKEN_DURATION.getSeconds();
		int cookieMinAge = (int) ACCESS_TOKEN_DURATION.getSeconds();

		CookieUtil.deleteCookie(request, response, REFRESH_TOKEN_COOKIE_NAME);
		CookieUtil.addCookie(response, REFRESH_TOKEN_COOKIE_NAME, refreshToken, cookieMaxAge);
		CookieUtil.deleteCookie(request, response, "access_token");
		CookieUtil.addCookie(response, "access_token", refreshToken, cookieMinAge);
	}

	private Instant getExpirationDate(Duration duration) {
		return Instant.now().plusSeconds(duration.getSeconds());
	}
}
