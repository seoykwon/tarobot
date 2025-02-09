package com.ssafy.db.repository;

import com.ssafy.db.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByTarotBotId(Long tarotBotId); // 특정 타로봇의 리뷰 조회
    List<Review> findByAuthor(Long userId, Pageable pageable); // 특정 작성자의 리뷰 조회
}
