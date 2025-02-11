package com.ssafy.api.service;

import com.ssafy.api.request.ReviewRegisterReq;
import com.ssafy.api.response.ReviewRes;
import com.ssafy.db.entity.Review;
import com.ssafy.db.entity.TarotBot;
import com.ssafy.db.entity.User;
import com.ssafy.db.repository.ReviewRepository;
import com.ssafy.db.repository.TarotBotRepository;
import com.ssafy.common.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final TarotBotRepository tarotBotRepository;
    private final SecurityUtil securityUtil;

    @Override
    public Review createReview(Long tarotBotId, ReviewRegisterReq request) {
        // 타로봇 존재 여부 확인
        TarotBot tarotBot = tarotBotRepository.findById(tarotBotId)
                .orElseThrow(() -> new IllegalArgumentException("TarotBot not found"));

        // 현재 인증된 사용자 조회
        User currentUser = securityUtil.getCurrentUser();

        Review review = new Review();
        review.setTarotBot(tarotBot);
        review.setUser(currentUser);
        review.setRating(request.getRating());
        review.setContent(request.getContent());
        review.setDate(LocalDate.now());

        return reviewRepository.save(review);
    }

    @Override
    public Review updateReview(Long reviewId, ReviewRegisterReq request) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("Review not found"));
        User currentUser = securityUtil.getCurrentUser();

        // 본인 작성 여부 검사; 현재 사용자와 작성자가 다르면 권한 없음
        if (!review.getUser().getId().equals(currentUser.getId())) {
            throw new SecurityException("수정 권한이 없습니다.");
        }

        review.setRating(request.getRating());
        review.setContent(request.getContent());
        return reviewRepository.save(review);
    }

    @Override
    public void deleteReview(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("Review not found"));
        User currentUser = securityUtil.getCurrentUser();

        if (!review.getUser().getId().equals(currentUser.getId())) {
            throw new SecurityException("삭제 권한이 없습니다.");
        }
        reviewRepository.delete(review);
    }

    @Override
    public List<ReviewRes> getReviewsByUser(int page, int size) {
        User currentUser = securityUtil.getCurrentUser();
        Long userId = currentUser.getId();
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Review> reviewPage = reviewRepository.findByUser_Id(userId, pageable);
// Page 객체의 컨텐트만 추출하여 ReviewRes 리스트로 변환 후 반환
        return reviewPage.getContent()
                .stream()
                .map(ReviewRes::of)
                .collect(Collectors.toList());
    }

}
