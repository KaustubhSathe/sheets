package main

import (
	"context"
	"encoding/base64"
	"fmt"
	"os"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"gopkg.in/h2non/gentleman.v2"
	"gopkg.in/h2non/gentleman.v2/plugins/body"

	"backend-go/db"
	"backend-go/db/model"
	"backend-go/utils"
)

var cli *gentleman.Client = gentleman.New()
var redis *db.Redis
var dynamo *db.Dynamo

func getAccessToken(code string) (string, error) {
	cli.URL("https://github.com/login/oauth/access_token")
	req := cli.Request()
	req.Method("POST")
	req.AddHeader("Accept", "application/json")
	req.Use(body.JSON(map[string]string{
		"code":          code,
		"client_id":     os.Getenv("GITHUB_CLIENT_ID"),
		"client_secret": os.Getenv("GITHUB_CLIENT_SECRET"),
	}))
	res, err := req.Send()
	if err != nil {
		fmt.Printf("Request error: %s\n", err)
		return "", err
	}

	// Decode the JSON response
	var result struct {
		AccessToken string `json:"access_token"`
		TokenType   string `json:"token_type"`
		Scope       string `json:"scope"`
	}
	if err := utils.Parse(res.String(), &result); err != nil {
		fmt.Println("Error:", err)
		return "", err
	}

	return result.AccessToken, nil
}

func getUserInfo(accessToken string) (*model.UserInfo, error) {
	cli.URL(fmt.Sprintf("https://api.github.com/applications/%s/token", os.Getenv("GITHUB_CLIENT_ID")))
	req := cli.Request()
	req.Method("POST")
	req.AddHeader("Accept", "application/vnd.github+json")
	req.AddHeader("X-GitHub-Api-Version", "2022-11-28")
	req.AddHeader("Authorization", "Basic "+basicAuth(os.Getenv("GITHUB_CLIENT_ID"), os.Getenv("GITHUB_CLIENT_SECRET")))
	req.Use(body.JSON(map[string]string{
		"access_token": accessToken,
	}))
	res, err := req.Send()
	if err != nil {
		fmt.Printf("Request error: %s\n", err)
		return &model.UserInfo{}, err
	}

	result := model.UserInfo{}
	if err := utils.Parse(res.String(), &result); err != nil {
		fmt.Printf("Request error: %s\n", err)
		return &model.UserInfo{}, err
	}

	return &result, nil
}

func saveUserToDB(ctx context.Context, userInfo *model.UserInfo) error {
	if dynamo == nil {
		dynamo = db.NewDynamo()
	}

	// Now create a User object in DB
	err := dynamo.CreateUser(userInfo)
	if err != nil {
		return err
	}

	return nil
}

func saveToCache(ctx context.Context, access_token string, userInfo *model.UserInfo) error {
	if redis == nil {
		redis = db.NewRedis(ctx)
	}
	key := redis.AuthKey(access_token)
	value := userInfo.Stringify()

	err := redis.Set(ctx, key, value)
	if err != nil {
		return err
	}

	return nil
}

func handleRequest(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	// First get the code from query string parameters
	code := request.QueryStringParameters["code"]

	accessToken, err := getAccessToken(code)
	if err != nil {
		return events.APIGatewayProxyResponse{}, err
	}

	userInfo, err := getUserInfo(accessToken)
	if err != nil {
		return events.APIGatewayProxyResponse{}, err
	}

	err = saveUserToDB(ctx, userInfo)
	if err != nil {
		return events.APIGatewayProxyResponse{}, err
	}

	// Now also save the user info to redis cache
	err = saveToCache(ctx, accessToken, userInfo)
	if err != nil {
		return events.APIGatewayProxyResponse{}, err
	}

	return events.APIGatewayProxyResponse{
		StatusCode: 301,
		Headers: map[string]string{
			"Location": fmt.Sprintf("%s/spreadsheets?access_token=%s", os.Getenv("DOMAIN"), accessToken),
		},
	}, nil
}

// Helper function to create a Basic Authentication header value
func basicAuth(username, password string) string {
	auth := username + ":" + password
	return base64.StdEncoding.EncodeToString([]byte(auth))
}

func main() {
	lambda.Start(handleRequest)
}
