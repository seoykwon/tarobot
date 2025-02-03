package com.ssafy.api.controller;

import com.ssafy.api.request.PostRegisterReq;
import com.ssafy.api.response.PostRes;
import com.ssafy.api.service.PostService;
import com.ssafy.db.entity.Post;
import com.ssafy.db.entity.User;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponses;
import io.swagger.annotations.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@Api(value = "게시글 API", tags = {"Post"})
@RestController
@RequestMapping("/api/v1/posts")  // 기존 "/community/articles" --> "/api/v1/posts"로 변경
public class PostController {

    @Autowired
    private PostService postService;

    // **1. 게시글 생성 **
    @PostMapping
    @ApiOperation(value = "게시글 생성", notes = "게시글 제목, 내용, 이미지 URL, 작성자 ID를 입력받아 게시글을 생성합니다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 400, message = "잘못된 요청"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<PostRes> createPost(
            @RequestBody @Valid @ApiParam(value = "게시글 생성 정보", required = true) PostRegisterReq request) {
        Post createdPost = postService.createPost(request);
        return ResponseEntity.ok(PostRes.of(createdPost));
    }

    // **2. 모든 게시글 조회 (페이지네이션 지원)**
    @GetMapping
    @ApiOperation(value = "모든 게시글 조회", notes = "활성화된 모든 게시글을 페이지네이션 처리하여 조회합니다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<List<PostRes>> getAllPosts(
            @RequestParam(defaultValue = "0") @ApiParam(value = "페이지 번호", required = false) int page,
            @RequestParam(defaultValue = "10") @ApiParam(value = "페이지 크기", required = false) int size) {
        List<PostRes> posts = postService.getAllPosts(page, size);
        return ResponseEntity.ok(posts);
    }

    // **3. 게시글 상세 조회**
    @GetMapping("/{postId}")
    @ApiOperation(value = "게시글 상세 조회", notes = "게시글 ID를 통해 특정 게시글의 상세 정보를 조회합니다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 404, message = "게시글을 찾을 수 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<PostRes> getPostById(
            @PathVariable @ApiParam(value = "게시글 ID", required = true) Long postId) {
        PostRes postRes = postService.getPostById(postId);
        return ResponseEntity.ok(postRes);
    }

    // **4. 제목으로 게시글 검색**
    @GetMapping("/search/title")
    @ApiOperation(value = "제목으로 게시글 검색", notes = "제목에 특정 문자열이 포함된 게시글을 검색합니다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<List<PostRes>> getPostsByTitle(
            @RequestParam @ApiParam(value = "검색할 제목", required = true) String title) {
        List<PostRes> posts = postService.getPostsByTitle(title);
        return ResponseEntity.ok(posts);
    }

    // **5. 작성자로 게시글 검색**
    @GetMapping("/search/author/{authorId}")
    @ApiOperation(value = "작성자로 게시글 검색", notes = "작성자 ID를 통해 해당 사용자가 작성한 모든 게시글을 조회합니다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 404, message = "작성자를 찾을 수 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<List<PostRes>> getPostsByAuthor(
            @PathVariable @ApiParam(value = "작성자 ID", required = true) String authorId) {
        List<PostRes> posts = postService.getPostsByAuthor(authorId);
        return ResponseEntity.ok(posts);
    }

    // **6. 게시글 수정 (제목 및 이미지)**
    @PutMapping("/{postId}")
    @ApiOperation(value = "게시글 수정", notes = "게시글 ID를 통해 특정 게시글의 제목과 이미지를 수정합니다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 404, message = "게시글을 찾을 수 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<PostRes> updatePost(
            @PathVariable @ApiParam(value = "게시글 ID", required = true) Long postId,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String imageUrl) {
        Post updatedPost = postService.updatePost(postId, title, imageUrl);
        return ResponseEntity.ok(PostRes.of(updatedPost));
    }

    // **7. 게시글 삭제 (비활성화 처리)**
    @DeleteMapping("/{postId}")
    @ApiOperation(value = "게시글 삭제 (비활성화)", notes = "일반 사용자는 게시글을 비활성화 처리합니다.")
    @ApiResponses({
            @ApiResponse(code = 204, message = "성공"),
            @ApiResponse(code = 404, message = "게시글을 찾을 수 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<Void> deactivatePost(
            @PathVariable @ApiParam(value = "게시글 ID", required = true) Long postId,
            User currentUser) {
        postService.deactivatePost(postId, currentUser);
        return ResponseEntity.noContent().build();
    }

    // **8. 게시글 삭제 (완전 삭제 - 관리자 전용)**
    @DeleteMapping("/admin/{postId}")
    @ApiOperation(value = "게시글 삭제 (완전 삭제)", notes = "관리자 권한으로 게시글을 완전 삭제합니다. 삭제 전 게시글은 반드시 비활성화 상태여야 합니다.")
    @ApiResponses({
            @ApiResponse(code = 204, message = "성공"),
            @ApiResponse(code = 404, message = "게시글을 찾을 수 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<Void> deletePostPermanently(
            @PathVariable @ApiParam(value = "게시글 ID", required = true) Long postId,
            User currentUser) {
        postService.deletePostPermanently(postId, currentUser);
        return ResponseEntity.noContent().build();
    }
}
