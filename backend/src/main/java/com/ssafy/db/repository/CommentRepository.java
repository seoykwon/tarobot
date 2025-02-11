package com.ssafy.db.repository;

import com.ssafy.db.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    // 특정 게시글(post)의 댓글을 생성 시간 오름차순으로 조회
    List<Comment> findByPost_IdAndIsActiveTrueOrderByCreatedAtAsc(Long postId);
}
