package com.ssafy.api.service;

import com.ssafy.api.request.UserRegisterPostReq;
import com.ssafy.db.entity.User;
import com.ssafy.db.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 유저 관련 비즈니스 로직 처리를 위한 서비스 구현체 정의.
 */
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

	private final UserRepository userRepository;   // 생성자 주입
	private final PasswordEncoder passwordEncoder; // PasswordEncoder 주입

	@Override
	public User createUser(UserRegisterPostReq userRegisterInfo) {
		User user = new User();
		user.setUserId(userRegisterInfo.getId());
		user.setPassword(passwordEncoder.encode(userRegisterInfo.getPassword())); // 암호화된 비밀번호 저장
		user.setName(userRegisterInfo.getName());
		return userRepository.save(user);
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
