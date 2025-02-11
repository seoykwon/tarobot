package com.ssafy.db.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "today_fortune")
public class TodayFortune extends BaseEntity {
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // 운세를 본 사용자와 연결

    @ManyToOne
    @JoinColumn(name = "tarot_card_id", nullable = false)
    private TarotCard tarotCard; // 뽑힌 타로 카드와 연결

    @Column(nullable = false)
    private String cardName; // 카드 이름

    @Column(nullable = false)
    private String fortune;  // 운세 결과(내용)

    @Column(nullable = false)
    private int luckyScore;  // 점수

    @Column(nullable = false)
    private LocalDate date;  // 운세가 적용되는 날짜
}
