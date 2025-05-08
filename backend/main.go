package main

import (
	"backend/alog"
	"backend/lib/mongodb"
	"backend/webserver"
	"backend/webserver/handlers"
	"context"
)

func main() {
	// Configure
	sysCtx := context.Background()

	// Init
	svc := webserver.NewDefaultWebService()
	mongoDB, err := mongodb.New()
	if err != nil {
		alog.Fatal(sysCtx, "Error connecting to mongodb: ", err)
	}

	commentsHandler := handlers.NewDefaultCHandler(mongoDB)
	svc.RegisterRoute("GET", "/api/get_comments", commentsHandler.GetComments)
	svc.RegisterRoute("POST", "/api/post_comment", commentsHandler.PostComment)

	iamHandler := handlers.NewDefaultIAMHandler(mongoDB)
	svc.RegisterRoute("POST", "/api/sigin", iamHandler.SignIn)

	// Run
	alog.Fatal(sysCtx, "Listen and serve error: ", svc.HttpServer.ListenAndServe())
}
