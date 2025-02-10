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
    private UUID sessionId;  // ���� ���� �ĺ���

    // ���ǿ� ������ ���� ������� Id
    @Column(nullable = false)
    private String userId;

    // ���ǿ� ������ ���� Id
    @Column(nullable = false)
    private Long botId;

    // ���� ���� (��: "ACTIVE", "EXPIRED", "CLOSED")
    @Column(nullable = false)
    private String status;

    // BaseEntity�� id ����� �޶� ���� ����
    // ���� ���� �ð�
    @CreationTimestamp
    private LocalDateTime createdAt;

    // ������ ���� �ð� (���� Ȱ���� ���� ������ ������Ʈ)
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}