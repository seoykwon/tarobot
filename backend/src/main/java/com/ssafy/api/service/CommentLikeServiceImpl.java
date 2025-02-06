package com.ssafy.api.service;

import com.ssafy.db.entity.Comment;
import com.ssafy.db.entity.CommentLike;
import com.ssafy.db.entity.User;
import com.ssafy.db.repository.CommentLikeRepository;
import com.ssafy.db.repository.CommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * 댓글 좋아요 관련 비즈니스 로직 처리를 위한 서비스 구현 정의.
 */
@Service
@RequiredArgsConstructor
public class CommentLikeServiceImpl implements CommentLikeService {

    private final CommentRepository commentRepository;
    private final CommentLikeRepository commentLikeRepository;

    private User extractCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) {
            throw new SecurityException("인증된 사용자 정보가 없습니다.");
        }
        Object principal = auth.getPrincipal();
        if (principal instanceof User) {
            return (User) principal;
        } else {
            throw new IllegalStateException("인증 정보 형식이 올바르지 않습니다: " + principal.getClass());
        }
    }

    @Override
    @Transactional
    public void likeComment(Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("댓글을 찾을 수 없습니다."));
        User currentUser = extractCurrentUser();

        Optional<CommentLike> likeOpt = commentLikeRepository.findByCommentAndUser(comment, currentUser);
        if (likeOpt.isEmpty()) {
            CommentLike commentLike = new CommentLike();
            commentLike.setComment(comment);
            commentLike.setUser(currentUser);
            commentLikeRepository.save(commentLike);
        }
    }

    @Override
    @Transactional
    public void unlikeComment(Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("댓글을 찾을 수 없습니다."));
        User currentUser = extractCurrentUser();

        Optional<CommentLike> likeOpt = commentLikeRepository.findByCommentAndUser(comment, currentUser);
        likeOpt.ifPresent(commentLikeRepository::delete);
    }
}

