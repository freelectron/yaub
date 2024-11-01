package webserver

import (
	"backend/alog"
	"context"
	"io/ioutil"
	"net/http"
	"os"
	"path/filepath"
)

type Handler struct{}

// HandlerFunc is a wrapper to http.HandlerFunc.
// This allows using context argument for Handler functions (that only have http.ResponseWriter and *http.Request parameters)
type HandlerFunc func(context.Context, http.ResponseWriter, *http.Request)

// HandlerWithContext wraps a trace.HandlerFunc in an http.HandlerFunc.
// Typical use is in a method that expects handlerFunc. ex: mux Router.HandlerFunc
func HandlerWithContext(f HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		//todo: create and use context from request
		f(context.Background(), w, r)
	}
}

// NewDefaultHandler creates and returns a new instance of Handler.
// This function initializes a new Handler struct and returns a pointer to it.
// Returns:
//   *Handler: A pointer to a new Handler instance.
func NewDefaultHandler() *Handler {
	return &Handler{}
}

func (h *Handler) GetPostsMetaInfo(ctx context.Context, w http.ResponseWriter, r *http.Request) {
	// read json file and return it as a string
	filePath := filepath.Join("data", "posts", "meta_info.json")
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

func (h *Handler) GetPost(ctx context.Context, w http.ResponseWriter, r *http.Request) {
	postId := r.URL.Query().Get("postId")
	if postId == "" {
		http.Error(w, "Missing postId parameter", http.StatusBadRequest)
		return
	}
	filePath := filepath.Join("data", "posts", postId, "post.md")
	content, err := readFileContent(filePath)
	if err != nil {
		alog.Error(context.Background(), "Error when reading the content %s", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
	}
	if _, err = w.Write([]byte(content)); err != nil {
		alog.Error(ctx, "error writing data %v", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
	}
	w.WriteHeader(http.StatusOK)
}

func readFileContent(filePath string) (string, error) {
	file, err := os.Open(filePath)
	if err != nil {
		return "", err
	}
	defer file.Close()

	content, err := ioutil.ReadAll(file)
	if err != nil {
		return "", err
	}

	return string(content), nil
}
