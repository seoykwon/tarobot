package com.ssafy.api.service;

import com.ssafy.api.request.PostRegisterReq;
import com.ssafy.api.response.PostRes;
import com.ssafy.db.entity.Post;
import com.ssafy.db.entity.User;
import com.ssafy.db.repository.PostRepository;
import com.ssafy.db.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * 게시글 관련 비즈니스 로직 처리를 위한 서비스 구현.
 */
@Service("postService")
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;

    // **1. 게시글 생성**
    @Override
    @Transactional
    public Post createPost(PostRegisterReq request) {
        User author = userRepository.findByUserId(request.getAuthorId())
                .orElseThrow(() -> new IllegalArgumentException("작성자를 찾을 수 없습니다."));

        Post post = new Post();
        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        post.setImageUrl(request.getImageUrl());
        post.setAuthor(author);
        post.setActive(true); // 기본값: 활성화
        return postRepository.save(post);
    }

    // **2. 모든 게시글 조회 (활성화된 게시글만)**
    @Override
    public List<PostRes> getAllPosts() {
        return postRepository.findAllByIsActiveTrue().stream()
                .map(PostRes::of)
                .collect(Collectors.toList());
    }

    // **3. 게시글 상세 조회**
    @Override
    public PostRes getPostById(Long postId) {
        Post post = postRepository.findById(postId)
                .filter(Post::isActive)
                .orElseThrow(() -> new IllegalArgumentException("ID가 " + postId + "인 게시글을 찾을 수 없습니다."));
        return PostRes.of(post);
    }

    // **4. 제목으로 검색**
    @Override
    public List<PostRes> getPostsByTitle(String title) {
        return postRepository.findByTitleContaining(title).stream()
                .map(PostRes::of)
                .collect(Collectors.toList());
    }

    // **5. 작성자로 검색**
    @Override
    public List<PostRes> getPostsByAuthor(String authorId) {
        User author = userRepository.findByUserId(authorId)
                .orElseThrow(() -> new IllegalArgumentException("작성자를 찾을 수 없습니다."));
        return postRepository.findAllByAuthor(author).stream()
                .map(PostRes::of)
                .collect(Collectors.toList());
    }

    // **6. 조회수 기준 정렬**
    @Override
    public List<PostRes> getPostsByMostViewed() {
        return postRepository.findAllByOrderByViewCountDesc().stream()
                .map(PostRes::of)
                .collect(Collectors.toList());
    }

    // **7. 좋아요 기준 정렬**
    @Override
    public List<PostRes> getPostsByMostLiked() {
        return postRepository.findAllByOrderByLikeCountDesc().stream()
                .map(PostRes::of)
                .collect(Collectors.toList());
    }

    // **8. 댓글 수 기준 정렬**
    @Override
    public List<PostRes> getPostsByMostCommented() {
        return postRepository.findAllByOrderByCommentCountDesc().stream()
                .map(PostRes::of)
                .collect(Collectors.toList());
    }

    // **9. 제목 및 이미지 수정**
    @Override
    @Transactional
    public Post updatePost(Long postId, String title, String image) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));
        post.setTitle(title);
        post.setImageUrl(image);
        return postRepository.save(post);
    }

    // Enum 정의 (조회수, 좋아요, 댓글 수 증가를 위한 타입)
    public enum CountType {
        VIEW, LIKE, COMMENT
    }

    // **10~12. 공통 카운트 증가 메서드**
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

    // **13. 일반 사용자: 게시글 비활성화 처리**
    @Override
    @Transactional
    public void deactivatePost(Long postId, User currentUser) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));

        if (!post.getAuthor().equals(currentUser) && !currentUser.isAdmin()) {
            throw new SecurityException("비활성화 권한이 없습니다.");
        }

        // 비활성화 처리
        post.setActive(false);
        postRepository.save(post);
    }

    // **14. 관리자: 실제 삭제 처리**
    @Override
    @Transactional
    public void deletePostPermanently(Long postId, User currentUser) {
        if (!currentUser.isAdmin()) {
            throw new SecurityException("관리자 권한이 필요합니다.");
        }

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));

        if (!post.isActive()) {  // 이미 비활성화된 경우에만 삭제 허용
            postRepository.delete(post);
        } else {
            throw new IllegalStateException("비활성화되지 않은 게시글은 삭제할 수 없습니다.");
        }
    }
}
