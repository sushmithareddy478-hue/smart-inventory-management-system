package com.inventorypro.dto.ai;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AiChatRequest {
    @NotBlank
    private String message;

    private String conversationContext;
}
