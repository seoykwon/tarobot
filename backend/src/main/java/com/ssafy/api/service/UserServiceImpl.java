package com.ssafy.api.service;

import com.ssafy.api.request.UserRegisterPostReq;
import com.ssafy.db.entity.User;
import com.ssafy.db.entity.UserProfile;
import com.ssafy.db.repository.UserProfileRepository;
import com.ssafy.db.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

/**
 * 유저 관련 비즈니스 로직 처리를 위한 서비스 구현체 정의.
 */
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

	private final UserRepository userRepository;   // 생성자 주입
	private final PasswordEncoder passwordEncoder; // PasswordEncoder 주입
	private final UserProfileRepository userProfileRepository;

	@Override
	public User createUser(UserRegisterPostReq userRegisterInfo) {
		// 1. 사용자 생성
		User user = new User();
		user.setUserId(userRegisterInfo.getId());
		user.setPassword(passwordEncoder.encode(userRegisterInfo.getPassword())); // 암호화된 비밀번호 저장
		user.setName(userRegisterInfo.getName());
		user = userRepository.save(user);

		// 2. 더미 프로필 생성 (필요에 따라 더미 데이터 값 조정)
		UserProfile dummyProfile = new UserProfile();
		dummyProfile.setUser(user);
		dummyProfile.setNickname(user.getName()); // 더미 닉네임 설정
		dummyProfile.setGender("Other"); // 또는 "M", "F" 등 적절한 기본 값
		dummyProfile.setEmail(user.getUserId());
		dummyProfile.setProfileImage("/images/default_profile.png"); // 기본 프로필 이미지 파일명
		dummyProfile.setBirthDate(LocalDate.of(2000, 1, 1)); // 기본 생년월일 (예시)

		userProfileRepository.save(dummyProfile);

		return user;
	}

	@Override
	public User getUserByUserId(String userId) {
		return userRepository.findByUserId(userId).orElse(null);
	}

	@Override
	public List<User> getAllUsers() {
		return userRepository.findAll();
	}

	@Override
	public User findById(Long userId) {
		return userRepository.findById(userId)
				.orElseThrow(() -> new IllegalArgumentException("Unexpected user"));
	}
}
