package com.ssafy.api.controller;

import com.ssafy.api.request.ReviewCreateReq;
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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Tag(name = "Review", description = "리뷰 API")
@RestController
@RequestMapping("/api/review")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewRepository reviewRepository;
    private final TarotBotRepository tarotBotRepository;

    @PostMapping("/{tarotBotId}")
    @Operation(summary = "리뷰 생성", description = "타로봇 ID와 리뷰 정보를 기반으로 리뷰를 생성합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<? extends BaseResponseBody> addReview(@PathVariable @Parameter(description = "타로 봇 ID", required = true) Long tarotBotId,
                                                                @RequestBody @Parameter(description = "리뷰 생성 정보", required = true) ReviewCreateReq request) {
        Optional<TarotBot> tarotBotOptional = tarotBotRepository.findById(tarotBotId);

        if (tarotBotOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(BaseResponseBody.of(404, "TarotBot not found"));
        }

        TarotBot tarotBot = tarotBotOptional.get();

        Review review = new Review();
        review.setTarotBot(tarotBot);
        review.setAuthor(request.getAuthor());
        review.setRating(request.getRating());
        review.setContent(request.getContent());
        review.setDate(LocalDate.now());

        reviewRepository.save(review);

        return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
    }

    // ✅ 1. 전체 리뷰 목록 조회 (전체 리뷰)
    @GetMapping
    @Operation(summary = "모든 리뷰 조회", description = "모든 리뷰를 조회합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "404", description = "리뷰를 찾을 수 없음"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<List<Review>> getAllReviews() {
        List<Review> reviews = reviewRepository.findAll();
        return ResponseEntity.ok(reviews);
    }

    // ✅ 2. 특정 리뷰 조회 (단일 리뷰)
    @GetMapping("/{reviewId}")
    @Operation(summary = "특정 리뷰 조회", description = "특정 리뷰 ID에 해당하는 리뷰를 조회합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "404", description = "리뷰를 찾을 수 없음"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<Review> getReviewById(@PathVariable @Parameter(description = "리뷰 ID", required = true) Long reviewId) {
        Optional<Review> review = reviewRepository.findById(reviewId);
        return review.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    // ✅ 3. 리뷰 수정 API
    @PutMapping("/{reviewId}")
    @Operation(summary = "리뷰 수정", description = "특정 리뷰 ID의 내용을 수정합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "404", description = "리뷰를 찾을 수 없음"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<?> updateReview(
            @PathVariable @Parameter(description = "리뷰 ID", required = true) Long reviewId,
            @RequestBody @Parameter(description = "리뷰 수정 정보", required = true) ReviewCreateReq request) {

        Optional<Review> reviewOptional = reviewRepository.findById(reviewId);

        if (reviewOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Review not found");
        }

        Review review = reviewOptional.get();
        review.setAuthor(request.getAuthor());
        review.setRating(request.getRating());
        review.setContent(request.getContent());
        reviewRepository.save(review); // 변경 사항 저장

        return ResponseEntity.ok("Review updated successfully");
    }

    // ✅ 4. 리뷰 삭제 API
    @DeleteMapping("/{reviewId}")
    @Operation(summary = "리뷰 삭제", description = "특정 리뷰 ID로 리뷰를 삭제합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "성공"),
            @ApiResponse(responseCode = "404", description = "리뷰를 찾을 수 없음"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<?> deleteReview(@PathVariable @Parameter(description = "리뷰 ID", required = true) Long reviewId) {
        if (!reviewRepository.existsById(reviewId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Review not found");
        }

        reviewRepository.deleteById(reviewId);
        return ResponseEntity.ok("Review deleted successfully");
    }
}

