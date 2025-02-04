package com.ssafy.db.repository;

import com.ssafy.db.entity.Post;
import com.ssafy.db.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    // 제목으로 게시글 검색 (활성 게시글만 포함)
    Page<Post> findByTitleContaining(String title, Pageable pageable);

    // 최근 생성일 기준으로 모든 게시글 조회 (내림차순 정렬)
    Page<Post> findAllByOrderByCreatedAtDesc(Pageable pageable);

    // 조회수 기준으로 모든 게시글 조회 (내림차순 정렬)
    Page<Post> findAllByOrderByViewCountDesc(Pageable pageable);

    // 특정 작성자(User) 기준으로 게시글 조회 (전체)
    Page<Post> findAllByAuthor(User author, Pageable pageable);

    // 댓글 수 기준으로 게시글 조회 (내림차순 정렬)
    Page<Post> findAllByOrderByCommentCountDesc(Pageable pageable);

    // 좋아요 수 기준으로 게시글 조회 (내림차순 정렬)
    Page<Post> findAllByOrderByLikeCountDesc(Pageable pageable);

    // 활성화된 게시글만 조회
    Page<Post> findAllByIsActiveTrue(Pageable pageable);
}
