package mongodb

import (
	"backend/alog"
	"backend/lib/myerrors"
	"context"
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
	GetUserInfo(ctx context.Context, email, password, table string) (string, string, error)
	CreateUser(ctx context.Context, name, email, password, table string) error
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

func (c *mongoClient) GetUserInfo(ctx context.Context, email, password, table string) (string, string, error) {
	collection := c.client.Database(c.database).Collection(table)

	// Query the database for a user with matching email and password
	filter := bson.M{"email": email}
	var user struct {
		Id       string `bson:"_id"`
		Name     string `bson:"name"`
		Password string `bson:"password"`
	}

	err := collection.FindOne(ctx, filter).Decode(&user)

	alog.Info(ctx, "Found user %v", user)

	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return "", "", fmt.Errorf("%w", myerrors.ErrUserNotFound)
		}
		// Other errors
		return "", "", fmt.Errorf("error querying database: %w", err)
	}

	if user.Password != password {
		alog.Info(ctx, "Invalid password for user with email %s", email)
		return "", "", fmt.Errorf("%w", myerrors.ErrUserNotFound)
	}

	return user.Id, user.Name, nil
}

func (c *mongoClient) CreateUser(ctx context.Context, name, email, password, table string) error {
	collection := c.client.Database(c.database).Collection(table)

	// Create a new user document
	newUser := bson.M{
		"name":     name,
		"email":    email,
		"password": password,
	}

	// Insert the new user into the collection
	_, err := collection.InsertOne(ctx, newUser)
	if err != nil {
		return fmt.Errorf("failed to create user: %w", err)
	}

	alog.Info(ctx, "User created successfully: %s", email)
	return nil
}
