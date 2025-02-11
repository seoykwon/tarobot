package com.ssafy.api.service;

import com.ssafy.api.request.UserProfileRegisterPostReq;
import com.ssafy.api.request.UserProfileUpdateReq;
import com.ssafy.db.entity.User;
import com.ssafy.db.entity.UserProfile;
import com.ssafy.db.repository.UserProfileRepository;
import com.ssafy.db.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserProfileServiceImpl implements UserProfileService {
    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;

    @Override
    public UserProfile createUserProfile(UserProfileRegisterPostReq registerInfo) {
        User user = userRepository.findByUserId(registerInfo.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with userId: " + registerInfo.getUserId()));

        UserProfile userProfile = new UserProfile();
        userProfile.setUser(user);
        userProfile.setNickname(registerInfo.getNickname());
        userProfile.setGender(registerInfo.getGender());
        userProfile.setEmail(registerInfo.getEmail());
        userProfile.setProfileImage(registerInfo.getProfileImage());
        userProfile.setBirthDate(registerInfo.getBirthDate());

        return userProfileRepository.save(userProfile);
    }

    @Override
    public UserProfile getUserProfileByUserId(String userId) {
        return userProfileRepository.findByUser_UserId(userId).get();
    }

    @Override
    public List<UserProfile> getAllUserProfiles() {
        return userProfileRepository.findAll();
    }

    @Override
    public UserProfile updateUserProfile(String userId, UserProfileUpdateReq updateReq) {
        // UserProfile 조회
        UserProfile userProfile = userProfileRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new RuntimeException("UserProfile not found with userId: " + userId));

        // 수정할 필드만 업데이트
        updateReq.getNickname().ifPresent(userProfile::setNickname);
        updateReq.getGender().ifPresent(userProfile::setGender);
        updateReq.getEmail().ifPresent(userProfile::setEmail);
        updateReq.getProfileImage().ifPresent(userProfile::setProfileImage);
        updateReq.getBirthDate().ifPresent(userProfile::setBirthDate);

        // 저장 후 반환
        return userProfileRepository.save(userProfile);
    }
}
