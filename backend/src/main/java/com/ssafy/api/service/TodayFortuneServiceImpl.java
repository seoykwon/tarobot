package com.ssafy.api.service;

import com.ssafy.api.request.TodayFortuneRegisterReq;
import com.ssafy.api.response.TodayFortuneRes;
import com.ssafy.common.util.SecurityUtil;
import com.ssafy.db.entity.TarotCard;
import com.ssafy.db.entity.TodayFortune;
import com.ssafy.db.entity.User;
import com.ssafy.db.repository.TodayFortuneRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service("todayFortuneService")
@RequiredArgsConstructor
public class TodayFortuneServiceImpl implements TodayFortuneService {

    private final TodayFortuneRepository todayFortuneRepository;
    private final SecurityUtil securityUtil;
    private final TarotCardService tarotCardService;  // DB에 저장된 타로 카드 정보를 조회하기 위한 서비스

    /**
     * 오늘의 운세 등록
     */
    @Override
    @Transactional
    public TodayFortune registerTodayFortune(TodayFortuneRegisterReq req) {
        // 현재 로그인한 사용자 조회
        User currentUser = securityUtil.getCurrentUser();

        // DB에서 타로 카드 정보를 조회 (타로 카드 ID기반; 없으면 예외 발생)
        TarotCard tarotCard = tarotCardService.findCardById(req.getTarotCardId())
                .orElseThrow(() -> new IllegalArgumentException("타로 카드를 찾을 수 없습니다. id: " + req.getTarotCardId()));

        // AI 연동 없이 기본 운세 결과 및 점수 적용 (추후 AI 연동 시 수정)
        String fortuneResult = "기본 운세 결과";
        int luckyScore = 85;

        TodayFortune todayFortune = new TodayFortune();
        todayFortune.setUser(currentUser);
        todayFortune.setTarotCard(tarotCard);
        todayFortune.setCardName(""); // 카드 이름에 우선 기본값(예: 빈 문자열)을 할당
        todayFortune.setFortune(fortuneResult);
        todayFortune.setLuckyScore(luckyScore);
        todayFortune.setDate(LocalDate.now());

        return todayFortuneRepository.save(todayFortune);
    }

    /**
     * 운세 상세 조회 (운세 ID 기반)
     */
    @Override
    public TodayFortuneRes getTodayFortuneById(Long fortuneId) {
        TodayFortune fortune = todayFortuneRepository.findById(fortuneId)
                .orElseThrow(() -> new IllegalArgumentException("오늘의 운세를 찾을 수 없습니다. id: " + fortuneId));
        return TodayFortuneRes.of(fortune);
    }

    /**
     * 현재 사용자 오늘의 운세 조회
     * 현재 로그인한 사용자의 오늘 날짜에 해당하는 운세가 존재하면 응답 DTO로 반환하고, 없으면 null을 반환합니다.
     */
    @Override
    @Transactional(readOnly = true)
    public TodayFortuneRes getTodayFortuneForCurrentUser() {
        User currentUser = securityUtil.getCurrentUser();
        TodayFortune fortune = todayFortuneRepository.findByUserAndDate(currentUser, LocalDate.now());
        return (fortune != null) ? TodayFortuneRes.of(fortune) : null;
    }
}
