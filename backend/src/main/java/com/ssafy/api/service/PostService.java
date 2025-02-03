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
    Post createPost(PostRegisterReq request); // 게시글 생성
    List<PostRes> getAllPosts(int page, int size); // 페이지 번호와 페이지 크기를 인자로 받아 활성 게시글 목록 조회
    PostRes getPostById(Long postId); // 게시글 상세 조회
    List<PostRes> getPostsByTitle(String title); // 제목으로 검색
    List<PostRes> getPostsByAuthor(String userId); // 작성자(회원) ID로 검색: 매개변수명을 userId로 변경
    List<PostRes> getPostsByMostViewed(); // 조회수 기준 조회
    List<PostRes> getPostsByMostLiked(); // 좋아요 기준 조회
    List<PostRes> getPostsByMostCommented(); // 댓글 기준 조회
    Post updatePost(Long postId, String title, String image); // 제목 및 이미지 수정
    void increaseViewCount(Long postId); // 조회수 증가
    void increaseLikeCount(Long postId); // 좋아요 증가
    void increaseCommentCount(Long postId); // 댓글 수 증가
    void deactivatePost(Long postId, User currentUser); // 게시글 비활성화 (일반 사용자 및 관리자)
    void deletePostPermanently(Long postId, User currentUser); // 게시글 삭제 (관리자 전용)
}
