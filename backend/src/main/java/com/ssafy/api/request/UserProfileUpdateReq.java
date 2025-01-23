package com.ssafy.api.request;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.Optional;

/**
 * 사용자 프로필 수정 API ([PATCH] /api/v1/user-profiles) 요청에 필요한 리퀘스트 바디 정의.
 */
@Getter
@Setter
@ApiModel("UserProfileUpdateRequest")
public class UserProfileUpdateReq {
	@ApiModelProperty(name = "닉네임", example = "MysticUser")
	private Optional<String> nickname = Optional.empty();

	@ApiModelProperty(name = "성별", example = "Male")
	private Optional<String> gender = Optional.empty();

	@ApiModelProperty(name = "이메일", example = "user@example.com")
	private Optional<String> email = Optional.empty();

	@ApiModelProperty(name = "프로필 이미지 URL", example = "https://example.com/image.png")
	private Optional<String> profileImage = Optional.empty();

	@ApiModelProperty(name = "생년월일", example = "2000-01-01")
	private Optional<LocalDate> birthDate = Optional.empty();
}
