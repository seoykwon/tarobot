package com.ssafy.api.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

/**
 * 타로 봇 등록 API ([POST] /api/v1/tarot-bots) 요청에 필요한 리퀘스트 바디 정의.
 */
@Getter
@Setter
@Schema(description = "TarotBotRegisterPostRequest")

public class TarotBotRegisterPostReq {
	@Schema(description = "타로 봇 이름", example="MysticTarot")
	private String name;

	@Schema(description = "타로 봇 설명", example = "A tarot card reading bot")
	private String description;

	@Schema(description = "타로 봇 컨셉", example = "Mystical")
	private String concept;

	@Schema(description = "프로필 이미지 URL", example = "https://example.com/image.png")
	private String profileImage;

	@Schema(description = "타로 봇 MBTI", example = "INTJ")
	private String mbti;
}
