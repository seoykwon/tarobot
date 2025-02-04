package com.ssafy.db.entity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;

/**
 유저 모델 정의.
 */
@Entity
@Getter
@Setter
public class User extends BaseEntity {
    @Column(nullable = false, length = 100)
    private String name; // 이름

    @Column(nullable = false, unique = true, length = 50)
    private String userId; // 사용자 ID

    @JsonIgnore
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Column(nullable = true, length = 255) // OAuth 로그인 시 password가 비어있을 수 있어 nullable true로 바꿈
    private String password; // 비밀번호

    @Column(nullable = false, columnDefinition = "boolean default false")
    private boolean isAdmin = false; // 관리자 여부, 기본값 false

    @Column(nullable = false, columnDefinition = "TINYINT(1) DEFAULT 0")
    private boolean social; // true: 소셜 로그인 유저, false: 일반 로그인 유저 - 기본값

    public boolean isSocialUser() {
        return this.social;
    }

    public User update(String name) {
        this.name = name;

        return this;
    }
}