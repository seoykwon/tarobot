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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolderStrategy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

import static com.ssafy.db.entity.QPost.post;

/**
 * 게시글 관련 비즈니스 로직 처리를 위한 서비스 구현.
 */
@Service("postService")
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;
    private final PostRepositorySupport postRepositorySupport;
    private final UserRepository userRepository;
    private final SecurityContextHolderStrategy securityContextHolderStrategy;

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

    // currentUserId를 추출하는 메서드
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
            throw new SecurityException("인증된 사용자 정보 형식이 올바르지 않습니다.");
        }
    }

    /**
     * 게시글 수정
     */
    @Override
    @Transactional
    public Post updatePost(Long postId, String title, String image, User currentUser) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));

        String currentUserId = extractCurrentUserId();

        if (!post.getAuthor().getUserId().equals(currentUserId) && !currentUser.isAdmin()) {
            throw new SecurityException("수정 권한이 없습니다.");
        }

        if (title != null && !title.isEmpty()) {
            post.setTitle(title);
        }
        if (image != null && !image.isEmpty()) {
            post.setImageUrl(image);
        }
        return postRepository.save(post);
    }

    /**
     * 일반 사용자: 게시글 비활성화 처리
     * - SecurityContext에서 JWT 인증 정보를 가져와 요청자와 게시글 작성자(또는 관리자)를 비교한 후,
     *   게시글의 활성 상태(active)를 false로 변경합니다.
     */
    @Override
    @Transactional
    public void deactivatePost(Long postId, User currentUser) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));

        String currentUserId = extractCurrentUserId();

        if (!post.getAuthor().getUserId().equals(currentUserId) && !currentUser.isAdmin()) {
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
    public void deletePostPermanently(Long postId, User currentUser) {
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
    public List<PostRes> getAllPosts(int page, int size, String sort) {
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
        Page<Post> postPage = postRepository.findAllByIsActiveTrue(pageable);
        return postPage.getContent().stream()
                .map(PostRes::of)
                .collect(Collectors.toList());
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

    /**
     * 게시글 제목 기반 검색
     * - 제목에 해당 키워드가 포함된 활성 게시글을 기본페이지(0, 10, 최신순)로 조회합니다.
     */
    @Override
    public List<PostRes> getPostsByTitle(String title) {
        Pageable pageable = PageRequest.of(0, 10, Sort.by("createdAt").descending());
        Page<Post> postPage = postRepository.findByTitleContaining(title, pageable);
        return postPage.getContent().stream()
                .filter(Post::isActive)
                .map(PostRes::of)
                .collect(Collectors.toList());
    }

    /**
     * 게시글 내용 기반 검색
     * - 게시글 내용에 해당 키워드가 포함된 활성 게시글을 기본페이지(0, 10, 최신순)로 조회합니다.
     */
    public List<PostRes> getPostsByContent(String content) {
        Pageable pageable = PageRequest.of(0, 10, Sort.by("createdAt").descending());
        Page<Post> postPage = postRepository.findByContentContaining(content, pageable);
        return postPage.getContent().stream()
                .filter(Post::isActive)
                .map(PostRes::of)
                .collect(Collectors.toList());
    }

//    /**
//     * 작성자 기반 검색
//     * - 주어진 작성자 ID에 해당하는 활성 게시글을 기본페이지(0, 10, 최신순)로 조회합니다.
//     */
//    @Override
//    public List<PostRes> getPostsByAuthor(String userId) {
//        User author = userRepository.findByUserId(userId)
//                .orElseThrow(() -> new IllegalArgumentException("작성자를 찾을 수 없습니다."));
//        Pageable pageable = PageRequest.of(0, 10, Sort.by("createdAt").descending());
//        Page<Post> postPage = postRepository.findAllByAuthor(author, pageable);
//        return postPage.getContent().stream()
//                .filter(Post::isActive)
//                .map(PostRes::of)
//                .collect(Collectors.toList());
//    }

    // 작성자+제목 기반 검색
    /*
    @Override
    public List<PostRes> getPostsByTitleAndAuthor(String title, String userId) {
        return postRepositorySupport.findPostsByTitleAndAuthor(title, userId)
                .stream()
                .map(PostRes::of)
                .collect(Collectors.toList());
    }
    */

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

    /**
     * 좋아요 수 증가 처리
     */
    @Override
    @Transactional
    public void increaseLikeCount(Long postId) {
        increaseCount(postId, CountType.LIKE);
    }

    /**
     * 댓글 수 증가 처리
     */
    @Override
    @Transactional
    public void increaseCommentCount(Long postId) {
        increaseCount(postId, CountType.COMMENT);
    }
}
