package com.ssafy.api.service;

import com.ssafy.api.request.ReviewRegisterReq;
import com.ssafy.api.response.ReviewRes;
import com.ssafy.db.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface ReviewService {
    Review createReview(Long tarotBotId, ReviewRegisterReq request);
    Review updateReview(Long reviewId, ReviewRegisterReq request);
    void deleteReview(Long reviewId);
    List<ReviewRes> getReviewsByUser(int page, int size);
}
