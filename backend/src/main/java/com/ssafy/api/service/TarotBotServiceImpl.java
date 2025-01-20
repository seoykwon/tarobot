package com.ssafy.api.service;

import com.ssafy.api.request.TarotBotRegisterPostReq;
import com.ssafy.db.entity.TarotBot;
import com.ssafy.db.repository.TarotBotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ssafy.db.repository.TarotBotRepositorySupport;

import java.util.List;

@Service
public class TarotBotServiceImpl implements TarotBotService {
    @Autowired
    TarotBotRepository tarotBotRepository;

    @Autowired
    TarotBotRepositorySupport tarotBotRepositorySupport;

    @Override
    public TarotBot createTarotBot(TarotBotRegisterPostReq registerInfo) {
        TarotBot tarotBot = new TarotBot();
        tarotBot.setBotName(registerInfo.getBotName());
        tarotBot.setDescription(registerInfo.getDescription());
        tarotBot.setConcept(registerInfo.getConcept());
        tarotBot.setProfileImage(registerInfo.getProfileImage());
        tarotBot.setMbti(registerInfo.getMbti());

        return tarotBotRepository.save(tarotBot);
    }

    @Override
    public TarotBot getTarotBotByBotName(String botName) {
        TarotBot tarotBot = tarotBotRepositorySupport.findTarotBotByBotName(botName).get();
        return tarotBot;
    }

    @Override
    public List<TarotBot> getAllTarotBots() {
        return tarotBotRepository.findAll();
    }
}
