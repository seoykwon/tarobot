package com.ssafy.api.service;

import com.ssafy.api.request.DiaryCreateReq;
import com.ssafy.api.request.DiaryUpdateReq;
import com.ssafy.api.response.DiaryRes;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/**
 * 다이어리 관련 비즈니스 로직 처리를 위한 서비스 인터페이스 정의.
 */
public interface DiaryService {
	DiaryRes createDiary(DiaryCreateReq diaryCreateReq);
	List<DiaryRes> getDiariesByUser_Id(Long userId);
	DiaryRes getDiaryById(Long diaryId);
	DiaryRes updateDiary(Long diaryId, DiaryUpdateReq diaryUpdateReq);
	void deleteDiary(Long diaryId);
	List<DiaryRes> getDiariesByConsultDate(LocalDate consultDate, String userId);
	Map<LocalDate, List<Long>> getTarotBotIdsByYearAndMonth(int year, int month);
}
