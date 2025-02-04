package com.ssafy.db.repository;

import com.ssafy.db.entity.TarotCard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 타로 카드 모델 관련 DB 쿼리 생성을 위한 인터페이스 정의.
 */
@Repository
public interface TarotCardRepository extends JpaRepository<TarotCard, Long> {

    // 세트 번호를 기반으로 모든 카드 조회
    List<TarotCard> findBySetNumber(Integer setNumber);

    // 특정 세트 번호와 카드 번호를 기반으로 카드 하나 조회
    Optional<TarotCard> findBySetNumberAndCardNumber(Integer setNumber, Integer cardNumber);
}
