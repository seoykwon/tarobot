package com.ssafy.api.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Schema(description = "ChatSession Register Request")
public class ChatSessionRegisterReq {

    @NotNull(message = "�� ID�� �ʼ� �Է� �׸��Դϴ�.")
    @Schema(description = "���ǿ� ������ �� ID", example = "1")
    private Long botId;
}
