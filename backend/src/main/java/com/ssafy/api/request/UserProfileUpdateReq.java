package com.ssafy.api.request;

import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema;import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.Optional;

/**
 * 사용자 프로필 수정 API ([PATCH] /api/v1/user-profiles) 요청에 필요한 리퀘스트 바디 정의.
 */
@Getter
@Setter
@Schema(description = "UserProfileUpdateRequest")

public class UserProfileUpdateReq {
	@Schema(description = "닉네임", example = "MysticUser")
	private Optional<String> nickname = Optional.empty();

	@Schema(description = "성별", example = "Male")
	private Optional<String> gender = Optional.empty();

	@Schema(description = "이메일", example = "user@example.com")
	private Optional<String> email = Optional.empty();

	@Schema(description = "프로필 이미지 URL", example = "https://example.com/image.png")
	private Optional<String> profileImage = Optional.empty();

	@Schema(description = "생년월일", example = "2000-01-01")
	private Optional<LocalDate> birthDate = Optional.empty();
}
