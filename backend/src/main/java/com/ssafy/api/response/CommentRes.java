package com.ssafy.api.response;

import com.ssafy.db.entity.Comment;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Schema(description = "Comment Response")
public class CommentRes {

    @Schema(description = "댓글 ID", example = "1")
    private Long id;

    @Schema(description = "댓글 내용", example = "좋은 글이에요!")
    private String content;

    @Schema(description = "게시글 ID", example = "1")
    private Long postId;

    @Schema(description = "작성자 ID", example = "ssafy_web")
    private String userId;

    @Schema(description = "댓글 좋아요 수", example = "5")
    private int likeCount;

    @Schema(description = "생성 시간", example = "2025-01-23T12:00:00")
    private LocalDateTime createdAt;

    @Schema(description = "수정 시간", example = "2025-01-23T15:30:00")
    private LocalDateTime updatedAt;

    public static CommentRes of(Comment comment) {
        CommentRes res = new CommentRes();
        res.setId(comment.getId());
        res.setContent(comment.getContent());
        res.setPostId(comment.getPost().getId());
        res.setUserId(comment.getAuthor().getUserId());
        res.setLikeCount(comment.getLikeCount());
        res.setCreatedAt(comment.getCreatedAt());
        res.setUpdatedAt(comment.getUpdatedAt());
        return res;
    }
}
