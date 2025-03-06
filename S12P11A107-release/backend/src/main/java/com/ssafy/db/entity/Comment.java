package com.ssafy.db.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
public class Comment extends BaseEntity {

    @Column(nullable = false, length = 1024)
    private String content; // 댓글 내용

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private Post post; // 댓글이 달린 게시글

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User author; // 댓글 작성자

    @OneToMany(mappedBy = "comment", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CommentLike> commentLikes = new ArrayList<>();   // 댓글 좋아요 이력 관리

    @Column(nullable = false)
    private boolean isActive = true; // 활성화 여부

    public int getLikeCount() {
        return commentLikes != null ? commentLikes.size() : 0; // 좋아요 수
    }
}
