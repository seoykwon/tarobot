package com.ssafy.api.service;

import com.ssafy.api.request.DiaryCreateReq;
import com.ssafy.api.request.DiaryUpdateReq;
import com.ssafy.db.entity.Diary;

import java.util.List;

/**
 * 다이어리 관련 비즈니스 로직 처리를 위한 서비스 인터페이스 정의.
 */
public interface DiaryService {
	Diary createDiary(DiaryCreateReq diaryCreateReq);
	List<Diary> getDiariesByUser_Id(Long userId);
	Diary getDiaryById(Long diaryId);
	Diary updateDiary(Long diaryId, DiaryUpdateReq diaryUpdateReq);
	void deleteDiary(Long diaryId);
}
