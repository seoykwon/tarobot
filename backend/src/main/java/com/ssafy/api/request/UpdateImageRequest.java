package com.ssafy.api.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateImageRequest {
    private String newImage; // 새로운 이미지 URL
}