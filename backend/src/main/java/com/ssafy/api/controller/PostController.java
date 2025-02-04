package com.ssafy.api.controller;

import com.ssafy.api.request.PostRegisterReq;
import com.ssafy.api.response.PostRes;
import com.ssafy.api.service.PostService;
import com.ssafy.db.entity.Post;
import com.ssafy.db.entity.User;
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

    // 게시글 생성
    @PostMapping
    @Operation(summary = "게시글 생성", description = "게시글 제목, 내용, 이미지 URL, 작성자 ID를 입력받아 게시글을 생성합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<PostRes> createPost(
            @RequestBody @Valid @Parameter(description = "게시글 생성 정보", required = true) PostRegisterReq request) {
        Post createdPost = postService.createPost(request);
        return ResponseEntity.ok(PostRes.of(createdPost));
    }

    // 모든 게시글 조회 (페이지네이션, 정렬 지원)
    @GetMapping
    @Operation(summary = "모든 게시글 조회", description = "활성화된 게시글을 페이지네이션 처리하고, 정렬 파라미터(sort)에 따라 정렬합니다.\n" +
            "기본 정렬은 최신순(createdAt 내림차순)이며, sort 값으로 \"like\", \"view\", \"comment\"가 전달되면 해당 기준의 내림차순 정렬을 적용합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<List<PostRes>> getAllPosts(
            @RequestParam(defaultValue = "0") @Parameter(description = "페이지 번호 (0부터 시작)", required = false) int page,
            @RequestParam(defaultValue = "10") @Parameter(description = "페이지 크기", required = false) int size,
            @RequestParam(required = false, defaultValue = "new") @Parameter(description = "정렬 기준 (new: 최신순, like: 좋아요순, view: 조회수순, comment: 댓글순)", required = false) String sort) {
        List<PostRes> posts = postService.getAllPosts(page, size, sort);
        return ResponseEntity.ok(posts);
    }

    // 게시글 상세 조회
    @GetMapping("/{postId}")
    @Operation(summary = "게시글 상세 조회", description = "게시글 ID를 통해 특정 게시글의 상세 정보를 조회합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "404", description = "게시글을 찾을 수 없음"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<PostRes> getPostById(
            @PathVariable @Parameter(description = "게시글 ID", required = true) Long postId) {
        PostRes postRes = postService.getPostById(postId);
        return ResponseEntity.ok(postRes);
    }

    // ---------------------------------------
    // 4. 기타 개별 검색(제목, 작성자,정렬 등) - 별도 엔드포인트 사용하지 않고 통합 API로 처리
    // ---------------------------------------
    /*
    @GetMapping("/search/title")
    @Operation(summary = "제목으로 게시글 검색", description = "제목에 특정 문자열이 포함된 게시글을 검색합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "404", description = "해당 조건의 게시글을 찾을 수 없음"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<List<PostRes>> getPostsByTitle(
            @RequestParam @Parameter(description = "검색할 제목", required = true) String title) {
        List<PostRes> posts = postService.getPostsByTitle(title);
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/search/author/{userId}")
    @Operation(summary = "작성자로 게시글 검색", description = "작성자 ID를 통해 해당 사용자가 작성한 게시글을 조회합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "404", description = "작성자를 찾을 수 없음"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<List<PostRes>> getPostsByAuthor(
            @PathVariable @Parameter(description = "작성자 ID", required = true) String userId) {
        List<PostRes> posts = postService.getPostsByAuthor(userId);
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/search/most-viewed")
    @Operation(summary = "조회수 기준 게시글 정렬", description = "조회수를 기준으로 내림차순 정렬하여 게시글을 검색합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "404", description = "해당 조건의 게시글을 찾을 수 없음"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<List<PostRes>> getPostsByMostViewed() {
        List<PostRes> posts = postService.getPostsByMostViewed();
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/search/most-liked")
    @Operation(summary = "좋아요 기준 게시글 정렬", description = "좋아요 수를 기준으로 내림차순 정렬하여 게시글을 검색합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "404", description = "해당 조건의 게시글을 찾을 수 없음"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<List<PostRes>> getPostsByMostLiked() {
        List<PostRes> posts = postService.getPostsByMostLiked();
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/search/most-commented")
    @Operation(summary = "댓글 수 기준 게시글 정렬", description = "댓글 수를 기준으로 내림차순 정렬하여 게시글을 검색합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "404", description = "해당 조건의 게시글을 찾을 수 없음"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<List<PostRes>> getPostsByMostCommented() {
        List<PostRes> posts = postService.getPostsByMostCommented();
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/search/title-and-author")
    @Operation(summary = "제목과 작성자 검색", description = "제목과 작성자 ID에 해당하는 게시글을 검색합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "404", description = "해당 작성자 ID의 게시글을 찾을 수 없음"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<List<PostRes>> getPostsByTitleAndAuthor(
            @RequestParam @Parameter(description = "검색할 제목", required = true) String title,
            @RequestParam @Parameter(description = "작성자 ID", required = true) String userId) {
        List<PostRes> posts = postService.getPostsByTitleAndAuthor(title, userId);
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/search/popular")
    @Operation(summary = "인기 게시글 검색", description = "댓글 수와 좋아요 수가 일정 이상인 게시글을 검색합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "404", description = "해당 조건의 게시글을 찾을 수 없음"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<List<PostRes>> getPopularPosts(
            @RequestParam @Parameter(description = "최소 댓글 수", required = true) int minCommentCount,
            @RequestParam @Parameter(description = "최소 좋아요 수", required = true) int minLikeCount) {
        List<PostRes> posts = postService.getPopularPosts(minCommentCount, minLikeCount);
        return ResponseEntity.ok(posts);
    }
    */

    // ---------------------------------------
    // 5. 게시글 수정 (제목 및 이미지)
    // ---------------------------------------
    @PutMapping("/{postId}")
    @Operation(summary = "게시글 수정", description = "게시글 ID를 통해 특정 게시글의 제목과 이미지를 수정합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "404", description = "게시글을 찾을 수 없음"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<PostRes> updatePost(
            @PathVariable @Parameter(description = "게시글 ID", required = true) Long postId,
            @RequestParam(required = false) @Parameter(description = "새로운 제목", required = false) String title,
            @RequestParam(required = false) @Parameter(description = "새로운 이미지 URL", required = false) String imageUrl) {
        Post updatedPost = postService.updatePost(postId, title, imageUrl);
        return ResponseEntity.ok(PostRes.of(updatedPost));
    }

    // ---------------------------------------
    // 6. 게시글 삭제 (비활성화 처리)
    // ---------------------------------------
    @DeleteMapping("/{postId}")
    @Operation(summary = "게시글 삭제 (비활성화)", description = "일반 사용자는 게시글을 비활성화 처리합니다. 비활성화된 게시글은 일반 검색 결과에서 노출되지 않습니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "성공"),
            @ApiResponse(responseCode = "404", description = "게시글을 찾을 수 없음"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<Void> deactivatePost(
            @PathVariable @Parameter(description = "게시글 ID", required = true) Long postId,
            @Parameter(hidden = true) User currentUser) {
        postService.deactivatePost(postId, currentUser);
        return ResponseEntity.noContent().build();
    }

    // ---------------------------------------
    // 7. 게시글 삭제 (완전 삭제 - 관리자 전용)
    // ---------------------------------------
    @DeleteMapping("/admin/{postId}")
    @Operation(summary = "게시글 삭제 (완전 삭제)", description = "관리자 권한으로 게시글을 완전 삭제합니다. 삭제 전 게시글은 반드시 비활성화 상태여야 합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "성공"),
            @ApiResponse(responseCode = "404", description = "게시글을 찾을 수 없음"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<Void> deletePostPermanently(
            @PathVariable @Parameter(description = "게시글 ID", required = true) Long postId,
            @Parameter(hidden = true) User currentUser) {
        postService.deletePostPermanently(postId, currentUser);
        return ResponseEntity.noContent().build();
    }
}
