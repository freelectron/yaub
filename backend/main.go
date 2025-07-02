package main

import (
	"backend/alog"
	"backend/database/mongodb"
	llm_chat_v1 "backend/grpc/gen/service/llm_chat/v1"
	"backend/webserver"
	"backend/webserver/handlers"
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"google.golang.org/grpc"
	"io"
	"net/http"
	"os"
	"sync"
	"time"
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

	//// ToDo: prettify?
	llmerAddr := os.Getenv("BROWSER_SERVER_ADDR")
	llmerConn, err := grpc.Dial(llmerAddr, grpc.WithInsecure())
	if err != nil {
		alog.Fatal(sysCtx, "Failed to connect to llmer gRPC: ", err)
	}
	defer llmerConn.Close()
	llmerClient := llm_chat_v1.NewLLMChatServiceClient(llmerConn)
	llmerHandler := handlers.NewDefaultLLMHandler(llmerClient)
	svc.RegisterRoute("POST", "/api/llmer/start_session", llmerHandler.StartSession)

	// Run in separate goroutine to avoid blocking
	wg := sync.WaitGroup{}
	wg.Add(1)
	go func() {
		err = svc.HttpServer.ListenAndServe()
		time.Sleep(2 * time.Second)
		//alog.Fatal(sysCtx, "Listen and serve error: ", err)
		fmt.Println("Error while serving: ", err)
		fmt.Println("Web server exited.")
		wg.Done()
	}()

	////////////////////////
	//      TESTING
	////////////////////////
	fmt.Println("Testing gRPC connection...")
	time.Sleep(5 * time.Second) // Wait for the gRPC server to be ready
	// For testing: a GET endpoint that sends a StartSession request with a hardcoded model
	// Prepare the request body
	body := map[string]string{"model": "ChatGPT"}
	jsonBody, err := json.Marshal(body)
	if err != nil {
		fmt.Println("Could not marshal request body: ", err)
		fmt.Errorf("Failed to marshal request body: "+err.Error(), http.StatusInternalServerError)
		return
	}
	// Send a post request to itself
	//resp, err := http.Post("http://backend:3001/api/llmer/start_session", "application/json", bytes.NewReader(jsonBody))
	resp, err := http.Post("http://localhost:3001/api/llmer/start_session", "application/json", bytes.NewReader(jsonBody))

	if err != nil {
		fmt.Errorf("Failed to send POST request: "+err.Error(), http.StatusInternalServerError)
		return
	}
	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		fmt.Println("Error reading response body:", err)
		return
	}
	fmt.Println(string(respBody))
	defer resp.Body.Close()
	wg.Wait()
}
