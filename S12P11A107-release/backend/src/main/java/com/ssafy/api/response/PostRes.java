package com.ssafy.api.response;

import com.ssafy.db.entity.Post;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * 게시글 정보 응답 객체 정의.
 */
@Getter
@Setter
@Schema(description = "Post Response")
public class PostRes {

    @Schema(description = "게시글 ID", example = "1")
    private Long id;

    @Schema(description = "게시글 제목", example = "오늘의 일상")
    private String title;

    @Schema(description = "게시글 내용", example = "오늘은 정말 즐거운 하루였어요!")
    private String content;

    @Schema(description = "이미지 URL", example = "https://example.com/image.png")
    private String imageUrl;

    @Schema(description = "작성자 ID", example = "ssafy_web")
    private String userId;

    @Schema(description = "조회수", example = "100")
    private int viewCount;

    @Schema(description = "댓글 수", example = "5")
    private int commentCount;

    @Schema(description = "좋아요 수", example = "10")
    private int likeCount;

    @Schema(description = "생성 시간", example = "2025-01-23T12:00:00")
    private LocalDateTime createdAt;

    @Schema(description = "수정 시간", example = "2025-01-23T15:30:00")
    private LocalDateTime updatedAt;

    public static PostRes of(Post post) {
        PostRes res = new PostRes();
        res.setId(post.getId());
        res.setTitle(post.getTitle());
        res.setContent(post.getContent());
        res.setImageUrl(post.getImageUrl());
        res.setUserId(post.getAuthor().getUserId());
        res.setViewCount(post.getViewCount());
        res.setCommentCount(post.getCommentCount());
        res.setLikeCount(post.getLikeCount());
        res.setCreatedAt(post.getCreatedAt());
        res.setUpdatedAt(post.getUpdatedAt());
        return res;
    }
}
