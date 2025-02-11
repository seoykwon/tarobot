package com.ssafy.api.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
@Schema(description = "Chat Clost Request")
public class ChatCloseRequest {
    @NotNull(message = "���� ID�� �ʼ� �Է� �׸��Դϴ�.")
    @Schema(description = "ä�ÿ� ����� ���� ID", example = "UUID")
    private UUID sessionId;

    @NotNull(message = "����� ID�� �ʼ� �Է� �׸��Դϴ�.")
    @Schema(description = "������� ID", example = "username@email.com")
    private String userId;
}
