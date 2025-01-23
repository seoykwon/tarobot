package com.ssafy.api.service;

import com.ssafy.api.request.UserProfileRegisterPostReq;
import com.ssafy.db.entity.User;
import com.ssafy.db.entity.UserProfile;
import com.ssafy.db.repository.UserProfileRepository;
import com.ssafy.db.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ssafy.db.repository.UserProfileRepositorySupport;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserProfileServiceImpl implements UserProfileService {
    private final UserRepository userRepository;

    private final UserProfileRepository userProfileRepository;

    private final UserProfileRepositorySupport userProfileRepositorySupport;

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
        return userProfileRepository.findByUser_UserId(userId);
    }

    @Override
    public List<UserProfile> getAllUserProfiles() {
        return userProfileRepository.findAll();
    }
}
