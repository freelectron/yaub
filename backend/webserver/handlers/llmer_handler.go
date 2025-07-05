package handlers

import (
	gprcLLMer "backend/grpc/gen/service/llm_chat/v1"
	"context"
	"encoding/json"
	"fmt"
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
	defer r.Body.Close()

	var req gprcLLMer.StartSessionRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	resp, err := h.grpcClient.StartSession(ctx, &req)
	if err != nil {
		fmt.Printf("gRPC error: %v\n", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

func (h *LLMHandler) SendMessage(ctx context.Context, w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		return
	}

	var req gprcLLMer.Question
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	resp, err := h.grpcClient.SendMessage(ctx, &req)
	if err != nil {
		http.Error(w, "Error processing text", http.StatusInternalServerError)
		return
	}

	if err := json.NewEncoder(w).Encode(resp); err != nil {
		http.Error(w, "Error writing response", http.StatusInternalServerError)
	}
}
