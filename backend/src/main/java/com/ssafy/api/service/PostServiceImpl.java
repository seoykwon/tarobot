package com.ssafy.api.service;

import com.ssafy.api.request.PostRegisterReq;
import com.ssafy.api.request.PostUpdateReq;
import com.ssafy.api.response.PostRes;
import com.ssafy.common.util.SecurityUtil;
import com.ssafy.db.entity.Post;
import com.ssafy.db.entity.User;
import com.ssafy.db.repository.PostRepository;
import com.ssafy.db.repository.PostRepositorySupport;
import com.ssafy.db.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    private final SecurityUtil securityUtil;

    /**
     * 게시글 생성
     */
    @Override
    @Transactional
    public Post createPost(PostRegisterReq req) {
        User author = securityUtil.getCurrentUser();

        Post post = new Post();
        post.setTitle(req.getTitle());
        post.setContent(req.getContent());
        post.setImageUrl(req.getImageUrl());
        post.setAuthor(author);
        post.setActive(true); // 기본값: 활성화
        return postRepository.save(post);
    }

    /**
     * 게시글 수정
     */
    @Override
    @Transactional
    public Post updatePost(Long postId, PostUpdateReq req) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));
        User currentUser = securityUtil.getCurrentUser();
        if (!post.getAuthor().getUserId().equals(currentUser.getUserId()) && !currentUser.isAdmin()) {
            throw new SecurityException("수정 권한이 없습니다.");
        }

        if (req.getTitle() != null && !req.getTitle().isEmpty()) {
            post.setTitle(req.getTitle());
        }
        if (req.getContent() != null && !req.getContent().isEmpty()) {
            post.setContent(req.getContent());
        }
        if (req.getImageUrl() != null && !req.getImageUrl().isEmpty()) {
            post.setImageUrl(req.getImageUrl());
        }
        return postRepository.save(post);
    }

    /**
     * 일반 사용자: 게시글 비활성화 처리
     */
    @Override
    @Transactional
    public void deactivatePost(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));
        User currentUser = securityUtil.getCurrentUser();
        if (!post.getAuthor().getUserId().equals(currentUser.getUserId()) && !currentUser.isAdmin()) {
            throw new SecurityException("비활성화 권한이 없습니다.");
        }
        post.setActive(false);
        postRepository.save(post);
    }

    /**
     * 관리자: 실제 삭제 처리 (비활성화된 게시글만 삭제 가능)
     */
    @Override
    @Transactional
    public void deletePostPermanently(Long postId) {
        User currentUser = securityUtil.getCurrentUser();
        if (!currentUser.isAdmin()) {
            throw new SecurityException("관리자 권한이 필요합니다.");
        }
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));
        if (!post.isActive()) {
            postRepository.delete(post);
        } else {
            throw new IllegalStateException("비활성화되지 않은 게시글은 삭제할 수 없습니다.");
        }
    }

    //============================== 조회/정렬/페이지네이션 및 검색 ==============================

    /**
     * 게시글 목록 조회
     * - 활성 게시글을 페이지네이션 및 정렬 조건(sort)에 따라 조회합니다.
     * - 기본 정렬은 최신순(createdAt 내림차순)이며,
     *   클라이언트는 sort 파라미터로 "like", "view", "comment" 등의 값을 전달할 수 있습니다.
     */
    @Override
    public List<PostRes> searchPosts(int page, int size, String sort, String title, String content) {
        // 페이징/정렬 처리 (기본 정렬: 최신순)
        Pageable pageable;
        if (sort == null || sort.equalsIgnoreCase("new")) {
            pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        } else if (sort.equalsIgnoreCase("like")) {
            pageable = PageRequest.of(page, size, Sort.by("likeCount").descending());
        } else if (sort.equalsIgnoreCase("view")) {
            pageable = PageRequest.of(page, size, Sort.by("viewCount").descending());
        } else if (sort.equalsIgnoreCase("comment")) {
            pageable = PageRequest.of(page, size, Sort.by("commentCount").descending());
        } else {
            pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        }

        Page<Post> postPage;
        boolean hasTitle = title != null && !title.trim().isEmpty();
        boolean hasContent = content != null && !content.trim().isEmpty();

        if (hasTitle && hasContent) {
            // 제목 또는 내용 중 하나라도 키워드에 해당하는 게시글 검색
            postPage = postRepository.findByTitleContainingOrContentContaining(title, content, pageable);
        } else if (hasTitle) {
            postPage = postRepository.findByTitleContaining(title, pageable);
        } else if (hasContent) {
            postPage = postRepository.findByContentContaining(content, pageable);
        } else {
            // 검색어 미입력 시 활성 게시글 전체 조회
            postPage = postRepository.findAllByIsActiveTrue(pageable);
        }

        return postPage.getContent().stream()
                .filter(Post::isActive)
                .map(PostRes::of)
                .collect(Collectors.toList());
    }

    /**
     * 게시글 엔티티 반환
     */
    @Override
    public Post getPostEntityById(Long postId) {
        return postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));
    }

    /**
     * 게시글 상세 조회 (활성화된 게시글만)
     */
    @Override
    public PostRes getPostById(Long postId) {
        Post post = postRepository.findById(postId)
                .filter(Post::isActive)
                .orElseThrow(() -> new IllegalArgumentException("ID가 " + postId + "인 게시글을 찾을 수 없습니다."));
        return PostRes.of(post);
    }

    //============================== 조회수/좋아요/댓글 증가 ==============================

    /**
     * 공통 카운트 증가 처리 (조회수, 좋아요, 댓글)
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

    /**
     * 조회수 증가 처리
     */
    @Override
    @Transactional
    public void increaseViewCount(Long postId) {
        increaseCount(postId, CountType.VIEW);
    }
}
