package main

import (
	"backend/alog"
	"backend/webserver"
	"context"
)

func main() {

	// Read config (not implemented)
	sysCtx := context.Background()

	// Configure web webserver
	alog.Info(sysCtx, "Configuring the webserver..")
	svc := webserver.NewDefaultWebService()

	// Register routes
	svc.RegisterRoute("GET", "/api/get_comments", svc.Handler.GetPostComments) //http://localhost:3001/api/get_comments?postId=svd

	alog.Fatal(sysCtx, "Listen and serve error: ", svc.HttpServer.ListenAndServe())
}
