package com.ssafy.api.service;

import com.ssafy.api.request.TarotBotRegisterPostReq;
import com.ssafy.db.entity.TarotBot;

import java.util.List;

public interface TarotBotService {
	TarotBot createTarotBot(TarotBotRegisterPostReq tarotBotRegisterInfo);
	TarotBot getTarotBotByName(String Name);
	List<TarotBot> getAllTarotBots();
}