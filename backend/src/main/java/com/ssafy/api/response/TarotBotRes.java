package com.ssafy.api.response;

import com.ssafy.db.entity.TarotBot;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

/**
 * 타로 봇 정보 응답 객체 정의.
 */
@Getter
@Setter
@ApiModel("TarotBotRes")
public class TarotBotRes {

    @ApiModelProperty(name = "Bot Name")
    private String botName;

    @ApiModelProperty(name = "Description")
    private String description;

    @ApiModelProperty(name = "Concept")
    private String concept;

    @ApiModelProperty(name = "Profile Image")
    private String profileImage;

    @ApiModelProperty(name = "MBTI")
    private String mbti;

    public static TarotBotRes of(TarotBot tarotBot) {
        TarotBotRes res = new TarotBotRes();
        res.setBotName(tarotBot.getBotName());
        res.setDescription(tarotBot.getDescription());
        res.setConcept(tarotBot.getConcept());
        res.setProfileImage(tarotBot.getProfileImage());
        res.setMbti(tarotBot.getMbti());
        return res;
    }
}
