package comments

import (
	"backend/alog"
	"context"
	"encoding/json"
	"fmt"
)

type Comment struct {
	Id              string    `bson:"Id"`
	User            string    `bson:"User"`
	Content         string    `bson:"Content"`
	HighlightedText string    `bson:"HighlightedText"`
	Replies         []Comment `bson:"Replies"`
}

func FetchComments(postId string) ([]byte, error) {
	alog.Info(context.Background(), "Simulate a comments fetch for post %s", postId)

	// ToDo: replace with a call to the database
	comments := []Comment{
		{
			Id:              "1212",
			User:            "1221",
			Content:         "This is a comment",
			HighlightedText: "highlighted text",
			Replies: []Comment{
				{
					Id:      "1213",
					User:    "1222",
					Content: "This is a reply",
				},
			},
		},
		{
			Id:              "1214",
			User:            "1221",
			Content:         "Another comment",
			HighlightedText: "another highlighted text",
			Replies:         nil,
		},
	}

	b, err := json.Marshal(comments)
	if err != nil {
		return nil, fmt.Errorf("error marshalling comments: %w", err)
	}

	return b, nil
}
