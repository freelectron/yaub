package iam

import (
	"backend/alog"
	"backend/lib/mongodb"
	"backend/lib/myerrors"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
)

const UsersCollection = "registered_users"

type Credentials struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type User struct {
	Id          string      `json:"id"`
	Name        string      `json:"name"`
	Credentials Credentials `json:"credentials"`
}

func SignIn(ctx context.Context, dbClient mongodb.Client, signInRequestBody io.ReadCloser) ([]byte, error) {
	var creds Credentials
	err := json.NewDecoder(signInRequestBody).Decode(&creds)
	if err != nil {
		return nil, fmt.Errorf("decoding singin request body: %w", err)
	}

	alog.Info(ctx, "Querying the database for user %s, %s", creds.Email, creds.Password)
	userId, userName, err := dbClient.GetUserInfo(ctx, creds.Email, creds.Password, UsersCollection)
	if err != nil {
		if errors.Is(err, myerrors.ErrUserNotFound) {
			return nil, fmt.Errorf("check credentials: %w", err)
		} else {
			return nil, fmt.Errorf("error querying database: %w", err)
		}
	}

	user := User{Id: userId, Name: userName, Credentials: creds}
	jsonString, err := json.Marshal(user)
	if err != nil {
		return nil, fmt.Errorf("failed to parse the user: %w", err)
	}

	return jsonString, nil
}
