package com.ssafy.api.controller;

import com.ssafy.api.request.UserProfileRegisterPostReq;
import com.ssafy.api.request.UserProfileUpdateReq;
import com.ssafy.api.response.UserProfileRes;
import com.ssafy.api.service.UserProfileService;
import com.ssafy.common.model.response.BaseResponseBody;
import com.ssafy.db.entity.UserProfile;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@Tag(name="UserProfile", description="유저 프로필 API")
@RestController
@RequestMapping("/api/v1/user-profiles")
@RequiredArgsConstructor
public class UserProfileController {

	private final UserProfileService userProfileService;

	@PostMapping()
	@Operation(summary="유저 프로필 등록", description="<strong>userId과 기타 정보</strong>를 통해 유저 프로필을 등록합니다.")
	@ApiResponses({
			@ApiResponse(responseCode="200", description="성공"),
			@ApiResponse(responseCode="400", description="잘못된 요청"),
			@ApiResponse(responseCode="500", description="서버 오류")
	})
	public ResponseEntity<? extends BaseResponseBody> register(
			@RequestBody @Parameter(description="유저 프로필 정보", required=true) UserProfileRegisterPostReq registerInfo) {

		userProfileService.createUserProfile(registerInfo);
		return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
	}

	@GetMapping()
	@Operation(summary="모든 유저 프로필 조회", description="등록된 모든 유저 프로필을 조회합니다.")
	@ApiResponses({
			@ApiResponse(responseCode="200", description="성공"),
			@ApiResponse(responseCode="500", description="서버 오류")
	})
	public ResponseEntity<List<UserProfileRes>> getAllUserProfiles() {
		List<UserProfile> userProfiles = userProfileService.getAllUserProfiles();
		List<UserProfileRes> response = new ArrayList<>();
		for (UserProfile userProfile : userProfiles) {
			response.add(UserProfileRes.of(userProfile));
		}
		return ResponseEntity.ok(response);
	}

	@GetMapping("/{userId}")
	@Operation(summary="이름 기반 프로필 조회", description="userId을 통해 프로필을 조회합니다.")
	@ApiResponses({
			@ApiResponse(responseCode="200", description="성공"),
			@ApiResponse(responseCode="404", description="프로필 없음"),
			@ApiResponse(responseCode="500", description="서버 오류")
	})
	public ResponseEntity<UserProfileRes> getUserProfileInfo(
			@PathVariable @Parameter(description="조회할 userId", required=true) String userId) {

		UserProfile userProfile =
				userProfileService.getUserProfileByUserId(userId);
		return ResponseEntity.status(200).body(UserProfileRes.of(userProfile));
	}

	@PatchMapping("/{userId}")
	@Operation(summary="유저 프로필 수정", description="유저 프로필 정보를 수정합니다.")
	public ResponseEntity<UserProfileRes> updateUserProfile(
			@PathVariable String userId,
			@RequestBody UserProfileUpdateReq updateReq) {
		UserProfile updatedUserProfile =
				userProfileService.updateUserProfile(userId, updateReq);
		return ResponseEntity.ok(UserProfileRes.of(updatedUserProfile));
	}
}
