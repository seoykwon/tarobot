package com.ssafy.api.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

/**
 * 공지사항 등록 API ([POST] /api/v1/announcements) 요청에 사용되는 Request DTO.
 * 이 API는 관리자 계정만 접근할 수 있도록 구성합니다.
 */
@Getter
@Setter
@Schema(description = "Announcement Register Request (관리자 전용)")
public class AnnouncementRegisterReq {

    @NotBlank(message = "공지사항 제목은 필수 입력 항목입니다.")
    @Schema(description = "공지사항 제목", example = "시스템 점검 안내")
    private String title;

    @NotBlank(message = "공지사항 내용은 필수 입력 항목입니다.")
    @Schema(description = "공지사항 내용", example = "내일 12시부터 2시까지 시스템 점검이 예정되어 있습니다.")
    private String content;
}
