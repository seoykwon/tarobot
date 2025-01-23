package com.ssafy.api.response;

import com.ssafy.db.entity.Post;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * 게시글 정보 응답 객체 정의.
 */
@Getter
@Setter
@ApiModel("PostResponse")
public class PostRes {

    @ApiModelProperty(name = "게시글 제목", example = "오늘의 일상")
    private String title;

    @ApiModelProperty(name = "게시글 내용", example = "오늘은 정말 즐거운 하루였어요!")
    private String content;

    @ApiModelProperty(name = "이미지 URL", example = "https://example.com/image.png")
    private String imageUrl;

    @ApiModelProperty(name = "작성자 ID", example = "user123")
    private String authorId;

    @ApiModelProperty(name = "조회수", example = "100")
    private int viewCount;

    @ApiModelProperty(name = "댓글 수", example = "5")
    private int commentCount;

    @ApiModelProperty(name = "좋아요 수", example = "10")
    private int likeCount;

    @ApiModelProperty(name = "생성 시간", example = "2025-01-23T12:00:00")
    private LocalDateTime createdAt;

    @ApiModelProperty(name = "수정 시간", example = "2025-01-23T15:30:00")
    private LocalDateTime updatedAt;

    public static PostRes of(Post post) {
        PostRes res = new PostRes();
        res.setTitle(post.getTitle());
        res.setContent(post.getContent());
        res.setImageUrl(post.getImageUrl());
        res.setAuthorId(post.getAuthor().getUserId()); // 작성자 ID 가져오기
        res.setViewCount(post.getViewCount());
        res.setCommentCount(post.getCommentCount());
        res.setLikeCount(post.getLikeCount());
        res.setCreatedAt(post.getCreatedAt());
        res.setUpdatedAt(post.getUpdatedAt());
        return res;
    }
}
