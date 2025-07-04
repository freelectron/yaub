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
	"os"
)

type Client interface {
	GetAll(ctx context.Context, postId string) ([]bson.M, error)
	GetOneWithFilter(ctx context.Context, filter bson.D, table string) ([]byte, error)
	CreateDoc(ctx context.Context, content any, table string) error
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
	user := os.Getenv("MONGO_DB_USERNAME")
	pass := os.Getenv("MONGO_DB_PASSWORD")
	addr := os.Getenv("MONGO_DB_ADDR")
	port := 27017
	db := dbName

	if user == "" || pass == "" {
		return nil, fmt.Errorf("missing required environment variables")
	}
	return newMongoClient(user, pass, addr, port, db)
}

func (c *mongoClient) GetAll(ctx context.Context, collectionName string) ([]bson.M, error) {
	collection := c.client.Database(c.database).Collection(collectionName)

	cursor, err := collection.Find(ctx, bson.M{}) // bson.M{} means "match all"
	if err != nil {
		return nil, fmt.Errorf("mongodb's Find failed: %w", err)
	}
	defer cursor.Close(ctx)

	var results []bson.M
	if err = cursor.All(ctx, &results); err != nil {
		return nil, fmt.Errorf("cursor iteration failed: %w", err)
	}

	return results, nil
}

func (c *mongoClient) GetOneWithFilter(ctx context.Context, filter bson.D, table string) ([]byte, error) {
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

func (c *mongoClient) CreateDoc(ctx context.Context, content any, table string) error {
	collection := c.client.Database(c.database).Collection(table)

	data, err := bson.Marshal(content)
	if err != nil {
		return fmt.Errorf("failed to bson the content: %w", err)
	}

	_, err = collection.InsertOne(ctx, data)
	if err != nil {
		if mongo.IsDuplicateKeyError(err) {
			return fmt.Errorf("failed to create user: %w", myerrors.ErrUserAlreadyExists)
		} else {
			return fmt.Errorf("failed to create user: %w", err)
		}
	}

	return nil
}
