package myerrors

import "errors"

var ErrUserNotFound = errors.New("user is not found")

var ErrUserAlreadyExists = errors.New("user already exists")

type ErrorResponse struct {
	Type    string `json:"type"`
	Message string `json:"message"`
}
