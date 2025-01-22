package com.ssafy.api.request;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

/**
 * 사용자 프로필 등록 API ([POST] /api/v1/user-profiles) 요청에 필요한 리퀘스트 바디 정의.
 */
@Getter
@Setter
@ApiModel("UserProfileRegisterPostRequest")
public class UserProfileRegisterPostReq {
	@ApiModelProperty(name = "유저 ID", example = "ssafy_web")
	private String userId;

	@ApiModelProperty(name = "닉네임", example = "MysticUser")
	private String nickname;

	@ApiModelProperty(name = "성별", example = "Male")
	private String gender;

	@ApiModelProperty(name = "이메일", example = "user@example.com")
	private String email;

	@ApiModelProperty(name = "프로필 이미지 URL", example = "https://example.com/image.png")
	private String profileImage;

	@ApiModelProperty(name = "생년월일", example = "2000-01-01")
	private LocalDate birthDate;
}