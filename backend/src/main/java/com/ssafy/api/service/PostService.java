package com.ssafy.api.service;

import com.ssafy.api.request.PostRegisterReq;
import com.ssafy.api.response.PostRes;
import com.ssafy.db.entity.Post;
import com.ssafy.db.entity.User;
import java.util.List;

/**
 * 게시글 관련 비즈니스 로직 처리를 위한 서비스 인터페이스 정의.
 */
public interface PostService {
    // 게시글 생성/수정/삭제
    Post createPost(PostRegisterReq request);
    Post updatePost(Long postId, String title, String image, User currentUser);
    void deactivatePost(Long postId, User currentUser);
    void deletePostPermanently(Long postId, User currentUser);

    // 조회/정렬/페이지네이션
    List<PostRes> getAllPosts(int page, int size, String sort);
    PostRes getPostById(Long postId);

    // 조회수/좋아요/댓글 증가
    void increaseViewCount(Long postId);
    void increaseLikeCount(Long postId);
    void increaseCommentCount(Long postId);

    // 검색 기능 - 게시글 제목 및 내용 검색
    List<PostRes> getPostsByTitle(String title);
    List<PostRes> getPostsByContent(String content);

    /*
    List<PostRes> getPostsByAuthor(String userId);
    List<PostRes> getPostsByTitleAndAuthor(String title, String userId);
    List<PostRes> getPopularPosts(int minCommentCount, int minLikeCount);
    */
}
