package com.ssafy.db.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * 유저 모델 정의.
 */
@Entity
@Getter
@Setter
public class User extends BaseEntity{
    @Column(nullable = false, length = 100)
    private String name; // 이름

    @Column(nullable = false, unique = true, length = 50)
    private String userId; // 사용자 ID

    @JsonIgnore
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Column(nullable = false, length = 255)
    private String password; // 비밀번호

    @Column(nullable = false, columnDefinition = "boolean default false")
    private boolean isAdmin = false; // 관리자 여부, 기본값 false
}
