package com.ssafy.api.service;

import com.ssafy.api.request.DiaryCreateReq;
import com.ssafy.api.request.DiaryUpdateReq;
import com.ssafy.api.response.DiaryRes;
import com.ssafy.common.util.SecurityUtil;
import com.ssafy.db.entity.Diary;
import com.ssafy.db.entity.TarotBot;
import com.ssafy.db.entity.User;
import com.ssafy.db.repository.DiaryRepository;
import com.ssafy.db.repository.TarotBotRepository;
import com.ssafy.db.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;

/**
 * 다이어리 관련 비즈니스 로직 처리를 위한 서비스 구현 정의.
 */
@Service("diaryService")
@RequiredArgsConstructor
public class DiaryServiceImpl implements DiaryService {

	private final DiaryRepository diaryRepository;
	private final TarotBotRepository tarotBotRepository;
	private final SecurityUtil securityUtil; // ✅ SecurityUtil 추가

	@Override
	@Transactional
	public DiaryRes createDiary(DiaryCreateReq diaryCreateReq) {

		User user = securityUtil.getCurrentUser();

		TarotBot tarotBot = null;
		if (diaryCreateReq.getTarotBotId() != null) {
			tarotBot = tarotBotRepository.findById(diaryCreateReq.getTarotBotId())
					.orElseThrow(() -> new IllegalArgumentException("TarotBot not found with id: " + diaryCreateReq.getTarotBotId()));
		}
		Diary diary = new Diary();
		diary.setUser(user);
		diary.setTarotBot(tarotBot);
		diary.setConsultDate(diaryCreateReq.getConsultDate());
		diary.setTag(diaryCreateReq.getTag());
		diary.setTitle(diaryCreateReq.getTitle());
		diary.setSummary(diaryCreateReq.getSummary());
		diary.setCardImageUrl(diaryCreateReq.getCardImageUrl());

		return DiaryRes.of(diaryRepository.save(diary));
	}

	@Override
	@Transactional(readOnly = true)
	public List<DiaryRes> getDiariesByUser_Id(Long userId) {
		return diaryRepository.findByUser_Id(userId).stream()
				.map(DiaryRes::of) // ✅ DiaryRes 변환
				.collect(Collectors.toList());
	}

	@Override
	@Transactional(readOnly = true)
	public DiaryRes getDiaryById(Long diaryId) {
		Diary diary = diaryRepository.findById(diaryId)
				.orElseThrow(() -> new IllegalArgumentException("Diary not found with id: " + diaryId));
		return DiaryRes.of(diary);
	}

	@Override
	@Transactional
	public DiaryRes updateDiary(Long diaryId, DiaryUpdateReq diaryUpdateReq) {
		Diary diary = diaryRepository.findById(diaryId)
				.orElseThrow(() -> new IllegalArgumentException("Diary not found with id: " + diaryId));

		if (diaryUpdateReq.getConsultDate() != null) {
			diary.setConsultDate(diaryUpdateReq.getConsultDate());
		}
		if (diaryUpdateReq.getTag() != null && !diaryUpdateReq.getTag().isEmpty()) {
			diary.setTag(diaryUpdateReq.getTag());
		}
		if (diaryUpdateReq.getTitle() != null && !diaryUpdateReq.getTitle().isEmpty()) {
			diary.setTitle(diaryUpdateReq.getTitle());
		}
		if (diaryUpdateReq.getSummary() != null && !diaryUpdateReq.getSummary().isEmpty()) {
			diary.setSummary(diaryUpdateReq.getSummary());
		}
		if (diaryUpdateReq.getCardImageUrl() != null && !diaryUpdateReq.getCardImageUrl().isEmpty()) {
			diary.setCardImageUrl(diaryUpdateReq.getCardImageUrl());
		}

		return DiaryRes.of(diaryRepository.save(diary));
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
	public List<DiaryRes> getDiariesByConsultDate(LocalDate consultDate, String userId) {
		return diaryRepository.findByConsultDateAndUser_UserId(consultDate, userId).stream()
				.map(DiaryRes::of) // ✅ DiaryRes 변환
				.collect(Collectors.toList());
	}


	@Override
	@Transactional(readOnly = true)
	public Map<LocalDate, List<Long>> getTarotBotIdsByYearAndMonth(int year, int month) {
		List<Object[]> results = diaryRepository.findTarotBotIdsByYearAndMonth(year, month);

		// 날짜별 타로봇 ID 리스트를 저장할 Map 생성
		Map<LocalDate, List<Long>> tarotBotMap = new TreeMap<>();

		for (Object[] result : results) {
			LocalDate consultDate = (LocalDate) result[0];
			Long tarotBotId = (Long) result[1];

			// 날짜별로 타로봇 ID 추가
			tarotBotMap.computeIfAbsent(consultDate, k -> new ArrayList<>()).add(tarotBotId);
		}

		return tarotBotMap;
	}
}
