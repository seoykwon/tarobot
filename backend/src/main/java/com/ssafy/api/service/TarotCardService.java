package com.ssafy.api.service;

import com.ssafy.db.entity.TarotCard;

import java.util.List;
import java.util.Optional;

/**
 * 타로 카드 관련 비즈니스 로직 처리를 위한 서비스 인터페이스 정의.
 */
public interface TarotCardService {
    TarotCard createTarotCard(Integer setNumber, Integer cardNumber, String cardImage);
    List<TarotCard> getCardsBySetNumber(Integer setNumber);
    Optional<TarotCard> getTarotCardBySetAndNumber(Integer setNumber, Integer cardNumber);
    TarotCard updateTarotCardImage(Integer setNumber, Integer cardNumber, String newImage);
    void deleteCard(Integer setNumber, Integer cardNumber);
    void deleteCardsBySet(Integer setNumber);
}
