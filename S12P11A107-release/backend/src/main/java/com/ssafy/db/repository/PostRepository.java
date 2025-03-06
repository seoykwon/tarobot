package com.ssafy.db.repository;

import com.ssafy.db.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    // 제목으로 게시글 검색 (활성 게시글만 포함)
    Page<Post> findByTitleContaining(String title, Pageable pageable);

    // 내용으로 게시글 검색 (활성 게시글만 포함)
    Page<Post> findByContentContaining(String content, Pageable pageable);

    // 제목 또는 내용으로 게시글 검색 (두 검색 조건을 동시에 사용)
    Page<Post> findByTitleContainingOrContentContaining(String title, String content, Pageable pageable);

    // 활성화된 게시글만 조회
    Page<Post> findAllByIsActiveTrue(Pageable pageable);


}
