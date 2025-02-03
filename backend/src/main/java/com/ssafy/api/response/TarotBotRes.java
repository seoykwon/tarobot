package com.ssafy.api.response;

import com.ssafy.db.entity.TarotBot;

import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema;import lombok.Getter;
import lombok.Setter;

/**
 * 타로 봇 정보 응답 객체 정의.
 */
@Getter
@Setter
@Schema(description = "TarotBotRes")
public class TarotBotRes {

    @Schema(description = "Bot Name")
    private String name;

    @Schema(description = "Description")
    private String description;

    @Schema(description = "Concept")
    private String concept;

    @Schema(description = "Profile Image")
    private String profileImage;

    @Schema(description = "MBTI")
    private String mbti;

    public static TarotBotRes of(TarotBot tarotBot) {
        TarotBotRes res = new TarotBotRes();
        res.setName(tarotBot.getName());
        res.setDescription(tarotBot.getDescription());
        res.setConcept(tarotBot.getConcept());
        res.setProfileImage(tarotBot.getProfileImage());
        res.setMbti(tarotBot.getMbti());
        return res;
    }
}
