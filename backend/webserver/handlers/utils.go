package handlers

import (
	"context"
	"io/ioutil"
	"net/http"
	"os"
)

// HandlerFunc is a wrapper to http.HandlerFunc.
// This allows using context argument for CHandler functions (that only have http.ResponseWriter and *http.Request parameters)
type HandlerFunc func(context.Context, http.ResponseWriter, *http.Request)

// HandlerWithContext wraps a trace.HandlerFunc in an http.HandlerFunc.
// Typical use is in a method that expects handlerFunc. ex: mux Router.HandlerFunc
func HandlerWithContext(f HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		//todo: create and use context from request
		f(context.Background(), w, r)
	}
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
