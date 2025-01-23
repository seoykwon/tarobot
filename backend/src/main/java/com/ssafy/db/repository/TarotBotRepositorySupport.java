package com.ssafy.db.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.db.entity.QTarotBot;
import com.ssafy.db.entity.TarotBot;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class TarotBotRepositorySupport {
    private final JPAQueryFactory jpaQueryFactory;
    QTarotBot qTarotBot = QTarotBot.tarotBot;

    public Optional<TarotBot> findTarotBotByBotName(String botName) {
        TarotBot tarotBot = jpaQueryFactory.select(qTarotBot).from(qTarotBot)
                .where(qTarotBot.botName.eq(botName)).fetchOne();
        if(tarotBot == null) return Optional.empty();
        return Optional.ofNullable(tarotBot);
    }
}
