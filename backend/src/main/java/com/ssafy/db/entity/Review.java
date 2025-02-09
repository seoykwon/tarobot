package com.ssafy.db.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
public class Review extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tarotbot_id", nullable = false)
    @JsonIgnore
    private TarotBot tarotBot;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false) // User 테이블의 ID를 FK로 참조
    @JsonIgnore
    private User author; // 작성자

    @Column(nullable = false)
    private int rating; // 별점 (1~5)

    @Column(nullable = false, length = 500)
    private String content;

    @Column(nullable = false)
    private LocalDate date;
}

