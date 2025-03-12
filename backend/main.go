package main

import (
	"backend/alog"
	"backend/lib/comments"
	"backend/webserver"
	"context"
	"fmt"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"log"
	"os"
)

func main() {

	// Read config (not implemented)
	sysCtx := context.Background()

	// Configure web webserver
	alog.Info(sysCtx, "Configuring the webserver..")
	svc := webserver.NewDefaultWebService()

	// FIXME: test connecting to mongodb
	mongoUser := os.Getenv("MONGO_DB_USERNAME")
	mongoPass := os.Getenv("MONGO_DB_PASSWORD")
	fmt.Println("Mongo user: ", mongoUser)
	mongoURI := fmt.Sprintf("mongodb://%s:%s@localhost:27017", mongoUser, mongoPass) // todo: replace localhost with the name of the container
	clientOptions := options.Client().ApplyURI(mongoURI)
	client, err := mongo.Connect(context.Background(), clientOptions)
	if err != nil {
		alog.Error(sysCtx, "Error connecting to mongodb: ", err)
	}
	collection := client.Database("test").Collection("test")
	fmt.Println("Collection: ", collection)
	postComments := []interface{}{
		comments.Comment{
			Id:              "1212",
			User:            "1221",
			Content:         "This is a comment",
			HighlightedText: "highlighted text",
			Replies: []comments.Comment{
				{
					Id:      "1213",
					User:    "1222",
					Content: "This is a reply",
				},
			},
		},
		comments.Comment{
			Id:              "1214",
			User:            "1221",
			Content:         "Another comment",
			HighlightedText: "another highlighted text",
			Replies:         []comments.Comment{},
		},
	}
	//postComments := map[string]string{"test": "test"}
	insertResult, err := collection.InsertMany(context.Background(), postComments)
	fmt.Println(" === Inserted a single document: ", insertResult)
	if err != nil {
		log.Fatalf("Error inserting user: %v", err)
	}
	//
	cursor, err := collection.Find(sysCtx, bson.M{}) // bson.M{} means "match all"
	if err != nil {
		log.Fatal("Find failed:", err)
	}
	defer cursor.Close(sysCtx)
	var results []bson.M
	if err = cursor.All(sysCtx, &results); err != nil {
		log.Fatal("Cursor iteration failed:", err)
	}
	for _, doc := range results {
		fmt.Println(doc)
	}

	// Register routes
	svc.RegisterRoute("GET", "/api/get_comments", svc.Handler.GetPostComments) //http://localhost:3001/api/get_comments?postId=svd

	alog.Fatal(sysCtx, "Listen and serve error: ", svc.HttpServer.ListenAndServe())
}
