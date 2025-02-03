package com.ssafy.db.repository;

import com.ssafy.db.entity.Post;
import com.ssafy.db.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 게시글 관련 DB 쿼리 생성을 위한 인터페이스 정의.
 */
@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    // 제목으로 게시글 검색 (제목에 특정 문자열 포함)
    List<Post> findByTitleContaining(String title);

    // 최근 생성일 기준으로 모든 게시글 조회 (내림차순 정렬)
    List<Post> findAllByOrderByCreatedAtDesc();

    // 조회수 기준으로 모든 게시글 조회 (내림차순 정렬)
    List<Post> findAllByOrderByViewCountDesc();

    // 특정 작성자(User) 기반으로 게시글 조회
    List<Post> findAllByAuthor(User author);

    // 댓글 수 기준으로 게시글 조회 (내림차순 정렬)
    List<Post> findAllByOrderByCommentCountDesc();

    // 좋아요 수 기준으로 게시글 조회 (내림차순 정렬)
    List<Post> findAllByOrderByLikeCountDesc();

    // 활성화된 게시글만 조회
    List<Post> findAllByIsActiveTrue();

    // 페이지네이션된 활성 게시글 조회
    Page<Post> findAllByIsActiveTrue(Pageable pageable);
}
