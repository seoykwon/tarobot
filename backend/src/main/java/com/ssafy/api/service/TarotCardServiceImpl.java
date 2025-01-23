package com.ssafy.api.service;

import com.ssafy.db.entity.TarotCard;
import com.ssafy.db.repository.TarotCardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * 타로 카드 관련 비즈니스 로직 처리를 위한 서비스 구현 정의.
 */
@Service("tarotCardService")
@RequiredArgsConstructor
public class TarotCardServiceImpl implements TarotCardService {

    private final TarotCardRepository tarotCardRepository;

    // **1. 생성 - 세트 번호, 이름 번호, 이미지**
    @Override
    public TarotCard createTarotCard(Integer setNumber, Integer cardNumber, String cardImage) {
        // 카드 번호가 0이면 세트 번호와 상관없이 뒷장만 허용
        if (cardNumber == 0) {
            Optional<TarotCard> existingBackCard = tarotCardRepository.findBySetNumberAndCardNumber(setNumber, 0);
            if (existingBackCard.isPresent()) {
                throw new IllegalArgumentException("Back card for set " + setNumber + " already exists.");
            }
        } else if (cardNumber < 1 || cardNumber > 78) {
            throw new IllegalArgumentException("Card number must be between 1 and 78 (or 0 for back card).");
        }

        // 동일한 세트와 카드 번호가 이미 존재하는지 확인
        Optional<TarotCard> existingCard = tarotCardRepository.findBySetNumberAndCardNumber(setNumber, cardNumber);
        if (existingCard.isPresent()) {
            throw new IllegalArgumentException("A card with number " + cardNumber + " already exists in set " + setNumber);
        }

        TarotCard tarotCard = new TarotCard();
        tarotCard.setSetNumber(setNumber);
        tarotCard.setCardNumber(cardNumber);
        tarotCard.setCardImage(cardImage);
        return tarotCardRepository.save(tarotCard);
    }

    // **2. 조회 - 세트 번호 기반 전체 카드 조회**
    @Override
    public List<TarotCard> getCardsBySetNumber(Integer setNumber) {
        return tarotCardRepository.findBySetNumber(setNumber);
    }

    // **3. 조회 - 카드 하나 조회 (세트 번호와 카드 번호로)**
    @Override
    public Optional<TarotCard> getTarotCardBySetAndNumber(Integer setNumber, Integer cardNumber) {
        return tarotCardRepository.findBySetNumberAndCardNumber(setNumber, cardNumber);
    }

    // **4. 수정 - 이미지**
    @Override
    public TarotCard updateTarotCardImage(Integer setNumber, Integer cardNumber, String newImage) {
        Optional<TarotCard> optionalTarotCard = tarotCardRepository.findBySetNumberAndCardNumber(setNumber, cardNumber);
        if (optionalTarotCard.isPresent()) {
            TarotCard tarotCard = optionalTarotCard.get();
            tarotCard.setCardImage(newImage);
            return tarotCardRepository.save(tarotCard); // 변경 사항 저장
        } else {
            throw new IllegalArgumentException("Tarot card with set number " + setNumber + " and card number " + cardNumber + " not found.");
        }
    }

    // **5. 삭제 - 하나씩 삭제**
    @Override
    public void deleteTarotCard(Integer setNumber, Integer cardNumber) {
        Optional<TarotCard> optionalTarotCard = tarotCardRepository.findBySetNumberAndCardNumber(setNumber, cardNumber);
        if (optionalTarotCard.isPresent()) {
            tarotCardRepository.delete(optionalTarotCard.get());
        } else {
            throw new IllegalArgumentException("Tarot card with set number " + setNumber + " and card number " + cardNumber + " not found.");
        }
    }

    // **6. 삭제 - 세트 삭제**
    @Override
    public void deleteCardsBySet(Integer setNumber) {
        List<TarotCard> cards = tarotCardRepository.findBySetNumber(setNumber);
        if (!cards.isEmpty()) {
            tarotCardRepository.deleteAll(cards);
        } else {
            throw new IllegalArgumentException("No cards found for set number " + setNumber);
        }
    }
}
