package com.ssafy.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;

@Configuration
@EnableAsync
public class AsyncConfig {
    // 비동기 처리를 위한 설정
    // 필요에 따라 커스텀 TaskExecutor를 정의할 수 있습니다.
}

