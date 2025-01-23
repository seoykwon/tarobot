package com.ssafy.api.request;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

/**
 * 게시글 등록 API ([POST] /api/v1/posts) 요청에 필요한 리퀘스트 바디 정의.
 */
@Getter
@Setter
@ApiModel("PostRegisterRequest")
public class PostRegisterReq {

    @ApiModelProperty(name = "게시글 제목", example = "오늘의 일상")
    private String title;

    @ApiModelProperty(name = "게시글 내용", example = "오늘은 정말 즐거운 하루였어요!")
    private String content;

    @ApiModelProperty(name = "이미지 URL", example = "https://example.com/image.png")
    private String imageUrl;

    @ApiModelProperty(name = "작성자 ID", example = "user123")
    private String authorId;
}
