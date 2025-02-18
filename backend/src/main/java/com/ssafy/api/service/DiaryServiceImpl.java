package com.ssafy.api.service;

import com.ssafy.api.request.DiaryCreateReq;
import com.ssafy.api.request.DiaryUpdateReq;
import com.ssafy.db.entity.Diary;
import com.ssafy.db.entity.User;
import com.ssafy.db.repository.DiaryRepository;
import com.ssafy.db.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/**
 * 다이어리 관련 비즈니스 로직 처리를 위한 서비스 구현 정의.
 */
@Service("diaryService")
@RequiredArgsConstructor
public class DiaryServiceImpl implements DiaryService {

	private final DiaryRepository diaryRepository;

	private final UserRepository userRepository;

	@Override
	@Transactional
	public Diary createDiary(DiaryCreateReq diaryCreateReq) {
		// 사용자 조회
		User user = userRepository.findById(diaryCreateReq.getUserId())
				.orElseThrow(() -> new IllegalArgumentException("User not found with id: " + diaryCreateReq.getUserId()));

		// 다이어리 생성
		Diary diary = new Diary();
		diary.setUser(user);
		diary.setConsultDate(diaryCreateReq.getConsultDate());
		diary.setTag(diaryCreateReq.getTag());
		diary.setTitle(diaryCreateReq.getTitle());
		diary.setSummary(diaryCreateReq.getSummary());
		diary.setCardImageUrl(diaryCreateReq.getCardImageUrl());

		return diaryRepository.save(diary);
	}

	@Override
	@Transactional(readOnly = true)
	public List<Diary> getDiariesByUser_Id(Long userId) {
		return diaryRepository.findByUser_Id(userId);
	}

	@Override
	@Transactional(readOnly = true)
	public Diary getDiaryById(Long diaryId) {
		return diaryRepository.findById(diaryId)
				.orElseThrow(() -> new IllegalArgumentException("Diary not found with id: " + diaryId));
	}

	@Override
	@Transactional
	public Diary updateDiary(Long diaryId, DiaryUpdateReq diaryUpdateReq) {
		Diary diary = diaryRepository.findById(diaryId)
				.orElseThrow(() -> new IllegalArgumentException("Diary not found with id: " + diaryId));

		diary.setConsultDate(diaryUpdateReq.getConsultDate());
		diary.setTag(diaryUpdateReq.getTag());
		diary.setTitle(diaryUpdateReq.getTitle());
		diary.setSummary(diaryUpdateReq.getSummary());
		diary.setCardImageUrl(diaryUpdateReq.getCardImageUrl());

		return diaryRepository.save(diary);
	}

	@Override
	@Transactional
	public void deleteDiary(Long diaryId) {
		if (!diaryRepository.existsById(diaryId)) {
			throw new IllegalArgumentException("Diary not found with id: " + diaryId);
		}
		diaryRepository.deleteById(diaryId);
	}


	@Override
	@Transactional(readOnly = true)
	public List<Diary> getDiariesByConsultDate(LocalDate consultDate, String userId) {
		return diaryRepository.findByConsultDateAndUser_UserId(consultDate, userId);
	}
}
