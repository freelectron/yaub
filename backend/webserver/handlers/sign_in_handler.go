package handlers

import (
	"backend/lib/mongodb"
	"context"
	"encoding/json"
	"net/http"
)

type Credentials struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type User struct {
	ID    string `json:"id"`
	Name  string `json:"name"`
	Email string `json:"email"`
}

type Session struct {
	User  User   `json:"user"`
	Token string `json:"token,omitempty"`
}

type IAMHandler struct {
	dbClient mongodb.Client
}

func NewDefaultIAMHandler(dbClient mongodb.Client) *IAMHandler {
	return &IAMHandler{dbClient: dbClient}
}

// Simulated database check
func authorize(creds Credentials) (*User, error) {
	if creds.Email == "admin@admin.com" && creds.Password == "1234" {
		return &User{
			ID:    "1",
			Name:  "admin",
			Email: "admin@example.com",
		}, nil
	}
	return nil, nil
}

func (h *IAMHandler) SignIn(_ context.Context, w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		return
	}

	var creds Credentials
	err := json.NewDecoder(r.Body).Decode(&creds)
	if err != nil {
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}

	user, err := authorize(creds)
	if err != nil || user == nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	// Simulate session token (replace with JWT in production)
	session := Session{
		User:  *user,
		Token: "mock-session-token",
	}

	// Set headers
	w.WriteHeader(http.StatusOK)
	w.Header().Set("Content-Type", "application/json")

	err = json.NewEncoder(w).Encode(session)
	if err != nil {
		http.Error(w, "Error encoding session in the response, err: ", http.StatusInternalServerError)
		return
	}
}
