package com.ssafy.api.controller;

import com.ssafy.api.request.TarotBotRegisterPostReq;
import com.ssafy.api.response.TarotBotRes;
import com.ssafy.api.service.TarotBotService;
import com.ssafy.common.model.response.BaseResponseBody;
import com.ssafy.db.entity.TarotBot;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@Tag(name = "TarotBot", description = "타로 봇 API")
@RestController
@RequestMapping("/api/v1/tarot-bots")
@RequiredArgsConstructor
public class TarotBotController {

	private final TarotBotService tarotBotService;

	@PostMapping()
	@Operation(summary = "타로 봇 등록", description = "<strong>name과 기타 정보</strong>를 통해 타로 마스터를 등록합니다.")
	@ApiResponses({
			@ApiResponse(responseCode = "200", description = "성공"),
			@ApiResponse(responseCode = "400", description = "잘못된 요청"),
			@ApiResponse(responseCode = "500", description = "서버 오류")
	})
	public ResponseEntity<? extends BaseResponseBody> register(
			@RequestBody @Parameter(description = "타로봇 정보", required = true) TarotBotRegisterPostReq registerInfo) {

		tarotBotService.createTarotBot(registerInfo);
		return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
	}

	@GetMapping()
	@Operation(summary = "모든 타로봇 조회", description = "등록된 모든 타로봇 정보를 조회합니다.")
	@ApiResponses({
			@ApiResponse(responseCode = "200", description = "성공"),
			@ApiResponse(responseCode = "500", description = "서버 오류")
	})
	public ResponseEntity<List<TarotBotRes>> getAllTarotBots() {
		List<TarotBot> tarotBots = tarotBotService.getAllTarotBots();
		List<TarotBotRes> response = new ArrayList<>();
		for (TarotBot tarotBot : tarotBots) {
			response.add(TarotBotRes.of(tarotBot));
		}
		return ResponseEntity.ok(response);
	}

	@GetMapping("/{tarotBotId}")
	@Operation(summary = "ID 기반 타로 봇 조회", description = "ID를 통해 타로 마스터 정보를 조회합니다.")
	@ApiResponses({
			@ApiResponse(responseCode = "200", description = "성공"),
			@ApiResponse(responseCode = "404", description = "타로 마스터 없음"),
			@ApiResponse(responseCode = "500", description = "서버 오류")
	})
	public ResponseEntity<TarotBotRes> getTarotBotInfo(
			@PathVariable @Parameter(description = "조회할 bot_id", required = true) Long tarotBotId) {

		TarotBot tarotBot = tarotBotService.getTarotBotById(tarotBotId);
		return ResponseEntity.status(200).body(TarotBotRes.of(tarotBot));
	}

	@PutMapping("/{tarotBotId}")
	@Operation(summary = "타로 봇 수정", description = "특정 타로 봇 ID의 내용을 수정합니다.")
	@ApiResponses({
			@ApiResponse(responseCode = "200", description = "성공"),
			@ApiResponse(responseCode = "404", description = "타로 봇을 찾을 수 없음"),
			@ApiResponse(responseCode = "500", description = "서버 오류")
	})
	public ResponseEntity<TarotBot> updateTarotBot(
			@PathVariable @Parameter(description = "타로 봇 ID", required = true) Long tarotBotId,
			@RequestBody @Parameter(description = "타로 봇 수정 정보", required = true) TarotBotRegisterPostReq tarotBotUpdateReq) {
		TarotBot updatedTarotBot = tarotBotService.updateTarotBot(tarotBotId, tarotBotUpdateReq);
		return ResponseEntity.ok(updatedTarotBot);
	}
}
