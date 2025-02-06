package com.ssafy.api.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

/**
 * 유저 로그인 API ([POST] /api/v1/auth/login) 요청에 필요한 리퀘스트 바디 정의.
 */
@Getter
@Setter
@Schema(description = "유저 로그인 요청 모델")
public class UserLoginPostReq {
	@Schema(description = "유저 ID", example = "ssafy_web", requiredMode = Schema.RequiredMode.REQUIRED)
	String id;

	@Schema(description = "유저 Password", example = "your_password", requiredMode = Schema.RequiredMode.REQUIRED)
	String password;
}
