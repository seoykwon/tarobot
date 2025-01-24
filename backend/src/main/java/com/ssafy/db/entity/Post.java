package com.ssafy.db.entity;

import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class Post extends BaseEntity {

    @Column(length = 255, nullable = false)
    private String title; // 게시글 제목

    @Column(length = 255)
    private String imageUrl; // 이미지 URL (없으면 null)

    @Column(nullable = false)
    private String content; // 게시글 내용

    @ManyToOne(fetch = FetchType.LAZY) // Post:User 다대일 관계 설정
    @JoinColumn(name = "user_id", nullable = false)
    private User author; // 작성자 (FK)

    @Column(nullable = false)
    private boolean isActive = true; // 활성화 여부

    @Column(nullable = false)
    private int viewCount = 0; // 조회수

    @Column(nullable = false)
    private int commentCount = 0; // 댓글 수

    @Column(nullable = false)
    private int likeCount = 0; // 좋아요 수

    @CreationTimestamp
    private LocalDateTime createdAt; // 생성 시간

    @UpdateTimestamp
    private LocalDateTime updatedAt; // 수정 시간
}
