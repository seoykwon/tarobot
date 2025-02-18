package com.ssafy.db.repository;

import com.ssafy.db.entity.Diary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface DiaryRepository extends JpaRepository<Diary, Long> {
    List<Diary> findByUser_Id(Long id);
    List<Diary> findByConsultDateAndUser_UserId(LocalDate consultDate, String userId);
    @Query("SELECT d.consultDate, d.tarotBot.id FROM Diary d WHERE YEAR(d.consultDate) = :year AND MONTH(d.consultDate) = :month ORDER BY d.consultDate ASC")
    List<Object[]> findTarotBotIdsByYearAndMonth(@Param("year") int year, @Param("month") int month);
}
