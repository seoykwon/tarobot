package com.ssafy.api.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatSummaryRes {
    private String summary;
    private String title;
    private String tag;
    private String cardImageUrl;
}

