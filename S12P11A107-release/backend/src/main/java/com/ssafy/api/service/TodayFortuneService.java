package com.ssafy.api.service;

import com.ssafy.api.request.TodayFortuneRegisterReq;
import com.ssafy.api.response.TodayFortuneRes;
import com.ssafy.db.entity.TodayFortune;

public interface TodayFortuneService {

    /**
     * 오늘의 운세 등록
     * 클라이언트에서 전달한 타로 카드 ID를 이용하여
     * DB에 저장된 타로 카드 정보를 조회한 후 기본 운세 결과와 점수를 할당하고,
     * 현재 사용자의 오늘 운세로 등록합니다.
     */
    TodayFortune registerTodayFortune(TodayFortuneRegisterReq req);

    /**
     * 운세 상세 조회 (운세 ID 기반)
     */
    TodayFortuneRes getTodayFortuneById(Long fortuneId);

    /**
     * 현재 사용자에 대한 오늘의 운세 조회
     * 해당 사용자의 오늘 운세가 존재하면 TodayFortuneRes 형식으로 반환하고,
     * 없으면 null을 반환합니다.
     */
    TodayFortuneRes getTodayFortuneForCurrentUser();
}
