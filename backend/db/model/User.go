package model

import "encoding/json"

// This struct represents API response of https://api.github.com/applications/%s/token
type UserInfo struct {
	Id          int64                  `json:"id"`
	Url         string                 `json:"url"`
	App         map[string]string      `json:"app"`
	Token       string                 `json:"token"`
	HashedToken string                 `json:"hashed_token"`
	User        map[string]interface{} `json:"user"`
}

// This struct represents User object stored in DynamoDB
type User struct {
	Base
	UserName string
	ID       int64
}

func (in *UserInfo) Stringify() string {
	b, err := json.Marshal(in)
	if err != nil {
		return ""
	}
	return string(b)
}
