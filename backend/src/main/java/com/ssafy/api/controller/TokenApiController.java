package com.ssafy.api.controller;

import com.ssafy.api.request.CreateAccessTokenReq;
import com.ssafy.api.response.CreateAccessTokenRes;
import com.ssafy.api.service.TokenService;
import com.ssafy.common.util.CookieUtil;
import com.ssafy.common.util.JwtTokenUtil;
import io.swagger.v3.oas.annotations.Parameter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;

//@Api(value = "리프레시 토큰 API", tags = {"Refresh Token"})
@RequestMapping("/api/v1/token")
@RequiredArgsConstructor
@RestController
public class TokenApiController {

    private final TokenService tokenService;

    public static final String ACCESS_TOKEN_COOKIE_NAME = "access_token";
    public static final Duration ACCESS_TOKEN_DURATION = Duration.ofDays(1);

    @PostMapping("/refresh")
//    @ApiOperation(value = "액세스 토큰 생성", notes = "리프레시 토큰을 기반으로 액세스 토큰을 생성합니다.")
    public ResponseEntity<CreateAccessTokenRes> createNewAccessToken(@RequestBody @Parameter(description = "리프레시 토큰", required = true) CreateAccessTokenReq request,
                                                                     HttpServletRequest req, HttpServletResponse response) {
        String newAccessToken = tokenService.createNewAccessToken(request.getRefreshToken());

        // ✅ 새 Access Token 저장 (쿠키)
        addAccessTokenToCookie(req, response, newAccessToken);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new CreateAccessTokenRes(newAccessToken));
    }

    @GetMapping("/validate")
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
