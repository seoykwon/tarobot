package com.ssafy.db.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Data
public class ChatSession {

    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    private UUID sessionId;  // 고유 세션 식별자

    // 세션에 참여한 메인 사용자의 Id
    @Column(nullable = false)
    private String userId;

    // 세션에 참여한 봇의 Id
    @Column(nullable = false)
    private Long botId;

    // 세션 상태 (예: "ACTIVE", "EXPIRED", "CLOSED")
    @Column(nullable = false)
    private String status;

    // BaseEntity와 id 방식이 달라 따로 구현
    // 세션 생성 시각
    @CreationTimestamp
    private LocalDateTime createdAt;

    // 마지막 접근 시각 (세션 활동이 있을 때마다 업데이트)
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}