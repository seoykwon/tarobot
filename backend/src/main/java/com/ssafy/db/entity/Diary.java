package com.ssafy.db.entity;


import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.validator.constraints.URL;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
public class Diary extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private LocalDate consultDate; // 상담 일자

    @Column(length = 255)
    private String tag; // 태그 (love,money,health)

    @Column(nullable = false, length = 100)
    private String title; // 상담 제목

    @Lob
    private String summary; // 상담 요약

    @URL
    private String tarotCardImageUrl; // 타로 카드 이미지 URL
}