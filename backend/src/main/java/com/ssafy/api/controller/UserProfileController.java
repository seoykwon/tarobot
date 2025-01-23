package com.ssafy.api.controller;


import com.ssafy.api.request.UserProfileRegisterPostReq;
import com.ssafy.api.request.UserProfileUpdateReq;
import com.ssafy.api.response.UserProfileRes;
import com.ssafy.api.service.UserProfileService;
import com.ssafy.common.model.response.BaseResponseBody;
import com.ssafy.db.entity.UserProfile;
import io.swagger.annotations.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@Api(value = "유저 프로필 API", tags = {"UserProfile"})
@RestController
@RequestMapping("/api/v1/user-profiles")
@RequiredArgsConstructor
public class UserProfileController {
	
	private final UserProfileService userProfileService;

	@PostMapping()
	@ApiOperation(value = "유저 프로필 등록", notes = "<strong>userId과 기타 정보</strong>를 통해 유저 프로필을 등록합니다.")
	@ApiResponses({
			@ApiResponse(code = 200, message = "성공"),
			@ApiResponse(code = 400, message = "잘못된 요청"),
			@ApiResponse(code = 500, message = "서버 오류")
	})
	public ResponseEntity<? extends BaseResponseBody> register(
			@RequestBody @ApiParam(value = "유저 프로필 정보", required = true) UserProfileRegisterPostReq registerInfo) {

		UserProfile userProfile = userProfileService.createUserProfile(registerInfo);
		// 중복 및 정합성 검사가 필요할 듯
		// 유저 생성 시 자동으로 생성되도록 하는 것은 백엔드 단에서 할 지 프론트에서 할 지 고민
		return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
	}

	@GetMapping()
	@ApiOperation(value = "모든 유저 프로필 조회", notes = "등록된 모든 유저 프로필을 조회합니다.")
	@ApiResponses({
			@ApiResponse(code = 200, message = "성공"),
			@ApiResponse(code = 500, message = "서버 오류")
	})
	public ResponseEntity<List<UserProfileRes>> getAllUserProfiles() {
		// 모든 유저 프로필을 가져옴
		List<UserProfile> userProfiles = userProfileService.getAllUserProfiles();

		// Entity → DTO 변환
        List<UserProfileRes> response = new ArrayList<>();
        for (UserProfile userProfile : userProfiles) {
            UserProfileRes userProfileRes = UserProfileRes.of(userProfile);
            response.add(userProfileRes);
        }

        return ResponseEntity.ok(response);
	}

	@GetMapping("/{userId}")
	@ApiOperation(value = "이름 기반 프로필 조회", notes = "userId을 통해 프로필을 조회합니다.")
	@ApiResponses({
			@ApiResponse(code = 200, message = "성공"),
			@ApiResponse(code = 404, message = "프로필 없음"),
			@ApiResponse(code = 500, message = "서버 오류")
	})
	public ResponseEntity<UserProfileRes> getUserProfileInfo(
			@PathVariable @ApiParam(value = "조회할 userId", required = true) String userId) {

		// 유저 프로필 조회 서비스 호출
		UserProfile userProfile = userProfileService.getUserProfileByUserId(userId);

		// 조회 결과 응답
		return ResponseEntity.status(200).body(UserProfileRes.of(userProfile));
	}

	@PatchMapping("/{userId}")
	@ApiOperation(value = "유저 프로필 수정", notes = "유저 프로필 정보를 수정합니다.")
	public ResponseEntity<UserProfileRes> updateUserProfile(
			@PathVariable String userId,
			@RequestBody UserProfileUpdateReq updateReq) {
		UserProfile updatedUserProfile = userProfileService.updateUserProfile(userId, updateReq);
		return ResponseEntity.ok(UserProfileRes.of(updatedUserProfile));
	}


}
