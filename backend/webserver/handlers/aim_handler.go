package handlers

import (
	"backend/alog"
	"backend/lib/iam"
	"backend/lib/mongodb"
	"context"
	"net/http"
)

type IAMHandler struct {
	dbClient mongodb.Client
}

func NewDefaultIAMHandler(dbClient mongodb.Client) *IAMHandler {
	return &IAMHandler{dbClient: dbClient}
}

func (h *IAMHandler) SignIn(ctx context.Context, w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		alog.Error(ctx, "Invalid method %s", r.Method)
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		return
	}
	userBytes, err := iam.SignIn(ctx, h.dbClient, r.Body)
	if err != nil {
		alog.Error(ctx, "Error signing in: %w", err)
		http.Error(w, "Error Signing in", http.StatusInternalServerError)
	}

	if _, err = w.Write(userBytes); err != nil {
		alog.Error(ctx, "error writing data %v", err)
		http.Error(w, "failed write data to the response body", http.StatusInternalServerError)
	}
	// todo: set header for json
}

func (h *IAMHandler) SignUp(ctx context.Context, w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		alog.Error(ctx, "Invalid method %s", r.Method)
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		return
	}
	err := iam.SignUp(ctx, h.dbClient, r.Body)
	if err != nil {
		alog.Error(ctx, "Error signing up: %w", err)
		http.Error(w, "Error Signing up", http.StatusInternalServerError)
	}
	w.WriteHeader(http.StatusCreated)
}
