package com.ssafy.api.controller;

import com.ssafy.api.request.DiaryCreateReq;
import com.ssafy.api.request.DiaryUpdateReq;
import com.ssafy.api.response.DiaryRes;
import com.ssafy.api.service.DiaryService;
import com.ssafy.common.auth.SsafyUserDetails;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Tag(name = "Diary", description = "다이어리 API")
@RestController
@RequestMapping("/api/v1/diary")
@RequiredArgsConstructor
public class DiaryController {

    private final DiaryService diaryService;

    @PostMapping
    @Operation(summary = "다이어리 생성", description = "사용자 ID와 다이어리 정보를 기반으로 다이어리를 생성합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<DiaryRes> createDiary(
            @RequestBody @Parameter(description = "다이어리 생성 정보", required = true) DiaryCreateReq diaryCreateReq) {
        return ResponseEntity.ok(diaryService.createDiary(diaryCreateReq));
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "사용자별 다이어리 조회", description = "특정 사용자 ID에 해당하는 모든 다이어리를 조회합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "404", description = "사용자를 찾을 수 없음"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<List<DiaryRes>> getDiariesByUserId(
            @PathVariable @Parameter(description = "사용자 ID", required = true) Long userId) {
        return ResponseEntity.ok(diaryService.getDiariesByUser_Id(userId));
    }

    @PutMapping("/{diaryId}")
    @Operation(summary = "다이어리 수정", description = "특정 다이어리 ID의 내용을 수정합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "404", description = "다이어리를 찾을 수 없음"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<DiaryRes> updateDiary(
            @PathVariable @Parameter(description = "다이어리 ID", required = true) Long diaryId,
            @RequestBody @Parameter(description = "다이어리 수정 정보", required = true) DiaryUpdateReq diaryUpdateReq) {
        return ResponseEntity.ok(diaryService.updateDiary(diaryId, diaryUpdateReq));
    }

    @DeleteMapping("/{diaryId}")
    @Operation(summary = "다이어리 삭제", description = "특정 다이어리 ID로 다이어리를 삭제합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "성공"),
            @ApiResponse(responseCode = "404", description = "다이어리를 찾을 수 없음"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<Void> deleteDiary(
            @PathVariable @Parameter(description = "다이어리 ID", required = true) Long diaryId) {
        diaryService.deleteDiary(diaryId);
        return ResponseEntity.noContent().build();
    }

    // ✅ consultDate 기반 조회 API 추가
    @GetMapping("/{consultDate}")
    @Operation(summary = "상담 일자로 다이어리 조회", description = "지정된 상담 날짜에 해당하는 다이어리를 조회합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "404", description = "해당 날짜의 다이어리를 찾을 수 없음"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<List<DiaryRes>> getDiariesByConsultDate(Authentication authentication,
                                                                  @PathVariable @Parameter(description = "상담 일자 (YYYY-MM-DD)", required = true) String consultDate) {
        SsafyUserDetails userDetails = (SsafyUserDetails) authentication.getDetails();
        String userId = userDetails.getUsername();
        LocalDate date = LocalDate.parse(consultDate);
        List<DiaryRes> diaries = diaryService.getDiariesByConsultDate(date, userId);

//        if (diaries.isEmpty()) {
//            return ResponseEntity.notFound().build();
//        }
        return ResponseEntity.ok(diaries);
    }

    @GetMapping("/monthly")
    @Operation(summary = "연, 월 기준 날짜별 상담 기록이 있는 타로봇 ID 조회", description = "특정 연, 월에 해당하는 상담 기록이 있는 날짜별 타로봇 ID를 조회합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "404", description = "해당 월에 상담 기록 없음"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<Map<LocalDate, List<Long>>> getTarotBotIdsByYearAndMonth(
            @RequestParam @Parameter(description = "연도 (YYYY)", required = true) int year,
            @RequestParam @Parameter(description = "월 (MM)", required = true) int month) {

        Map<LocalDate, List<Long>> tarotBotMap = diaryService.getTarotBotIdsByYearAndMonth(year, month);

        if (tarotBotMap.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(tarotBotMap);
    }
}
