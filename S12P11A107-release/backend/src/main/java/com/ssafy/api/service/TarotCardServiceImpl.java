package com.ssafy.api.service;

import com.ssafy.db.entity.TarotCard;
import com.ssafy.db.repository.TarotCardRepository;
import lombok.RequiredArgsConstructor;
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
                throw new IllegalArgumentException("세트 " + setNumber + "에 이미 뒷면 카드가 존재합니다.");
            }
        } else if (cardNumber < 1 || cardNumber > 78) {
            throw new IllegalArgumentException("카드 번호는 1부터 78 사이여야 합니다. (뒷면 카드는 0)");
        }

        // 동일한 세트와 카드 번호가 이미 존재하는지 확인
        Optional<TarotCard> existingCard = tarotCardRepository.findBySetNumberAndCardNumber(setNumber, cardNumber);
        if (existingCard.isPresent()) {
            throw new IllegalArgumentException("세트 " + setNumber + "에 카드 번호 " + cardNumber + "이(가) 이미 존재합니다.");
        }

        TarotCard tarotCard = new TarotCard();
        tarotCard.setSetNumber(setNumber);
        tarotCard.setCardNumber(cardNumber);
        tarotCard.setCardImageUrl(cardImage);
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
            tarotCard.setCardImageUrl(newImage);
            return tarotCardRepository.save(tarotCard); // 변경 사항 저장
        } else {
            throw new IllegalArgumentException("세트 " + setNumber + "에 카드 번호 " + cardNumber + "을(를) 찾을 수 없습니다.");
        }
    }

    // **5. 삭제 - 하나씩 삭제**
    @Override
    public void deleteCard(Integer setNumber, Integer cardNumber) {
        Optional<TarotCard> optionalTarotCard = tarotCardRepository.findBySetNumberAndCardNumber(setNumber, cardNumber);
        if (optionalTarotCard.isPresent()) {
            tarotCardRepository.delete(optionalTarotCard.get());
        } else {
            throw new IllegalArgumentException("세트 " + setNumber + "에 카드 번호 " + cardNumber + "을(를) 찾을 수 없습니다.");
        }
    }

    // **6. 삭제 - 세트 삭제**
    @Override
    public void deleteCardsBySet(Integer setNumber) {
        List<TarotCard> cards = tarotCardRepository.findBySetNumber(setNumber);
        if (!cards.isEmpty()) {
            tarotCardRepository.deleteAll(cards);
        } else {
            throw new IllegalArgumentException("세트 " + setNumber + "에 해당하는 카드를 찾을 수 없습니다.");
        }
    }

    // **7. 조회 - id로 검색**
    @Override
    public Optional<TarotCard> findCardById(Long id) {
        return tarotCardRepository.findById(id);
    }

}
