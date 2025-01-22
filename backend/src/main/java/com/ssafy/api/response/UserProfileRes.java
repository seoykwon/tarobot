package com.ssafy.api.response;

import com.ssafy.db.entity.UserProfile;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

/**
 * 사용자 프로필 정보 응답 객체 정의.
 */
@Getter
@Setter
@ApiModel("UserProfileRes")
public class UserProfileRes {

    @ApiModelProperty(name = "닉네임")
    private String nickname;

    @ApiModelProperty(name = "성별")
    private String gender;

    @ApiModelProperty(name = "이메일")
    private String email;

    @ApiModelProperty(name = "프로필 이미지")
    private String profileImage;

    @ApiModelProperty(name = "생년월일")
    private LocalDate birthDate;

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
