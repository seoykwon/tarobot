package com.ssafy.api.service;

import com.ssafy.api.request.PostRegisterReq;
import com.ssafy.api.response.PostRes;
import com.ssafy.common.auth.SsafyUserDetails;
import com.ssafy.db.entity.Post;
import com.ssafy.db.entity.User;
import com.ssafy.db.repository.PostRepository;
import com.ssafy.db.repository.PostRepositorySupport;
import com.ssafy.db.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;


import java.util.List;
import java.util.stream.Collectors;

/**
 * 게시글 관련 비즈니스 로직 처리를 위한 서비스 구현.
 */
@Service("postService")
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;
    private final PostRepositorySupport postRepositorySupport;
    private final UserRepository userRepository;

    /**
     * 게시글 생성
     */
    @Override
    @Transactional
    public Post createPost(PostRegisterReq request) {
        User author = userRepository.findByUserId(request.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("작성자를 찾을 수 없습니다."));

        Post post = new Post();
        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        post.setImageUrl(request.getImageUrl());
        post.setAuthor(author);
        post.setActive(true); // 기본값: 활성화
        return postRepository.save(post);
    }

    /**
     * 모든 게시글 조회 (활성화된 게시글만, 페이지네이션 지원)
     */
    @Override
    public List<PostRes> getAllPosts(int page, int size) {
        return postRepository.findAllByIsActiveTrue(PageRequest.of(page, size)).stream()
                .map(PostRes::of)
                .collect(Collectors.toList());
    }

    /**
     * 게시글 상세 조회 (활성화 여부 체크)
     */
    @Override
    public PostRes getPostById(Long postId) {
        Post post = postRepository.findById(postId)
                .filter(Post::isActive)
                .orElseThrow(() -> new IllegalArgumentException("ID가 " + postId + "인 게시글을 찾을 수 없습니다."));
        return PostRes.of(post);
    }

    /**
     * 제목으로 검색 (활성화된 게시글만)
     */
    @Override
    public List<PostRes> getPostsByTitle(String title) {
        return postRepository.findByTitleContaining(title).stream()
                .filter(Post::isActive)
                .map(PostRes::of)
                .collect(Collectors.toList());
    }

    /**
     * 작성자로 검색 (활성화된 게시글만)
     */
    @Override
    public List<PostRes> getPostsByAuthor(String userId) {
        User author = userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("작성자를 찾을 수 없습니다."));
        return postRepository.findAllByAuthor(author).stream()
                .filter(Post::isActive)
                .map(PostRes::of)
                .collect(Collectors.toList());
    }

    /**
     * 최근 생성일 기준 게시글 조회
     */
    public List<PostRes> getPostsOrderByCreatedAtDesc() {
        return postRepository.findAllByOrderByCreatedAtDesc().stream()
                .filter(Post::isActive)
                .map(PostRes::of)
                .collect(Collectors.toList());
    }

    /**
     * 조회수 기준 정렬
     */
    @Override
    public List<PostRes> getPostsByMostViewed() {
        return postRepository.findAllByOrderByViewCountDesc().stream()
                .filter(Post::isActive)
                .map(PostRes::of)
                .collect(Collectors.toList());
    }

    /**
     * 좋아요 기준 정렬
     */
    @Override
    public List<PostRes> getPostsByMostLiked() {
        return postRepository.findAllByOrderByLikeCountDesc().stream()
                .filter(Post::isActive)
                .map(PostRes::of)
                .collect(Collectors.toList());
    }

    /**
     * 댓글 수 기준 정렬
     */
    @Override
    public List<PostRes> getPostsByMostCommented() {
        return postRepository.findAllByOrderByCommentCountDesc().stream()
                .filter(Post::isActive)
                .map(PostRes::of)
                .collect(Collectors.toList());
    }

    /**
     * 제목 및 이미지 수정
     */
    @Override
    @Transactional
    public Post updatePost(Long postId, String title, String image) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));

        if (title != null && !title.isEmpty()) {
            post.setTitle(title);
        }

        if (image != null && !image.isEmpty()) {
            post.setImageUrl(image);
        }

        return postRepository.save(post);
    }

    /**
     * 공통 카운트 증가 메서드 정의 (조회수, 좋아요, 댓글 수 증가 처리)
     */
    public enum CountType {
        VIEW, LIKE, COMMENT
    }

    private void increaseCount(Long postId, CountType type) {
        postRepository.findById(postId).ifPresent(post -> {
            switch (type) {
                case VIEW:
                    post.setViewCount(post.getViewCount() + 1);
                    break;
                case LIKE:
                    post.setLikeCount(post.getLikeCount() + 1);
                    break;
                case COMMENT:
                    post.setCommentCount(post.getCommentCount() + 1);
                    break;
            }
            postRepository.save(post);
        });
    }

    @Override
    @Transactional
    public void increaseViewCount(Long postId) {
        increaseCount(postId, CountType.VIEW);
    }

    @Override
    @Transactional
    public void increaseLikeCount(Long postId) {
        increaseCount(postId, CountType.LIKE);
    }

    @Override
    @Transactional
    public void increaseCommentCount(Long postId) {
        increaseCount(postId, CountType.COMMENT);
    }

    /**
     * 일반 사용자: 게시글 비활성화 처리
     * SecurityContextHolder에서 인증정보를 가져와 게시글 작성자와 비교 후 active 상태를 false로 변경.
     */
    @Override
    @Transactional
    public void deactivatePost(Long postId, User currentUser) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));

        // 현재 인증된 사용자 정보 가져오기
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) {
            throw new SecurityException("인증된 사용자 정보가 없습니다.");
        }
        Object principal = auth.getPrincipal();
        String currentUserId;
        if (principal instanceof SsafyUserDetails) {
            currentUserId = ((SsafyUserDetails) principal).getUsername();
        } else if (principal instanceof String) {
            currentUserId = (String) principal;
        } else {
            throw new SecurityException("인증된 사용자 정보 형식이 올바르지 않습니다.");
        }

        // 게시글 작성자와 인증된 사용자 비교 (관리자 예외 처리 포함)
        if (!post.getAuthor().getUserId().equals(currentUserId) && !currentUser.isAdmin()) {
            throw new SecurityException("비활성화 권한이 없습니다.");
        }

        // 비활성화 처리
        post.setActive(false);
        postRepository.save(post);
    }

    /**
     * 관리자: 실제 삭제 처리 (비활성화된 게시글만 삭제 가능)
     */
    @Override
    @Transactional
    public void deletePostPermanently(Long postId, User currentUser) {
        if (!currentUser.isAdmin()) { // 관리자 권한 확인
            throw new SecurityException("관리자 권한이 필요합니다.");
        }

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));

        if (!post.isActive()) { // 이미 비활성화된 경우에만 삭제 허용
            postRepository.delete(post);
        } else {
            throw new IllegalStateException("비활성화되지 않은 게시글은 삭제할 수 없습니다.");
        }
    }

    /**
     * 제목과 작성자로 게시글 검색
     */
    public List<PostRes> getPostsByTitleAndAuthor(String title, String userId) {
        return postRepositorySupport.findPostsByTitleAndAuthor(title, userId).stream()
                .map(PostRes::of)
                .collect(Collectors.toList());
    }

    /**
     * 인기 게시글 검색 - 댓글 수와 좋아요 수가 일정 이상인 게시글 조회
     */
    public List<PostRes> getPopularPosts(int minCommentCount, int minLikeCount) {
        return postRepositorySupport.findPopularPosts(minCommentCount, minLikeCount).stream()
                .map(PostRes::of)
                .collect(Collectors.toList());
    }
}
