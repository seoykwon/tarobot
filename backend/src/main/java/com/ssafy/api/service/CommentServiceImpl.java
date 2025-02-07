package com.ssafy.api.service;

import com.ssafy.api.request.CommentRegisterReq;
import com.ssafy.api.request.CommentUpdateReq;
import com.ssafy.api.service.CommentService;
import com.ssafy.common.auth.SsafyUserDetails;
import com.ssafy.db.entity.Comment;
import com.ssafy.db.entity.Post;
import com.ssafy.db.entity.User;
import com.ssafy.db.repository.CommentRepository;
import com.ssafy.db.repository.PostRepository;
import com.ssafy.db.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolderStrategy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service("commentService")
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final SecurityContextHolderStrategy securityContextHolderStrategy;

    // currentUserId를 추출하는 메서드 (Post와 동일한 방식)
    private String extractCurrentUserId() {
        Authentication auth = securityContextHolderStrategy.getContext().getAuthentication();
        if (auth == null) {
            throw new SecurityException("인증된 사용자 정보가 없습니다.");
        }
        Object principal = auth.getPrincipal();
        if (principal instanceof SsafyUserDetails) {
            return ((SsafyUserDetails) principal).getUsername();
        } else if (principal instanceof String) {
            return (String) principal;
        } else {
            throw new SecurityException("인증된 사용자 정보 형식이 올바르지 않습니다: " + principal.getClass());
        }
    }

    @Override
    @Transactional
    public Comment createComment(CommentRegisterReq req) {
        Post post = postRepository.findById(req.getPostId())
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));
        String currentUserId = extractCurrentUserId();
        // Post와 동일하게, 사용자 ID 기반으로 실제 User 엔티티 조회
        User user = userRepository.findByUserId(currentUserId)
                .orElseThrow(() -> new IllegalArgumentException("작성자를 찾을 수 없습니다."));

        Comment comment = new Comment();
        comment.setContent(req.getContent());
        comment.setPost(post);
        comment.setAuthor(user);  // User 객체를 설정
        comment.setActive(true);  // 기본 활성화

        Comment savedComment = commentRepository.save(comment);

        // 댓글 등록 후 게시글의 댓글 수 증가 처리
        post.setCommentCount(post.getCommentCount() + 1);
        postRepository.save(post);

        return savedComment;
    }

    @Override
    public List<Comment> getCommentsByPost(Long postId) {
        // 활성 댓글만 조회하는 Repository 메서드 사용
        return commentRepository.findByPost_IdAndIsActiveTrueOrderByCreatedAtAsc(postId);
    }

    @Override
    @Transactional
    public Comment updateComment(Long commentId, CommentUpdateReq req) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("댓글을 찾을 수 없습니다."));
        String currentUserId = extractCurrentUserId();
        User user = userRepository.findByUserId(currentUserId)
                .orElseThrow(() -> new IllegalArgumentException("작성자를 찾을 수 없습니다."));

        // 작성자와 현재 사용자의 userId 비교
        if (!comment.getAuthor().getUserId().equals(user.getUserId())) {
            throw new SecurityException("댓글 수정 권한이 없습니다.");
        }

        comment.setContent(req.getContent());
        return commentRepository.save(comment);
    }

    @Override
    @Transactional
    public void deleteComment(Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("댓글을 찾을 수 없습니다."));
        String currentUserId = extractCurrentUserId();
        User user = userRepository.findByUserId(currentUserId)
                .orElseThrow(() -> new IllegalArgumentException("작성자를 찾을 수 없습니다."));

        if (!comment.getAuthor().getUserId().equals(user.getUserId())) {
            throw new SecurityException("댓글 삭제 권한이 없습니다.");
        }

        // 비활성화 처리 (User 엔티티의 setter는 setActive() 생성)
        comment.setActive(false);
        commentRepository.save(comment);

        Post post = comment.getPost();
        post.setCommentCount(Math.max(post.getCommentCount() - 1, 0));
        postRepository.save(post);
    }

    @Override
    @Transactional
    public void deleteCommentPermanently(Long commentId) {
        String currentUserId = extractCurrentUserId();
        User user = userRepository.findByUserId(currentUserId)
                .orElseThrow(() -> new IllegalArgumentException("작성자를 찾을 수 없습니다."));
        // 관리자 권한 검사 (User에 isAdmin 플래그 필요)
        if (!user.isAdmin()) {
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
