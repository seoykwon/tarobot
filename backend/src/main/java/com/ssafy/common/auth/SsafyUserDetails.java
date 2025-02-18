package com.ssafy.common.auth;

import com.ssafy.db.entity.User;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

/**
 * 현재 액세스 토큰으로부터 인증된 유저의 부가 상세정보(활성화 여부, 만료, 롤 등) 정의.
 */
public class SsafyUserDetails implements UserDetails {

	@Getter
    private final User user; // User 엔티티
	private boolean accountNonExpired = true; // 기본값 설정
	private boolean accountNonLocked = true; // 기본값 설정
	private boolean credentialNonExpired = true; // 기본값 설정
	private boolean enabled = true; // 기본값 설정
	private List<GrantedAuthority> roles = new ArrayList<>(); // 권한 정보

	public SsafyUserDetails(User user) {
		this.user = user;
		// 기본 권한 추가 (예: ROLE_USER)
		this.roles.add(new SimpleGrantedAuthority("ROLE_USER"));
	}

    @Override
	public String getPassword() {
		return this.user.getPassword();
	}

	@Override
	public String getUsername() {
		return this.user.getUserId();
	}

	@Override
	public boolean isAccountNonExpired() {
		return this.accountNonExpired;
	}

	@Override
	public boolean isAccountNonLocked() {
		return this.accountNonLocked;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		return this.credentialNonExpired;
	}

	@Override
	public boolean isEnabled() {
		return this.enabled;
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return this.roles;
	}

	public void setAuthorities(List<GrantedAuthority> roles) {
		this.roles = roles;
	}
}
