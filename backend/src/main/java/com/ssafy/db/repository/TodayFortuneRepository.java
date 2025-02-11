package com.ssafy.db.repository;

import com.ssafy.db.entity.TodayFortune;
import com.ssafy.db.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

@Repository
public interface TodayFortuneRepository extends JpaRepository<TodayFortune, Long> {
    // 사용자와 날짜 조건으로 오늘의 운세 조회
    TodayFortune findByUserAndDate(User user, LocalDate date);
}
