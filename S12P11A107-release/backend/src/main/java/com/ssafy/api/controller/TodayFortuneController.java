package com.ssafy.api.controller;

import com.ssafy.api.request.TodayFortuneRegisterReq;
import com.ssafy.api.response.TodayFortuneRes;
import com.ssafy.api.service.TodayFortuneService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/main/fortune")
@Tag(name = "Today's Fortune API", description = "오늘의 운세 API를 관리합니다.")
@RequiredArgsConstructor
public class TodayFortuneController {

    private final TodayFortuneService todayFortuneService;

    @Operation(summary = "오늘의 운세 등록", description = "타로 카드 ID를 기반으로 오늘의 운세를 등록합니다. (등록 시 기본 운세 결과와 점수 할당)")
    @PostMapping
    public ResponseEntity<TodayFortuneRes> registerTodayFortune(@Valid @RequestBody TodayFortuneRegisterReq req) {
        TodayFortuneRes res = todayFortuneService.getTodayFortuneById(
                todayFortuneService.registerTodayFortune(req).getId()
        );
        return ResponseEntity.ok(res);
    }

    @Operation(summary = "오늘의 운세 조회",
            description = "쿼리 파라미터 fortuneId가 있으면 해당 운세 상세보기, 없으면 현재 로그인한 사용자의 오늘 운세를 조회합니다.")
    @GetMapping
    public ResponseEntity<TodayFortuneRes> getTodayFortune(@RequestParam(required = false) Long fortuneId) {
        TodayFortuneRes res;
        if (fortuneId != null) {
            res = todayFortuneService.getTodayFortuneById(fortuneId);
        } else {
            res = todayFortuneService.getTodayFortuneForCurrentUser();
        }

        if (res == null) {
            return ResponseEntity.noContent().build(); // 오늘의 운세 데이터 없을 시 204 No Content 반환
        }

        return ResponseEntity.ok(res);
    }
}
