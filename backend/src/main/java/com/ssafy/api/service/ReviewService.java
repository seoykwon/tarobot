package com.ssafy.api.service;

import com.ssafy.db.entity.Review;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ReviewService {
    List<Review> getReviewsByUserId(Long userId, Pageable pageable);
}
