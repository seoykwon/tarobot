package com.ssafy.api.service;

/**
 * 댓글 좋아요 관련 비즈니스 로직 처리를 위한 서비스 인터페이스 정의.
 */
public interface CommentLikeService {
    // 댓글에 좋아요를 추가하는 기능
    void likeComment(Long commentId);

    // 댓글 좋아요를 취소하는 기능
    void unlikeComment(Long commentId);

    // 현재 로그인한 사용자가 해당 댓글에 좋아요를 눌렀는지 여부를 반환하는 기능
    boolean isCommentLiked(Long commentId);
}
