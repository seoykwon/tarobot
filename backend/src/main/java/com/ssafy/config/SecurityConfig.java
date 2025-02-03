package com.ssafy.config;

import com.ssafy.api.service.UserService;
import com.ssafy.common.auth.JwtAuthenticationFilter;
import com.ssafy.common.auth.SsafyUserDetailService;

import com.ssafy.config.oauth.OAuth2FailureHandler;
import com.ssafy.config.oauth.OAuth2SuccessHandler;
import com.ssafy.config.oauth.OAuth2UserCustomService;
import lombok.RequiredArgsConstructor;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@RequiredArgsConstructor // 생성자 주입을 위한 Lombok 어노테이션
@EnableMethodSecurity(prePostEnabled = true) // @EnableGlobalMethodSecurity 대체
public class SecurityConfig {

    private final SsafyUserDetailService ssafyUserDetailService; // 생성자 주입
    private final UserService userService;                      // 생성자 주입
    private final PasswordEncoder passwordEncoder;              // PasswordEncoder 주입
    private final OAuth2UserCustomService oAuth2UserCustomService;
    private final OAuth2SuccessHandler oAuth2SuccessHandler;
    private final OAuth2FailureHandler oAuth2FailureHandler;

    // DAO 기반으로 Authentication```````````````````` Provider를 생성
    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider daoAuthenticationProvider = new DaoAuthenticationProvider();
        daoAuthenticationProvider.setPasswordEncoder(passwordEncoder); // PasswordEncoder 주입 사용
        daoAuthenticationProvider.setUserDetailsService(this.ssafyUserDetailService);
        return daoAuthenticationProvider;
    }

    // AuthenticationManager를 빈으로 등록 (필요 시 주입 가능)
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    // SecurityFilterChain을 사용하여 HttpSecurity 설정 정의
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable()) // CSRF 비활성화
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // 세션 사용하지 않음 (JWT 기반 인증)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/v1/users/me").authenticated() // 인증이 필요한 URL 설정
                        .anyRequest().permitAll()                           // 나머지 요청은 모두 허용
                )
                .authenticationProvider(authenticationProvider()) // Authentication Provider 등록
                .addFilter(new JwtAuthenticationFilter(
                        authenticationManager(http.getSharedObject(AuthenticationConfiguration.class)),
                        userService)) // JWT 인증 필터 추가
                // .cors(cors -> cors.disable()) // CORS 설정 (필요 시 활성화)
                .oauth2Login(oauth2 -> oauth2
                    .userInfoEndpoint(userInfo -> userInfo.userService(oAuth2UserCustomService))
                    .successHandler(oAuth2SuccessHandler)
                    .failureHandler(oAuth2FailureHandler)
                );

        return http.build();
    }
}
