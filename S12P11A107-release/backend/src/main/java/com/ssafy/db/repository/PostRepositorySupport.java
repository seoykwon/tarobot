package com.ssafy.db.repository;


import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.db.entity.Post;
import com.ssafy.db.entity.QPost;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 복잡한 동적 쿼리를 위한 Repository Support 클래스 정의.
 */
@Repository
@RequiredArgsConstructor
public class PostRepositorySupport {

    private final JPAQueryFactory jpaQueryFactory;

    QPost qPost = QPost.post;

    // 제목과 작성자를 기반으로 게시글 검색
    public List<Post> findPostsByTitleAndAuthor(String title, String userId) {
        return jpaQueryFactory.selectFrom(qPost)
                .where(
                        qPost.title.contains(title),
                        qPost.author.userId.eq(userId),
                        qPost.isActive.isTrue() // 활성화된 게시글만
                )
                .orderBy(qPost.createdAt.desc())
                .fetch();
    }

    // 인기 게시글 검색 (댓글 수와 좋아요 수가 일정 이상인 게시글)
    public List<Post> findPopularPosts(int minCommentCount, int minLikeCount) {
        return jpaQueryFactory.selectFrom(qPost)
                .where(
                        qPost.commentCount.goe(minCommentCount),
                        qPost.likeCount.goe(minLikeCount),
                        qPost.isActive.isTrue() // 활성화된 게시글만
                )
                .orderBy(qPost.likeCount.desc(), qPost.commentCount.desc())
                .fetch();
    }
}
