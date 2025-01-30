package com.ssafy.api.controller;

import com.ssafy.api.request.CreateAccessTokenReq;
import com.ssafy.api.response.CreateAccessTokenRes;
import com.ssafy.api.service.TokenService;
import io.swagger.annotations.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@Api(value = "리프레시 토큰 API", tags = {"Refresh Token"})
@RequiredArgsConstructor
@RestController
public class TokenApiController {

    private final TokenService tokenService;

    @PostMapping("/api/token")
    @ApiOperation(value = "액세스 토큰 생성", notes = "리프레시 토큰을 기반으로 액세스 토큰을 생성합니다.")
    public ResponseEntity<CreateAccessTokenRes> createNewAccessToken(@RequestBody @ApiParam(value = "리프레시 토큰", required = true) CreateAccessTokenReq request) {
        String newAccessToken = tokenService.createNewAccessToken(request.getRefreshToken());

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new CreateAccessTokenRes(newAccessToken));
    }
}
