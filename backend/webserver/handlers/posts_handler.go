package handlers

import (
	"backend/alog"
	"context"
	"net/http"
	"path/filepath"
)

type PHandler struct{}

func NewDefaultPHandler() *PHandler {
	return &PHandler{}
}

func (h *PHandler) GetPostsMetaInfo(ctx context.Context, w http.ResponseWriter, r *http.Request) {
	// read json file and return it as a string
	filePath := filepath.Join("..", "..", "frontend", "public", "posts", "meta_info.json")
	content, err := readFileContent(filePath)
	if err != nil {
		alog.Error(ctx, "Error reading JSON file: %v", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}
	if _, err := w.Write([]byte(content)); err != nil {
		alog.Error(ctx, "Error writing response: %v", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
}
