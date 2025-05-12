package mongodb

import (
	"backend/lib/myerrors"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"log"
)

type Client interface {
	GetPostComments(ctx context.Context, postId string) ([]bson.M, error)
	PostComments(ctx context.Context, postId string, comments []interface{}) error
	PostComment(ctx context.Context, postId string, comment interface{}) error
	FindEntryWithFilter(ctx context.Context, filter bson.D, table string) ([]byte, error)
	CreateEntry(ctx context.Context, content any, table string) error
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

func New(dbName string) (Client, error) {
	user := "admin"     //os.Getenv("MONGO_DB_USERNAME")
	pass := "admin"     //os.Getenv("MONGO_DB_PASSWORD")
	addr := "localhost" //os.Getenv("MONGO_DB_ADDR")
	port := 27017
	db := dbName

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

func toBsonM(data map[string]any) bson.M {
	result := bson.M{}
	for key, value := range data {
		if nestedMap, ok := value.(map[string]any); ok {
			result[key] = toBsonM(nestedMap)
		} else {
			result[key] = value
		}
	}
	return result
}

func (c *mongoClient) FindEntryWithFilter(ctx context.Context, filter bson.D, table string) ([]byte, error) {
	collection := c.client.Database(c.database).Collection(table)
	var res bson.M

	err := collection.FindOne(ctx, filter).Decode(&res)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, fmt.Errorf("%w", myerrors.ErrUserNotFound)
		}
		return nil, fmt.Errorf("error querying database: %w", err)
	}

	jsonBytes, err := json.Marshal(res)
	if err != nil {
		return nil, fmt.Errorf("failed to parse the result to json: %w", err)
	}

	return jsonBytes, nil
}

func (c *mongoClient) CreateEntry(ctx context.Context, content any, table string) error {
	collection := c.client.Database(c.database).Collection(table)

	// convert from any struct to bson.M
	data, err := bson.Marshal(content)
	if err != nil {
		return fmt.Errorf("failed to bson the content: %w", err)
	}

	// Insert the new user into the collection
	_, err = collection.InsertOne(ctx, data)
	if err != nil {
		return fmt.Errorf("failed to create user: %w", err)
	}

	return nil
}
