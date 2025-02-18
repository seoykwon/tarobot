package com.ssafy.db.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
public class Diary extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    @Column(nullable = false)
    private LocalDate consultDate; // 상담 일자

    @Column(length = 255)
    private String tag; // 태그 (love,money,health)

    @Column(nullable = false, length = 100)
    private String title; // 상담 제목

    @Lob
    @Column(columnDefinition = "TEXT")
    private String summary; // 상담 요약

    private String cardImageUrl; // 타로 카드 이미지 URL

    @ManyToOne
    @JoinColumn(name = "tarot_bot_id", nullable = false)
    private TarotBot tarotBot; // 상담을 진행한 타로봇
}