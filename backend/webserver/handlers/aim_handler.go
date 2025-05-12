package handlers

import (
	"backend/alog"
	"backend/lib/iam"
	"backend/lib/mongodb"
	"backend/lib/myerrors"
	"context"
	"encoding/json"
	"errors"
	"fmt"
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
		if errors.Is(err, myerrors.ErrUserAlreadyExists) {
			if err = writeError(w, http.StatusConflict, "duplicate_id", "A document with this ID already exists."); err != nil {
				alog.Error(ctx, "Error in writeError in response: %w", err)
				http.Error(w, "Error Signing up", http.StatusInternalServerError)
			}
			return
		} else {
			alog.Error(ctx, "Error signing up: %w", err)
			http.Error(w, "Error Signing up", http.StatusInternalServerError)
			return
		}
	}
	w.WriteHeader(http.StatusCreated)
}

func writeError(w http.ResponseWriter, status int, errType, message string) error {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	if err := json.NewEncoder(w).Encode(myerrors.ErrorResponse{
		Type:    errType,
		Message: message,
	}); err != nil {
		return fmt.Errorf("failed to write error response: %w", err)
	}
	return nil
}
