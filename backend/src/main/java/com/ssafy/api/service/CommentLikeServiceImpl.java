package com.ssafy.api.service;

import com.ssafy.common.auth.SsafyUserDetails;
import com.ssafy.common.util.SecurityUtil;
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
    private final SecurityUtil securityUtil;

    @Override
    @Transactional
    public void likeComment(Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("댓글을 찾을 수 없습니다."));
        User currentUser = securityUtil.getCurrentUser();

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
        User currentUser = securityUtil.getCurrentUser();

        Optional<CommentLike> likeOpt = commentLikeRepository.findByCommentAndUser(comment, currentUser);
        likeOpt.ifPresent(commentLikeRepository::delete);
    }
}
