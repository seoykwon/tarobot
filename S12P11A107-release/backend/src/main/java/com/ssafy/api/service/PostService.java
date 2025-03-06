package com.ssafy.api.service;

import com.ssafy.api.request.PostRegisterReq;
import com.ssafy.api.request.PostUpdateReq;
import com.ssafy.api.response.PostRes;
import com.ssafy.db.entity.Post;

import java.util.List;

/**
 * 게시글 관련 비즈니스 로직 처리를 위한 서비스 인터페이스 정의.
 */
public interface PostService {
    // 게시글 생성/수정/삭제
    Post createPost(PostRegisterReq req);
    Post updatePost(Long postId, PostUpdateReq req);
    void deactivatePost(Long postId);
    void deletePostPermanently(Long postId);

    // 조회/정렬/페이지네이션
    PostRes getPostById(Long postId);
    Post getPostEntityById(Long postId);

    // 조회수/좋아요/댓글 증가
    void increaseViewCount(Long postId);

    // 검색 기능 - 게시글 제목 및 내용 검색
    List<PostRes> searchPosts(int page, int size, String sort, String title, String content);
}
