package com.ssafy.db.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;

/**
 * 유저 모델 정의.
 */
@Entity
@Getter
@Setter
public class User extends BaseEntity{
    @Column(nullable = false, length = 100)
    private String name; // 이름 or 리소스 서버에서 제공해주는 이름

    @Column(nullable = false, unique = true, length = 50)
    private String userId; // 사용자 ID

    @JsonIgnore
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Column(length = 255) // OAuth 로그인 시 password가 비어있을 수 있어 nullable true로 바꿈
    private String password; // 비밀번호

    public User update(String name) {
        this.name = name;

        return this;
    }
}
