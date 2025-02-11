package com.ssafy.db.repository;

import com.ssafy.db.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByTarotBot_Id(Long tarotBotId, Sort sort); // 특정 타로봇의 리뷰 조회
    Page<Review> findByUser_Id(Long UserId, Pageable pageable); // 특정 작성자의 리뷰 조회
}
