package com.ssafy.api.request;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

/**
 * 타로 봇 등록 API ([POST] /api/v1/tarot-bots) 요청에 필요한 리퀘스트 바디 정의.
 */
@Getter
@Setter
@ApiModel("TarotBotRegisterPostRequest")
public class TarotBotRegisterPostReq {
	@ApiModelProperty(name="타로 봇 이름", example="MysticTarot")
	private String botName;

	@ApiModelProperty(name = "타로 봇 설명", example = "A tarot card reading bot")
	private String description;

	@ApiModelProperty(name = "타로 봇 컨셉", example = "Mystical")
	private String concept;

	@ApiModelProperty(name = "프로필 이미지 URL", example = "https://example.com/image.png")
	private String profileImage;

	@ApiModelProperty(name = "타로 봇 MBTI", example = "INTJ")
	private String mbti;
}
