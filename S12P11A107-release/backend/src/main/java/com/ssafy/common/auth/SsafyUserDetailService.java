package com.ssafy.common.auth;

import com.ssafy.db.entity.User;
import com.ssafy.db.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

/**
 * 현재 액세스 토큰으로부터 인증된 유저의 상세정보(활성화 여부, 만료, 롤 등) 관련 서비스 정의.
 */
@Component
@RequiredArgsConstructor
public class SsafyUserDetailService implements UserDetailsService {

	private final UserRepository userRepository; // UserRepository 직접 사용

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		// UserRepository를 사용하여 사용자 조회
		User user = userRepository.findByUserId(username)
				.orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

		// 사용자 정보를 기반으로 SsafyUserDetails 객체 생성 및 반환
		return new SsafyUserDetails(user);
	}
}
