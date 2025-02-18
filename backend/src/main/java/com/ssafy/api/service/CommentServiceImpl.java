package com.ssafy.api.service;

import com.ssafy.api.request.CommentRegisterReq;
import com.ssafy.api.request.CommentUpdateReq;
import com.ssafy.common.util.SecurityUtil;
import com.ssafy.db.entity.Comment;
import com.ssafy.db.entity.Post;
import com.ssafy.db.entity.User;
import com.ssafy.db.repository.CommentRepository;
import com.ssafy.db.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service("commentService")
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final SecurityUtil securityUtil;

    /**
     댓글 작성
     */
    @Override
    @Transactional
    public Comment createComment(CommentRegisterReq req) {
        Post post = postRepository.findById(req.getPostId())
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));
        User currentUser = securityUtil.getCurrentUser();

        Comment comment = new Comment();
        comment.setContent(req.getContent());
        comment.setPost(post);
        comment.setAuthor(currentUser);
        comment.setActive(true);

        Comment savedComment = commentRepository.save(comment);

        post.setCommentCount(post.getCommentCount() + 1);
        postRepository.save(post);

        return savedComment;
    }


    /**
     활성 댓글만 조회
     */
    @Override
    public List<Comment> getCommentsByPost(Long postId) {
        return commentRepository.findByPost_IdAndIsActiveTrueOrderByCreatedAtAsc(postId);
    }

    /**
    댓글 엔티티 반환
     */
    @Override
    public Comment getCommentEntityById(Long commentId) {
        return commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("대상 댓글을 찾을 수 없습니다."));
    }

    /**
     댓글 수정
     */
    @Override
    @Transactional
    public Comment updateComment(Long commentId, CommentUpdateReq req) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("댓글을 찾을 수 없습니다."));
        User currentUser = securityUtil.getCurrentUser();

        if (!comment.getAuthor().getUserId().equals(currentUser.getUserId()) && !currentUser.isAdmin()) {
            throw new SecurityException("댓글 수정 권한이 없습니다.");
        }

        comment.setContent(req.getContent());
        return commentRepository.save(comment);
    }

    /**
     댓글 삭제
     */
    @Override
    @Transactional
    public void deleteComment(Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("댓글을 찾을 수 없습니다."));
        User currentUser = securityUtil.getCurrentUser();

        if (!comment.getAuthor().getUserId().equals(currentUser.getUserId()) && !currentUser.isAdmin()) {
            throw new SecurityException("댓글 삭제 권한이 없습니다.");
        }

        comment.setActive(false);
        commentRepository.save(comment);

        Post post = comment.getPost();
        post.setCommentCount(Math.max(post.getCommentCount() - 1, 0));
        postRepository.save(post);
    }

    /**
     * 관리자: 실제 삭제 처리 (비활성화된 댓글만 삭제 가능)
     */
    @Override
    @Transactional
    public void deleteCommentPermanently(Long commentId) {
        User currentUser = securityUtil.getCurrentUser();

        if (!currentUser.isAdmin()) {
            throw new SecurityException("영구 삭제는 관리자만 할 수 있습니다.");
        }

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("댓글을 찾을 수 없습니다."));
        if (comment.isActive()) {
            throw new IllegalStateException("비활성화된 댓글만 영구 삭제할 수 있습니다.");
        }
        commentRepository.delete(comment);
    }
}
