package main

import (
	"backend/alog"
	"backend/lib/comments"
	"backend/lib/mongodb"
	"backend/webserver"
	"backend/webserver/handlers"
	"context"
	"fmt"
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
	err = comments.PostComments(sysCtx, mongoDB, "svd")
	fmt.Println("Error: ", err)

	alog.Fatal(sysCtx, "Listen and serve error: ", svc.HttpServer.ListenAndServe())
}
