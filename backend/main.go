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

	postHandler := handlers.NewDefaultCHandler(mongoDB)
	svc.RegisterRoute("GET", "/api/get_comments", postHandler.GetPostComments) //http://localhost:3001/api/get_comments?postId=svd

	// Run
	alog.Fatal(sysCtx, "Listen and serve error: ", svc.HttpServer.ListenAndServe())
}
