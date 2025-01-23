package com.ssafy.db.repository;

import com.ssafy.db.entity.TarotBot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TarotBotRepository extends JpaRepository<TarotBot, Long> {
    TarotBot findByBotName(String botName);
}
