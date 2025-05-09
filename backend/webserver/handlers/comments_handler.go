package handlers

import (
	"backend/alog"
	"backend/lib/comments"
	"backend/lib/mongodb"
	"context"
	"net/http"
)

type CHandler struct {
	dbClient mongodb.Client
}

func NewDefaultCHandler(dbClient mongodb.Client) *CHandler {
	return &CHandler{dbClient: dbClient}
}

func (h *CHandler) GetComments(ctx context.Context, w http.ResponseWriter, r *http.Request) {
	postId := r.URL.Query().Get("postId")
	if postId == "" {
		http.Error(w, "Missing postId parameter", http.StatusBadRequest)
		return
	}

	content, err := comments.FetchComments(ctx, h.dbClient, postId)
	if err != nil {
		alog.Error(context.Background(), "Error when fetching comment %s", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
	}

	if _, err = w.Write(content); err != nil {
		alog.Error(ctx, "error writing data %v", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
	}
	// todo: set header for json
}

func (h *CHandler) PostComment(ctx context.Context, w http.ResponseWriter, r *http.Request) {
	postId := r.URL.Query().Get("postId")
	if postId == "" {
		http.Error(w, "Missing postId parameter", http.StatusBadRequest)
		return
	}

	if err := comments.AddComment(ctx, h.dbClient, postId, r.Body); err != nil {
		alog.Error(ctx, "Error saving comment: %v", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
}
