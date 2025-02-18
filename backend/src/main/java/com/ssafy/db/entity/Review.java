package com.ssafy.db.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
public class Review extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tarotbot_id", nullable = false)
    private TarotBot tarotBot;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false) // User 테이블의 ID를 FK로 참조
    private User user; // 작성자

    @Min(value = 1, message = "별점은 1 이상이어야 합니다.")
    @Max(value = 5, message = "별점은 5 이하여야 합니다.")
    private int rating; // 별점 (1~5)

    @Column(nullable = false, length = 500)
    private String content;

    @Column(nullable = false)
    private LocalDate date;
}

