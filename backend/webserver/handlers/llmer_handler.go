package handlers

import (
	gprcLLMer "backend/grpc/gen/service/llm_chat/v1"
	"context"
	"encoding/json"
	"net/http"
)

type LLMHandler struct {
	grpcClient gprcLLMer.LLMChatServiceClient
}

func NewDefaultLLMHandler(grpcClient gprcLLMer.LLMChatServiceClient) *LLMHandler {
	return &LLMHandler{
		grpcClient: grpcClient,
	}
}

func (h *LLMHandler) StartSession(ctx context.Context, w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		return
	}

	var req gprcLLMer.StartSessionRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	resp, err := h.grpcClient.StartSession(ctx, &req)
	if err != nil {
		http.Error(w, "Error processing text", http.StatusInternalServerError)
		return
	}

	if err := json.NewEncoder(w).Encode(resp); err != nil {
		http.Error(w, "Error writing response", http.StatusInternalServerError)
	}
}
