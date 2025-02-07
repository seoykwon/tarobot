package com.ssafy.api.service;

import com.ssafy.common.auth.SsafyUserDetails;
import com.ssafy.common.util.SecurityUtil;
import com.ssafy.db.entity.Post;
import com.ssafy.db.entity.PostLike;
import com.ssafy.db.entity.User;
import com.ssafy.db.repository.PostLikeRepository;
import com.ssafy.db.repository.PostRepository;
import com.ssafy.db.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolderStrategy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PostLikeServiceImpl implements PostLikeService {

    private final PostRepository postRepository;
    private final PostLikeRepository postLikeRepository;
    private final SecurityUtil securityUtil;

    @Override
    @Transactional
    public void likePost(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));
        User currentUser = securityUtil.getCurrentUser();

        // 이미 좋아요 한 내역이 있으면(중복 좋아요) 아무 작업도 하지 않도록 함
        Optional<PostLike> likeOpt = postLikeRepository.findByPostAndUser(post, currentUser);
        if (likeOpt.isPresent()){
            return;
        }

        PostLike postLike = new PostLike();
        postLike.setPost(post);
        postLike.setUser(currentUser);
        postLikeRepository.save(postLike);

        post.setLikeCount(post.getLikeCount() + 1);
        postRepository.save(post);
    }

    @Override
    @Transactional
    public void unlikePost(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));
        User currentUser = securityUtil.getCurrentUser();

        Optional<PostLike> likeOpt = postLikeRepository.findByPostAndUser(post, currentUser);
        if (likeOpt.isPresent()) {
            postLikeRepository.delete(likeOpt.get());
            // 좋아요 수 감소
            post.setLikeCount(post.getLikeCount() - 1);
            postRepository.save(post);
        }
    }
}
