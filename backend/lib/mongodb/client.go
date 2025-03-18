package mongodb

import (
	"context"
	"fmt"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"log"
	"os"
)

type Client interface {
	GetPostComments(ctx context.Context, postId string) ([]bson.M, error)
	PostComments(ctx context.Context, postId string, comments []interface{}) error
	PostComment(ctx context.Context, postId string, comment interface{}) error
}

type mongoClient struct {
	client   *mongo.Client
	database string
}

func newMongoClient(user, pass, addr string, port int, database string) (Client, error) {
	mongoURI := fmt.Sprintf("mongodb://%s:%s@%s:%d", user, pass, addr, port)
	clientOptions := options.Client().ApplyURI(mongoURI)
	client, err := mongo.Connect(context.Background(), clientOptions)
	if err != nil {
		return nil, fmt.Errorf("error connecting to mongodb: %w", err)
	}

	return &mongoClient{client: client, database: database}, nil

}

func New() (Client, error) {
	user := os.Getenv("MONGO_DB_USERNAME")
	pass := os.Getenv("MONGO_DB_PASSWORD")
	addr := os.Getenv("MONGO_DB_ADDR")
	port := 27017
	db := "prod-blog"

	if user == "" || pass == "" {
		return nil, fmt.Errorf("missing required environment variables")
	}
	return newMongoClient(user, pass, addr, port, db)
}

func (c *mongoClient) PostComments(ctx context.Context, postId string, comments []interface{}) error {
	collection := c.client.Database(c.database).Collection(postId)

	_, err := collection.InsertMany(ctx, comments)
	if err != nil {
		return fmt.Errorf("failed to insert comments: %w", err)
	}

	return nil
}

func (c *mongoClient) PostComment(ctx context.Context, postId string, comment interface{}) error {
	collection := c.client.Database(c.database).Collection(postId)

	_, err := collection.InsertOne(ctx, comment)
	if err != nil {
		return fmt.Errorf("failed to insert comment: %w", err)
	}

	return nil

}

func (c *mongoClient) GetPostComments(ctx context.Context, postId string) ([]bson.M, error) {
	collection := c.client.Database(c.database).Collection(postId)

	cursor, err := collection.Find(ctx, bson.M{}) // bson.M{} means "match all"
	if err != nil {
		log.Fatal("Find failed:", err)
	}
	defer cursor.Close(ctx)

	var results []bson.M
	if err = cursor.All(ctx, &results); err != nil {
		return nil, fmt.Errorf("cursor iteration failed: %w", err)
	}

	return results, nil
}
