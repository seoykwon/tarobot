package com.ssafy.api.response;

import com.ssafy.db.entity.Review;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@Schema(description = "Review Response")
public class ReviewRes {

    @Schema(description = "리뷰 ID", example = "10")
    private Long reviewId;

    @Schema(description = "타로봇 ID", example = "1")
    private Long tarotBotId;

    @Schema(description = "리뷰 내용", example = "매우 만족")
    private String comment;

    @Schema(description = "별점 (1~5)", example = "5")
    private int rating;

    @Schema(description = "작성 날짜", example = "2025-01-20")
    private LocalDate createdAt;

    public static ReviewRes of(Review review) {
        return new ReviewRes(
                review.getId(),
                review.getTarotBot().getId(),
                review.getContent(),
                review.getRating(),
                review.getDate()
        );
    }
}
