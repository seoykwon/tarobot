package com.ssafy.config.oauth;

import com.ssafy.db.entity.User;
import com.ssafy.db.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class OAuth2UserCustomService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User user = super.loadUser(userRequest); // ❶ 요청을 바탕으로 유저 정보를 담은 객체 반환
        saveOrUpdate(user);

        return user;
    }

    // ❷ 유저가 있으면 업데이트, 없으면 유저 생성
    private User saveOrUpdate(OAuth2User oAuth2User) {
        Map<String, Object> attributes = oAuth2User.getAttributes();

        String email = (String) attributes.get("email"); // emain을 userId로 할 것
        String name = (String) attributes.get("name"); // 리소스 서버로 부터 받아온 사용자 이름

        // 기존 사용자 조회
        Optional<User> existingUser = userRepository.findByUserId(email);

        if (existingUser.isPresent()) {
            // 기존 유저가 있다면 이름 업데이트 후 저장
            User user = existingUser.get();
            user.update(name);  // 이름 업데이트
            return userRepository.save(user);
        } else {
            // 기존 유저가 없다면 새로 생성 후 저장
            User user = new User();
            user.setUserId(email);
            user.setName(name);
            return userRepository.save(user);
        }
    }
}