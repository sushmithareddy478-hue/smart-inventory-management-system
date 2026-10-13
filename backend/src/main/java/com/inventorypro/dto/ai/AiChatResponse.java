package com.inventorypro.dto.ai;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiChatResponse {
    private String response;
    private String intent; // e.g., "QUERY_LOW_STOCK", "GENERATE_PO_DRAFT", "DEMAND_FORECAST", "GENERAL_ASSIST"
    private Map<String, Object> metadata;
    private List<String> suggestedNextActions;
}
