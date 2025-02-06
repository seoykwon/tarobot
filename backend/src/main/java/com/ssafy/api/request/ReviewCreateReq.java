package com.ssafy.api.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReviewCreateReq {
    private String author;
    private int rating;
    private String content;
}
