package com.ssafy.api.response;

import com.ssafy.db.entity.UserProfile;

import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

/**
 * 사용자 프로필 정보 응답 객체 정의.
 */
@Getter
@Setter
@Schema(description = "UserProfileRes")
public class UserProfileRes {

    @Schema(description = "닉네임")    private String nickname;

    @Schema(description = "성별")    private String gender;

    @Schema(description = "이메일")    private String email;

    @Schema(description = "프로필 이미지")    private String profileImage;

    @Schema(description = "생년월일")    private LocalDate birthDate;

    public static UserProfileRes of(UserProfile userProfile) {
        UserProfileRes res = new UserProfileRes();
        res.setNickname(userProfile.getNickname());
        res.setGender(userProfile.getGender());
        res.setEmail(userProfile.getEmail());
        res.setProfileImage(userProfile.getProfileImage());
        res.setBirthDate(userProfile.getBirthDate());
        return res;
    }
}
