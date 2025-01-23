package com.ssafy.api.controller;


import com.ssafy.api.request.TarotBotRegisterPostReq;
import com.ssafy.api.response.TarotBotRes;
import com.ssafy.api.service.TarotBotService;
import com.ssafy.common.model.response.BaseResponseBody;
import com.ssafy.db.entity.TarotBot;
import io.swagger.annotations.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@Api(value = "타로 봇 API", tags = {"TarotBot"})
@RestController
@RequestMapping("/api/v1/tarot-bots")
@RequiredArgsConstructor
public class TarotBotController {
	
	private final TarotBotService tarotBotService;

	@PostMapping()
	@ApiOperation(value = "타로 봇 등록", notes = "<strong>name과 기타 정보</strong>를 통해 타로 마스터를 등록합니다.")
	@ApiResponses({
			@ApiResponse(code = 200, message = "성공"),
			@ApiResponse(code = 400, message = "잘못된 요청"),
			@ApiResponse(code = 500, message = "서버 오류")
	})
	public ResponseEntity<? extends BaseResponseBody> register(
			@RequestBody @ApiParam(value = "타로봇 정보", required = true) TarotBotRegisterPostReq registerInfo) {

		TarotBot tarotBot = tarotBotService.createTarotBot(registerInfo);

		return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
	}

	@GetMapping()
	@ApiOperation(value = "모든 타로봇 조회", notes = "등록된 모든 타로봇 정보를 조회합니다.")
	@ApiResponses({
			@ApiResponse(code = 200, message = "성공"),
			@ApiResponse(code = 500, message = "서버 오류")
	})
	public ResponseEntity<List<TarotBotRes>> getAllTarotBots() {
		// 모든 타로봇 데이터를 가져옴
		List<TarotBot> tarotBots = tarotBotService.getAllTarotBots();

		// Entity → DTO 변환
        List<TarotBotRes> response = new ArrayList<>();
        for (TarotBot tarotBot : tarotBots) {
            TarotBotRes tarotBotRes = TarotBotRes.of(tarotBot);
            response.add(tarotBotRes);
        }

        return ResponseEntity.ok(response);
	}

	@GetMapping("/{name}")
	@ApiOperation(value = "이름 기반 타로 봇 조회", notes = "name을 통해 타로 마스터 정보를 조회합니다.")
	@ApiResponses({
			@ApiResponse(code = 200, message = "성공"),
			@ApiResponse(code = 404, message = "타로 마스터 없음"),
			@ApiResponse(code = 500, message = "서버 오류")
	})
	public ResponseEntity<TarotBotRes> getTarotBotInfo(
			@PathVariable @ApiParam(value = "조회할 name", required = true) String name) {

		// 타로 마스터 조회 서비스 호출
		TarotBot tarotBot = tarotBotService.getTarotBotByName(name);

		// 조회 결과 응답
		return ResponseEntity.status(200).body(TarotBotRes.of(tarotBot));
	}


}
