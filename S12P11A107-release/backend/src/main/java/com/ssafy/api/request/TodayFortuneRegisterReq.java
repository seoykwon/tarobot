package com.ssafy.api.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Schema(description = "Today's Fortune Register Request")
public class TodayFortuneRegisterReq {

    @NotNull(message = "타로 카드 ID는 필수 입력 항목입니다.")
    @Schema(description = "타로 카드 ID", example = "1")
    private Long tarotCardId;
}
