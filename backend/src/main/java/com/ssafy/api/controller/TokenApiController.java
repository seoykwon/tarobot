package com.ssafy.api.controller;

import com.ssafy.api.request.CreateAccessTokenReq;
import com.ssafy.api.response.CreateAccessTokenRes;
import com.ssafy.api.service.TokenService;
import com.ssafy.common.util.CookieUtil;
import com.ssafy.common.util.JwtTokenUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;

@Tag(name = "Refresh Token", description = "리프레시 토큰 API")
@RequestMapping("/api/v1/token")
@RequiredArgsConstructor
@RestController
public class TokenApiController {

    private final TokenService tokenService;

    public static final String ACCESS_TOKEN_COOKIE_NAME = "access_token";
    public static final Duration ACCESS_TOKEN_DURATION = Duration.ofDays(1);

    @PostMapping("/refresh")
    @Operation(summary = "새 액세스 토큰 생성", description = "리프레시 토큰으로 새 액세스 토큰을 생성합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "생성 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<CreateAccessTokenRes> createNewAccessToken(@RequestBody @Parameter(description = "리프레시 토큰", required = true) CreateAccessTokenReq request,
                                                                     HttpServletRequest req, HttpServletResponse response) {
        String newAccessToken = tokenService.createNewAccessToken(request.getRefreshToken());

        // ✅ 새 Access Token 저장 (쿠키)
        addAccessTokenToCookie(req, response, newAccessToken);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new CreateAccessTokenRes(newAccessToken));
    }

    @GetMapping("/validate")
    @Operation(summary = "액세스 토큰 검증", description = "쿠키의 액세스 토큰의 유효성을 확인합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "404", description = "리뷰를 찾을 수 없음"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<?> validateToken(HttpServletRequest request) {
        String token = CookieUtil.getCookieValue(request, "access_token");

        if (token == null || !JwtTokenUtil.isValidToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Token");
        }

        return ResponseEntity.ok("Valid Token");

    }

    private void addAccessTokenToCookie(HttpServletRequest request, HttpServletResponse response, String accessToken) {
        int cookieMinAge = (int) ACCESS_TOKEN_DURATION.getSeconds();

        CookieUtil.deleteCookie(request, response, ACCESS_TOKEN_COOKIE_NAME);
        CookieUtil.addCookie(response, ACCESS_TOKEN_COOKIE_NAME, accessToken, cookieMinAge);
    }
}
