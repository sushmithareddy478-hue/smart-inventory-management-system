package com.inventorypro.controller;

import com.inventorypro.dto.ai.AiChatRequest;
import com.inventorypro.dto.ai.AiChatResponse;
import com.inventorypro.dto.ai.ForecastResultDto;
import com.inventorypro.dto.ai.ReorderSuggestionDto;
import com.inventorypro.service.ai.InventoryAiService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ai")
@RequiredArgsConstructor
@Tag(name = "AI Copilot & Insights", description = "Endpoints for Demand Forecasting, Chat Assistant, and Automated Reorder Points")
public class AiAssistantController {

    private final InventoryAiService aiService;

    @PostMapping("/chat")
    @Operation(summary = "Query AI Assistant", description = "Ask natural language questions about current inventory, low stock, and procurement suggestions")
    public ResponseEntity<AiChatResponse> chatWithAssistant(@Valid @RequestBody AiChatRequest request) {
        return ResponseEntity.ok(aiService.askAssistant(request));
    }

    @GetMapping("/forecast")
    @Operation(summary = "Smart Demand Forecasting", description = "Predicts stock shortages, consumption velocity, and runout days based on historical transactions")
    public ResponseEntity<List<ForecastResultDto>> getDemandForecast() {
        return ResponseEntity.ok(aiService.getDemandForecasts());
    }

    @GetMapping("/reorder-suggestions")
    @Operation(summary = "Automated Reorder Point Suggestions", description = "Provides dynamic safety-stock calculations and optimal reorder levels")
    public ResponseEntity<List<ReorderSuggestionDto>> getReorderSuggestions() {
        return ResponseEntity.ok(aiService.getReorderSuggestions());
    }
}
