package com.ssafy.api.controller;

import com.ssafy.api.request.DiaryCreateReq;
import com.ssafy.api.request.DiaryUpdateReq;
import com.ssafy.api.service.DiaryService;
import com.ssafy.db.entity.Diary;
import io.swagger.annotations.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Api(value = "다이어리 API", tags = {"Diary"})
@RestController
@RequestMapping("/api/v1/diary")
@RequiredArgsConstructor
public class DiaryController {

    private final DiaryService diaryService;

    @PostMapping
    @ApiOperation(value = "다이어리 생성", notes = "사용자 ID와 다이어리 정보를 기반으로 다이어리를 생성합니다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 400, message = "잘못된 요청"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<Diary> createDiary(@RequestBody @ApiParam(value = "다이어리 생성 정보", required = true) DiaryCreateReq diaryCreateReq) {
        Diary createdDiary = diaryService.createDiary(diaryCreateReq);
        return ResponseEntity.ok(createdDiary);
    }

    @GetMapping("/user/{userId}")
    @ApiOperation(value = "사용자별 다이어리 조회", notes = "특정 사용자 ID에 해당하는 모든 다이어리를 조회합니다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 404, message = "사용자를 찾을 수 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<List<Diary>> getDiariesByUserId(@PathVariable @ApiParam(value = "사용자 ID", required = true) Long userId) {
        List<Diary> diaries = diaryService.getDiariesByUser_Id(userId);
        return ResponseEntity.ok(diaries);
    }

    @GetMapping("/{diaryId}")
    @ApiOperation(value = "다이어리 단건 조회", notes = "특정 다이어리 ID로 다이어리를 조회합니다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 404, message = "다이어리를 찾을 수 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<Diary> getDiaryById(@PathVariable @ApiParam(value = "다이어리 ID", required = true) Long diaryId) {
        Diary diary = diaryService.getDiaryById(diaryId);
        return ResponseEntity.ok(diary);
    }

    @PutMapping("/{diaryId}")
    @ApiOperation(value = "다이어리 수정", notes = "특정 다이어리 ID의 내용을 수정합니다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 404, message = "다이어리를 찾을 수 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<Diary> updateDiary(
            @PathVariable @ApiParam(value = "다이어리 ID", required = true) Long diaryId,
            @RequestBody @ApiParam(value = "다이어리 수정 정보", required = true) DiaryUpdateReq diaryUpdateReq) {
        Diary updatedDiary = diaryService.updateDiary(diaryId, diaryUpdateReq);
        return ResponseEntity.ok(updatedDiary);
    }

    @DeleteMapping("/{diaryId}")
    @ApiOperation(value = "다이어리 삭제", notes = "특정 다이어리 ID로 다이어리를 삭제합니다.")
    @ApiResponses({
            @ApiResponse(code = 204, message = "성공"),
            @ApiResponse(code = 404, message = "다이어리를 찾을 수 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<Void> deleteDiary(@PathVariable @ApiParam(value = "다이어리 ID", required = true) Long diaryId) {
        diaryService.deleteDiary(diaryId);
        return ResponseEntity.noContent().build();
    }
}
