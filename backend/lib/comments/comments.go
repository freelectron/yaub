package comments

import (
	"backend/alog"
	"backend/lib/mongodb"
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

func PostCommentsTest(ctx context.Context, dbClient mongodb.Client, postId string) error {
	comments := []interface{}{
		Comment{
			Id:              1,
			User:            "1221",
			Content:         "This is a comment",
			HighlightedText: "highlighted text",
			Replies: []Comment{
				{
					Id:      2,
					User:    "1222",
					Content: "This is a reply",
				},
			},
		},
		Comment{
			Id:              3,
			User:            "1221",
			Content:         "Another comment",
			HighlightedText: "another highlighted text",
			Replies:         []Comment{},
		},
	}

	err := dbClient.PostComments(ctx, postId, comments)
	if err != nil {
		return fmt.Errorf("error posting comments: %w", err)
	}

	return nil
}

func AddComment(ctx context.Context, dbClient mongodb.Client, postId string, commentResponseBody io.ReadCloser) error {
	var comment Comment
	if err := json.NewDecoder(commentResponseBody).Decode(&comment); err != nil {
		return fmt.Errorf("error decoding comment: %w", err)
	}

	err := dbClient.PostComment(ctx, postId, comment)
	if err != nil {
		return fmt.Errorf("error adding comment: %w", err)
	}

	return nil

}

func FetchComments(ctx context.Context, dbClient mongodb.Client, postId string) ([]byte, error) {
	alog.Info(context.Background(), "Simulate a comments fetch for post %s", postId)

	results, err := dbClient.GetPostComments(ctx, postId)

	jsonString, err := bsonToJSONBytes(results)
	if err != nil {
		return nil, fmt.Errorf("failed to parse the output from mongodb: %w", err)
	}

	return jsonString, nil
}

func bsonToJSONStringToBytes(data []bson.M) ([]byte, error) {
	jsonData, err := json.Marshal(data)
	if err != nil {
		return nil, fmt.Errorf("error marshalling BSON to JSON: %w", err)
	}
	bytesData, err := json.Marshal(string(jsonData))
	if err != nil {
		return nil, fmt.Errorf("error marshalling BSON to JSON: %w", err)
	}
	return bytesData, nil
}

func bsonToJSONBytes(data []bson.M) ([]byte, error) {
	jsonData, err := json.Marshal(data)
	if err != nil {
		return nil, fmt.Errorf("error marshalling BSON to JSON: %w", err)
	}
	return jsonData, nil
}
