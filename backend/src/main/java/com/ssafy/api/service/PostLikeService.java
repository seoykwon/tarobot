package com.ssafy.api.service;

public interface PostLikeService {
    void likePost(Long postId);
    void unlikePost(Long postId);
    boolean isPostLiked(Long postId);

}
