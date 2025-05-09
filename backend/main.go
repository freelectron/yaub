package main

import (
	"backend/alog"
	"backend/lib/mongodb"
	"backend/webserver"
	"backend/webserver/handlers"
	"context"
)

type Config struct {
	CommentsDBName string
	UsersDBName    string
}

func main() {
	// Configure
	sysCtx := context.Background()
	// TODO: Read from a config file or env variables
	config := Config{
		CommentsDBName: "prod-blog",
		UsersDBName:    "users",
	}

	// Init
	svc := webserver.NewDefaultWebService()

	mongoDBComments, err := mongodb.New(config.CommentsDBName)
	if err != nil {
		alog.Fatal(sysCtx, "Error connecting to mongodb comments: ", err)
	}

	commentsHandler := handlers.NewDefaultCHandler(mongoDBComments)
	svc.RegisterRoute("GET", "/api/get_comments", commentsHandler.GetComments)
	svc.RegisterRoute("POST", "/api/post_comment", commentsHandler.PostComment)

	// ToDo: no re-use of the mongo client, the plan is to replace the database
	mongoDBUsers, err := mongodb.New(config.UsersDBName)
	if err != nil {
		alog.Fatal(sysCtx, "Error connecting to mongodb users: ", err)
	}

	iamHandler := handlers.NewDefaultIAMHandler(mongoDBUsers)
	svc.RegisterRoute("POST", "/api/signin", iamHandler.SignIn)
	svc.RegisterRoute("POST", "/api/register_user", iamHandler.SignUp)

	// Run
	alog.Fatal(sysCtx, "Listen and serve error: ", svc.HttpServer.ListenAndServe())
}
