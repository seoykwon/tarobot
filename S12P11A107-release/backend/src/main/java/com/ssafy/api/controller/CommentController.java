package com.ssafy.api.controller;

import com.ssafy.api.request.CommentRegisterReq;
import com.ssafy.api.request.CommentUpdateReq;
import com.ssafy.api.response.CommentRes;
import com.ssafy.api.service.CommentLikeService;
import com.ssafy.api.service.CommentService;
import com.ssafy.db.entity.Comment;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@Tag(name = "Comment", description = "댓글 API")
@RestController
@RequestMapping("/api/v1/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;
    private final CommentLikeService commentLikeService;

    @Operation(summary = "댓글 등록", description = "새 댓글을 등록합니다.")
    @PostMapping
    public ResponseEntity<CommentRes> createComment(@RequestBody @Valid CommentRegisterReq request) {
        Comment comment = commentService.createComment(request);
        return new ResponseEntity<>(CommentRes.of(comment), HttpStatus.CREATED);
    }

    @Operation(summary = "댓글 조회", description = "특정 게시글의 활성 댓글 목록을 조회합니다.")
    @GetMapping
    public ResponseEntity<List<CommentRes>> getCommentsByPost(@RequestParam Long postId) {
        List<Comment> comments = commentService.getCommentsByPost(postId);
        List<CommentRes> response = comments.stream().map(CommentRes::of).collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "댓글 수정", description = "댓글을 수정합니다. 작성자와 요청자가 동일해야 합니다.")
    @PutMapping("/{commentId}")
    public ResponseEntity<CommentRes> updateComment(@PathVariable Long commentId,
                                                    @RequestBody @Valid CommentUpdateReq request) {
        Comment updatedComment = commentService.updateComment(commentId, request);
        return ResponseEntity.ok(CommentRes.of(updatedComment));
    }

    @Operation(summary = "댓글 수정용 데이터 조회",
            description = "댓글 ID를 통해 기존 댓글 데이터를 조회하여 수정 폼에 원래 내용을 채워줍니다.")
    @GetMapping("/{commentId}/edit")
    public ResponseEntity<CommentUpdateReq> getCommentForEdit(@PathVariable Long commentId) {
        Comment comment = commentService.getCommentEntityById(commentId);
        CommentUpdateReq updateReq = new CommentUpdateReq();
        updateReq.setContent(comment.getContent());
        return ResponseEntity.ok(updateReq);
    }

    @Operation(summary = "댓글 삭제 (비활성화 처리)", description = "일반 사용자는 댓글을 삭제 요청하면 비활성화합니다.")
    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long commentId) {
        commentService.deleteComment(commentId);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "댓글 영구 삭제 (관리자 전용)", description = "관리자가 비활성화된 댓글을 영구 삭제합니다.")
    @DeleteMapping("/{commentId}/permanent")
    public ResponseEntity<Void> deleteCommentPermanently(@PathVariable Long commentId) {
        commentService.deleteCommentPermanently(commentId);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "댓글 좋아요", description = "댓글에 좋아요를 추가합니다.")
    @PostMapping("/{commentId}/like")
    public ResponseEntity<Void> likeComment(@PathVariable Long commentId) {
        commentLikeService.likeComment(commentId);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "댓글 좋아요 취소", description = "댓글의 좋아요를 취소합니다.")
    @DeleteMapping("/{commentId}/like")
    public ResponseEntity<Void> unlikeComment(@PathVariable Long commentId) {
        commentLikeService.unlikeComment(commentId);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "댓글 좋아요 상태 조회",
            description = "현재 로그인한 사용자가 해당 댓글에 대해 좋아요를 눌렀는지 여부를 반환합니다. (true: 좋아요 있음, false: 좋아요 없음)")
    @GetMapping("/{commentId}/like")
    public ResponseEntity<Boolean> getCommentLikeStatus(@PathVariable Long commentId) {
        boolean isLiked = commentLikeService.isCommentLiked(commentId);
        return ResponseEntity.ok(isLiked);
    }

}
