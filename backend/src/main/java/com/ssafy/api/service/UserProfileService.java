package com.ssafy.api.service;

import com.ssafy.api.request.UserProfileRegisterPostReq;
import com.ssafy.db.entity.UserProfile;

import java.util.List;

public interface UserProfileService {
	UserProfile createUserProfile(UserProfileRegisterPostReq userProfileRegisterPostReq);
	UserProfile getUserProfileByUserId(String userId);
	List<UserProfile> getAllUserProfiles();
}