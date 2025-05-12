package iam

import (
	"golang.org/x/crypto/bcrypt"
)

func hashPassword(words string) (string, error) {
	hashedBytes, err := bcrypt.GenerateFromPassword([]byte(words), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}

	return string(hashedBytes), nil
}
