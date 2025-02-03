package com.ssafy.api.request;

import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema;import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

/**
 * 사용자 프로필 등록 API ([POST] /api/v1/user-profiles) 요청에 필요한 리퀘스트 바디 정의.
 */
@Getter
@Setter
@Schema(description = "UserProfileRegisterPostRequest")
public class UserProfileRegisterPostReq {
	@Schema(description = "유저 ID", example = "ssafy_web")
	private String userId;

	@Schema(description = "닉네임", example = "MysticUser")
	private String nickname;

	@Schema(description = "성별", example = "Male")
	private String gender;

	@Schema(description = "이메일", example = "user@example.com")
	private String email;

	@Schema(description = "프로필 이미지 URL", example = "https://example.com/image.png")
	private String profileImage;
	// 지정값이 없으면 기본 이미지가 들어가게 해야할듯

	@Schema(description = "생년월일", example = "2000-01-01")
	private LocalDate birthDate;
}