package main

import (
	"backend/alog"
	"backend/webserver"
	"context"
)

func main() {
	sysCtx := context.Background()
	alog.Info(sysCtx, "Configuring the webserver..")

	// Read config (not implemented)

	// Configure web webserver
	svc := webserver.NewDefaultWebService()

	// Register routes
	svc.RegisterRoute("GET", "/api/posts_meta_info", svc.Handler.GetPostsMetaInfo) //http://localhost:3001/api/posts_meta_info
	svc.RegisterRoute("GET", "/api/get_post", svc.Handler.GetPost)                 //http://localhost:3001/api/get_post?postId=svd

	alog.Fatal(sysCtx, "Listen and serve error: ", svc.HttpServer.ListenAndServe())
}
