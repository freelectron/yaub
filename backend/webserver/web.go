package webserver

import (
	"backend/webserver/handlers"
	"context"
	"fmt"
	"net"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

const keyServerAddr = "serverAddr"

type WebService struct {
	Host       string
	Port       int
	Name       string
	HttpServer http.Server
	Router     *mux.Router
}

// NewDefaultWebService TODO: initialize from a config/envs
func NewDefaultWebService() *WebService {
	host := "0.0.0.0"
	port := 3001
	router := mux.NewRouter()
	baseCtx, _ := context.WithCancel(context.Background())

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE"},
		AllowedHeaders:   []string{"*"},
		AllowCredentials: true,
	})

	return &WebService{
		Host:   host,
		Port:   port,
		Name:   "Web Server for the Blog's API",
		Router: router,
		HttpServer: http.Server{
			Addr:    fmt.Sprintf("%s:%d", host, port),
			Handler: c.Handler(router),
			BaseContext: func(listener net.Listener) context.Context {
				return context.WithValue(baseCtx, keyServerAddr, fmt.Sprintf("%s:%d", host, port))
			},
		},
	}
}

func (s *WebService) RegisterRoute(method, url string, f handlers.HandlerFunc) {
	s.Router.Methods(method).Path(url).HandlerFunc(handlers.HandlerWithContext(f))
}
