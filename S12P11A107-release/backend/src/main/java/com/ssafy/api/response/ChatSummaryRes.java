package com.ssafy.api.response;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ChatSummaryRes {
    private String summary;
    private String title;
    private List<String> tag;
    private String cardImageUrl;
}

