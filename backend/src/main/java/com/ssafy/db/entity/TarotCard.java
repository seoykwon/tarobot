package com.ssafy.db.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Table(name = "tarot_card")
@Getter
@Setter
@NoArgsConstructor
public class TarotCard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Primary Key

    @Column(nullable = false)
    private Integer setNumber; // 세트 번호 (숫자 형식)

    @Column(nullable = false)
    private Integer cardNumber; // 카드 번호 (0번은 뒷면, 1~78번은 앞면)

    @Column(nullable = false)
    private String cardImageUrl; // 카드 이미지 URL
}
