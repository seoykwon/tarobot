package com.ssafy.api.service;

import com.ssafy.common.auth.SsafyUserDetails;
import com.ssafy.db.entity.Comment;
import com.ssafy.db.entity.CommentLike;
import com.ssafy.db.entity.User;
import com.ssafy.db.repository.CommentLikeRepository;
import com.ssafy.db.repository.CommentRepository;
import com.ssafy.db.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolderStrategy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CommentLikeServiceImpl implements CommentLikeService {

    private final CommentRepository commentRepository;
    private final CommentLikeRepository commentLikeRepository;
    private final UserRepository userRepository;
    private final SecurityContextHolderStrategy securityContextHolderStrategy;

    private User extractCurrentUser() {
        Authentication auth = securityContextHolderStrategy.getContext().getAuthentication();
        if (auth == null) {
            throw new SecurityException("인증된 사용자 정보가 없습니다.");
        }
        Object principal = auth.getPrincipal();
        String userId;
        if (principal instanceof SsafyUserDetails) {
            userId = ((SsafyUserDetails) principal).getUsername();
        } else if (principal instanceof String) {
            userId = (String) principal;
        } else {
            throw new SecurityException("인증 정보 형식이 올바르지 않습니다: " + principal.getClass().getName());
        }
        return userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
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
