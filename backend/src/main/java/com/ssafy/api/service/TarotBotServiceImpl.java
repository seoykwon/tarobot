package com.ssafy.api.service;


import com.ssafy.api.request.TarotBotRegisterPostReq;
import com.ssafy.db.entity.TarotBot;
import com.ssafy.db.repository.TarotBotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TarotBotServiceImpl implements TarotBotService {
    private final TarotBotRepository tarotBotRepository;

    @Override
    public TarotBot createTarotBot(TarotBotRegisterPostReq registerInfo) {
        TarotBot tarotBot = new TarotBot();
        tarotBot.setName(registerInfo.getName());
        tarotBot.setDescription(registerInfo.getDescription());
        tarotBot.setConcept(registerInfo.getConcept());
        tarotBot.setProfileImage(registerInfo.getProfileImage());
        tarotBot.setMbti(registerInfo.getMbti());

        return tarotBotRepository.save(tarotBot);
    }

    @Override
    public TarotBot getTarotBotByName(String name) {
        return tarotBotRepository.findByName(name).get();
    }

    @Override
    public List<TarotBot> getAllTarotBots() {
        return tarotBotRepository.findAll();
    }

    @Override
    @Transactional
    public TarotBot updateTarotBot(Long tarotBotId, TarotBotRegisterPostReq updateInfo) {
        TarotBot tarotBot = tarotBotRepository.findById(tarotBotId)
                .orElseThrow(() -> new IllegalArgumentException("TarotBot not found with id: " + tarotBotId));

        tarotBot.setName(updateInfo.getName());
        tarotBot.setDescription(updateInfo.getDescription());
        tarotBot.setConcept(updateInfo.getConcept());
        tarotBot.setProfileImage(updateInfo.getProfileImage());
        tarotBot.setMbti(updateInfo.getMbti());

        return tarotBotRepository.save(tarotBot);
    }
}
