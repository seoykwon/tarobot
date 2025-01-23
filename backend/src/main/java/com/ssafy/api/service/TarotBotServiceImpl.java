package com.ssafy.api.service;

import com.ssafy.api.request.TarotBotRegisterPostReq;
import com.ssafy.db.entity.TarotBot;
import com.ssafy.db.repository.TarotBotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ssafy.db.repository.TarotBotRepositorySupport;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TarotBotServiceImpl implements TarotBotService {
    private final TarotBotRepository tarotBotRepository;

    private final TarotBotRepositorySupport tarotBotRepositorySupport;

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
        return tarotBotRepository.findByBotName(botName).get();
    }

    @Override
    public List<TarotBot> getAllTarotBots() {
        return tarotBotRepository.findAll();
    }
}
