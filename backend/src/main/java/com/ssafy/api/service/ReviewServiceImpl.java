package com.ssafy.api.service;

import com.ssafy.db.entity.Review;
import com.ssafy.db.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Pageable;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;

    @Override
    public List<Review> getReviewsByUserId(Long userId, Pageable pageable) {
        return reviewRepository.findByAuthor(userId, pageable);
    }
}

