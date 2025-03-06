package com.ssafy.api.controller;

import com.ssafy.api.request.PostRegisterReq;
import com.ssafy.api.request.PostUpdateReq;
import com.ssafy.api.response.PostRes;
import com.ssafy.api.service.PostLikeService;
import com.ssafy.api.service.PostService;
import com.ssafy.db.entity.Post;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Post", description = "게시글 API")
@RestController
@RequestMapping("/api/v1/posts")
public class PostController {

    @Autowired
    private PostService postService;
    @Autowired
    private PostLikeService postLikeService;
    // ---------------------------------------
    // 게시글 생성
    // ---------------------------------------
    @PostMapping
    @Operation(summary = "게시글 생성", description = "게시글 제목, 내용, 이미지 URL, 작성자 ID를 입력받아 게시글을 생성합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<PostRes> createPost(
            @RequestBody @Valid @Parameter(description = "게시글 생성 정보", required = true) PostRegisterReq req) {
        Post createdPost = postService.createPost(req);
        return ResponseEntity.ok(PostRes.of(createdPost));
    }

    // ---------------------------------------
    // 게시글 목록 조회 및 검색
    // ---------------------------------------
    @GetMapping("/search")
    @Operation(summary = "게시글 조회 및 검색", description = "제목 및/또는 내용에 해당 키워드가 포함된 활성 게시글을 페이지네이션 및 정렬 조건에 따라 조회합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<List<PostRes>> searchPosts(
            @RequestParam(required = false) @Parameter(description = "검색 키워드 (제목)", required = false) String title,
            @RequestParam(required = false) @Parameter(description = "검색 키워드 (내용)", required = false) String content,
            @RequestParam(defaultValue = "0") @Parameter(description = "페이지 번호 (0부터 시작)", required = false) int page,
            @RequestParam(defaultValue = "10") @Parameter(description = "페이지 크기", required = false) int size,
            @RequestParam(required = false, defaultValue = "new") @Parameter(description = "정렬 기준 (new: 최신순, like: 좋아요순, view: 조회수순, comment: 댓글순)", required = false) String sort) {

        List<PostRes> posts = postService.searchPosts(page, size, sort, title, content);
        return ResponseEntity.ok(posts);
    }

    // ---------------------------------------
    // 게시글 상세 조회
    // ---------------------------------------
    @GetMapping("/{postId}")
    @Operation(summary = "게시글 상세 조회",
            description = "게시글 ID를 통해 특정 게시글의 상세 정보를 조회합니다. 조회 시 자동으로 조회수가 증가됩니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "404", description = "게시글을 찾을 수 없음"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<PostRes> getPostById(
            @PathVariable @Parameter(description = "게시글 ID", required = true) Long postId) {
        postService.increaseViewCount(postId);  // 상세 조회 시 조회수 증가
        PostRes postRes = postService.getPostById(postId);
        return ResponseEntity.ok(postRes);
    }

    // ---------------------------------------
    // 게시글 좋아요 증가
    // ---------------------------------------
    @PostMapping("/{postId}/like")
    @Operation(summary = "좋아요 증가", description = "게시글 ID를 통해 해당 게시글의 좋아요 수를 증가시킵니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "404", description = "게시글을 찾을 수 없음"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<Void> increaseLike(
            @PathVariable @Parameter(description = "게시글 ID", required = true) Long postId) {
        postLikeService.likePost(postId);
        return ResponseEntity.ok().build();
    }

    // ---------------------------------------
    // 게시글 좋아요 취소
    // ---------------------------------------
    @DeleteMapping("/{postId}/like")
    @Operation(summary = "게시글 좋아요 취소", description = "게시글 ID를 통해 현재 로그인한 사용자의 좋아요를 취소합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "404", description = "게시글을 찾을 수 없음"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<Void> unlikePost(
            @PathVariable @Parameter(description = "게시글 ID", required = true) Long postId) {
        postLikeService.unlikePost(postId);
        return ResponseEntity.ok().build();
    }

    // ---------------------------------------
    // 게시글 좋아요 상태 조회
    // ---------------------------------------
    @GetMapping("/{postId}/like")
    @Operation(summary = "게시글 좋아요 상태 조회",
            description = "현재 로그인한 사용자가 해당 게시글에 대해 좋아요를 눌렀는지 여부를 반환합니다. (true: 좋아요 있음, false: 좋아요 없음)")
    public ResponseEntity<Boolean> getLikeStatus(@PathVariable Long postId) {
        boolean isLiked = postLikeService.isPostLiked(postId);
        return ResponseEntity.ok(isLiked);
    }


    // ---------------------------------------
    // 게시글 수정 (제목 및 이미지)
    // ---------------------------------------
    @PutMapping("/{postId}")
    @Operation(summary = "게시글 수정",
            description = "게시글 ID를 통해 특정 게시글의 제목과 이미지를 수정합니다.\n" +
                    "수정 시 JWT 토큰에 포함된 인증 정보를 통해 작성자와 요청자 권한을 비교하여 수정 권한을 확인합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "404", description = "게시글을 찾을 수 없음"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<PostRes> updatePost(
            @PathVariable @Parameter(description = "게시글 ID", required = true) Long postId,
            @RequestBody @Valid @Parameter(description = "게시글 수정 정보", required = true) PostUpdateReq req) {
        Post updatedPost = postService.updatePost(postId, req);
        return ResponseEntity.ok(PostRes.of(updatedPost));
    }

    // ---------------------------------------
    // 게시글 수정용 데이터 조회
    // ---------------------------------------
    @GetMapping("/{postId}/edit")
    @Operation(summary = "게시글 수정용 데이터 조회",
            description = "게시글 ID를 통해 기존 게시글 데이터를 조회하여 수정 폼에 미리 원래 내용을 채워줍니다.")
    public ResponseEntity<PostUpdateReq> getPostForEdit(
            @PathVariable @Parameter(description = "게시글 ID", required = true) Long postId) {
        Post post = postService.getPostEntityById(postId);
        PostUpdateReq updateReq = new PostUpdateReq();
        updateReq.setTitle(post.getTitle());
        updateReq.setContent(post.getContent());
        updateReq.setImageUrl(post.getImageUrl());
        return ResponseEntity.ok(updateReq);
    }

    // ---------------------------------------
    // 게시글 삭제 (비활성화 처리)
    // ---------------------------------------
    @DeleteMapping("/{postId}")
    @Operation(summary = "게시글 삭제 (비활성화)", description = "일반 사용자는 게시글을 비활성화 처리합니다. 비활성화된 게시글은 일반 검색 결과에서 노출되지 않습니다.\n" +
            "삭제 시 JWT 토큰을 통해 요청자와 작성자(또는 관리자)를 확인합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "성공"),
            @ApiResponse(responseCode = "404", description = "게시글을 찾을 수 없음"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<Void> deactivatePost(
            @PathVariable @Parameter(description = "게시글 ID", required = true) Long postId) {
        postService.deactivatePost(postId);
        return ResponseEntity.noContent().build();
    }

    // ---------------------------------------
    // 게시글 삭제 (완전 삭제 - 관리자 전용)
    // ---------------------------------------
    @DeleteMapping("/admin/{postId}")
    @Operation(summary = "게시글 삭제 (완전 삭제)", description = "관리자 권한으로 게시글을 완전 삭제합니다. 삭제 전 게시글은 반드시 비활성화 상태여야 합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "성공"),
            @ApiResponse(responseCode = "404", description = "게시글을 찾을 수 없음"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<Void> deletePostPermanently(
            @PathVariable @Parameter(description = "게시글 ID", required = true) Long postId) {
        postService.deletePostPermanently(postId);
        return ResponseEntity.noContent().build();
    }
}
