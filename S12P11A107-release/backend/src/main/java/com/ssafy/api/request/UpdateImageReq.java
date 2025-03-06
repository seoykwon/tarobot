package com.ssafy.api.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateImageReq {
    private String newImage; // 새로운 이미지 URL
}