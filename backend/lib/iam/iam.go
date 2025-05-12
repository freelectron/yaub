package iam

import (
	"backend/alog"
	"backend/lib/mongodb"
	"backend/lib/myerrors"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"go.mongodb.org/mongo-driver/bson"
	"io"
)

const UsersCollection = "registered_users"

type Credentials struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type User struct {
	ID          string      `bson:"_id" json:"_id"`
	Name        string      `json:"name"`
	Credentials Credentials `json:"credentials"`
}

func getCredsFromRequestBody(signInRequestBody io.ReadCloser) (Credentials, error) {
	var creds Credentials
	err := json.NewDecoder(signInRequestBody).Decode(&creds)
	if err != nil {
		return Credentials{}, fmt.Errorf("decoding singin request body: %w", err)
	}
	creds.Password, err = hashPassword(creds.Password)
	if err != nil {
		return Credentials{}, fmt.Errorf("processing the password: %w", err)
	}

	return creds, nil
}

func getUserFromRequestBody(signInRequestBody io.ReadCloser) (User, error) {
	var newUser User
	err := json.NewDecoder(signInRequestBody).Decode(&newUser)
	if err != nil {
		return User{}, fmt.Errorf("decoding sign up request body: %w", err)
	}

	newUser.Credentials.Password, err = hashPassword(newUser.Credentials.Password)
	if err != nil {
		return User{}, fmt.Errorf("processing the password: %w", err)
	}

	return newUser, nil
}

func SignIn(ctx context.Context, dbClient mongodb.Client, signInRequestBody io.ReadCloser) ([]byte, error) {
	creds, err := getCredsFromRequestBody(signInRequestBody)
	if err != nil {
		return nil, fmt.Errorf("getting credentials from request body: %w", err)
	}

	// Filter to find a single user by email
	filter := bson.D{{"credentials.email", creds.Email}}
	userBytes, err := dbClient.GetOneWithFilter(ctx, filter, UsersCollection)
	if err != nil {
		if errors.Is(err, myerrors.ErrUserNotFound) {
			return nil, fmt.Errorf("check credentials: %w", err)
		} else {
			return nil, fmt.Errorf("error querying database: %w", err)
		}
	}

	return userBytes, nil
}

func SignUp(ctx context.Context, dbClient mongodb.Client, signInRequestBody io.ReadCloser) error {
	newUser, err := getUserFromRequestBody(signInRequestBody)
	if err != nil {
		return fmt.Errorf("creating user from sign up request body: %w", err)
	}

	alog.Info(ctx, "Creating a database entry for user user %s, %s", newUser.Name, newUser.Credentials.Email)
	err = dbClient.CreateDoc(ctx, newUser, UsersCollection)
	if err != nil {
		return fmt.Errorf("error creating use in database: %w", err)
	}

	return nil
}
