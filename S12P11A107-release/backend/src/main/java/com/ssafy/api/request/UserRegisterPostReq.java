package com.ssafy.api.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

/**
 * 유저 회원가입 API ([POST] /api/v1/users) 요청에 필요한 리퀘스트 바디 정의.
 */
@Getter
@Setter
@Schema(description = "UserRegisterPostRequest")

public class UserRegisterPostReq {
	@Schema(description = "유저 이름", example="김싸피")
	String name;
	@Schema(description = "유저 ID", example="ssafy_web")
	String id;
	@Schema(description = "유저 Password", example="your_password")
	String password;
}
