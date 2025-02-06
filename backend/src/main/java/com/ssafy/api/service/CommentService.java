package com.ssafy.api.service;

import com.ssafy.api.request.CommentRegisterReq;
import com.ssafy.api.request.CommentUpdateReq;
import com.ssafy.db.entity.Comment;
import java.util.List;

public interface CommentService {
    // 댓글 등록
    Comment createComment(CommentRegisterReq req);

    // 특정 게시글의 활성 댓글 조회
    List<Comment> getCommentsByPost(Long postId);

    // 댓글 수정
    Comment updateComment(Long commentId, CommentUpdateReq req);

    // 일반 사용자가 댓글 “삭제” 요청 시, 비활성화 처리
    void deleteComment(Long commentId);

    // 관리자 전용: 비활성화된 댓글 영구 삭제
    void deleteCommentPermanently(Long commentId);
}