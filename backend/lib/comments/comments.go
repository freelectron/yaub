package comments

import (
	"backend/database/mongodb"
	"context"
	"encoding/json"
	"fmt"
	"go.mongodb.org/mongo-driver/bson"
	"io"
)

type Comment struct {
	Id              int       `bson:"_id"`
	User            string    `bson:"User"`
	Content         string    `bson:"Content"`
	HighlightedText string    `bson:"HighlightedText"`
	Replies         []Comment `bson:"Replies"`
}

func AddComment(ctx context.Context, dbClient mongodb.Client, postId string, commentResponseBody io.ReadCloser) error {
	var comment Comment
	if err := json.NewDecoder(commentResponseBody).Decode(&comment); err != nil {
		return fmt.Errorf("error decoding comment: %w", err)
	}

	err := dbClient.CreateDoc(ctx, comment, postId)
	if err != nil {
		return fmt.Errorf("error adding comment: %w", err)
	}

	return nil
}

func FetchComments(ctx context.Context, dbClient mongodb.Client, postId string) ([]byte, error) {
	results, err := dbClient.GetAll(ctx, postId)
	if err != nil {
		return nil, fmt.Errorf("error fetching comments: %w", err)
	}

	jsonString, err := bsonToJSONBytes(results)
	if err != nil {
		return nil, fmt.Errorf("failed to parse the output from mongodb: %w", err)
	}

	return jsonString, nil
}

func bsonToJSONBytes(data []bson.M) ([]byte, error) {
	jsonData, err := json.Marshal(data)
	if err != nil {
		return nil, fmt.Errorf("error marshalling BSON to JSON: %w", err)
	}
	return jsonData, nil
}
