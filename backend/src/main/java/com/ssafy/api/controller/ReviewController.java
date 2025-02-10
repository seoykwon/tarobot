package com.ssafy.api.controller;

import com.ssafy.api.request.ReviewRegisterReq;
import com.ssafy.api.response.ReviewRes;
import com.ssafy.api.service.ReviewService;
import com.ssafy.common.auth.SsafyUserDetails;
import com.ssafy.common.model.response.BaseResponseBody;
import com.ssafy.db.entity.Review;
import com.ssafy.db.entity.TarotBot;
import com.ssafy.db.repository.ReviewRepository;
import com.ssafy.db.repository.TarotBotRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Tag(name = "Review", description = "리뷰 API")
@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewRepository reviewRepository;
    private final TarotBotRepository tarotBotRepository;
    private final ReviewService reviewService;

    @PostMapping("/{tarotBotId}")
    @Operation(summary = "리뷰 생성", description = "타로봇 ID와 리뷰 정보를 기반으로 리뷰를 생성합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<? extends BaseResponseBody> createReview(@PathVariable @Parameter(description = "타로 봇 ID", required = true) Long tarotBotId,
                                                                   @RequestBody @Parameter(description = "리뷰 생성 정보", required = true) ReviewRegisterReq request) {

        Review createdReview = reviewService.createReview(tarotBotId, request);
        return ResponseEntity.status(HttpStatus.OK)
                .body(BaseResponseBody.of(200, "Success"));
    }

    // 전체 리뷰 목록 조회 (전체 리뷰)
    @GetMapping
    @Operation(summary = "모든 리뷰 조회", description = "모든 리뷰를 조회합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "404", description = "리뷰를 찾을 수 없음"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<List<ReviewRes>> getAllReviews() {
        List<Review> reviews = reviewRepository.findAll();
        List<ReviewRes> response = reviews.stream().map(ReviewRes::of).toList();
        return ResponseEntity.ok(response);
    }

    // 특정 리뷰 조회 (단일 리뷰)
    @GetMapping("/{reviewId}")
    @Operation(summary = "특정 리뷰 조회", description = "특정 리뷰 ID에 해당하는 리뷰를 조회합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "404", description = "리뷰를 찾을 수 없음"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<ReviewRes> getReviewById(@PathVariable Long reviewId) {
        Optional<Review> review = reviewRepository.findById(reviewId);
        return review.map(r -> ResponseEntity.ok(ReviewRes.of(r)))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    // 리뷰 수정 API
    @PutMapping("/{reviewId}")
    @Operation(summary = "리뷰 수정", description = "특정 리뷰 ID의 내용을 수정합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "404", description = "리뷰를 찾을 수 없음"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<?> updateReview(
            @PathVariable @Parameter(description = "리뷰 ID", required = true) Long reviewId,
            @RequestBody @Parameter(description = "리뷰 수정 정보", required = true) ReviewRegisterReq request) {

        Review updatedReview = reviewService.updateReview(reviewId, request);
        return ResponseEntity.ok("Review updated successfully");
    }

    // 리뷰 삭제 API
    @DeleteMapping("/{reviewId}")
    @Operation(summary = "리뷰 삭제", description = "특정 리뷰 ID로 리뷰를 삭제합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "성공"),
            @ApiResponse(responseCode = "404", description = "리뷰를 찾을 수 없음"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<?> deleteReview(
            @PathVariable @Parameter(description = "리뷰 ID", required = true) Long reviewId) {
        reviewService.deleteReview(reviewId);
        return ResponseEntity.ok("Review deleted successfully");
    }

    // 내가 작성한 리뷰 조회 API
    @GetMapping("/me")
    @Operation(summary = "내가 작성한 리뷰 조회", description = "현재 로그인한 사용자가 작성한 리뷰 목록을 조회합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "401", description = "인증 실패"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<List<ReviewRes>> getMyReviews(
            @RequestParam(defaultValue = "0") @Parameter(description = "페이지 번호 (0부터 시작)", required = false) int page,
            @RequestParam(defaultValue = "10") @Parameter(description = "페이지 크기", required = false) int size) {


        List<ReviewRes> reviews = reviewService.getReviewsByUser(page, size);
        return ResponseEntity.ok(reviews);
    }
}

