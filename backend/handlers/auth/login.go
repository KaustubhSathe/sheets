package main

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"log"
	"os"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
	"gopkg.in/h2non/gentleman.v2"
	"gopkg.in/h2non/gentleman.v2/plugins/body"

	"backend/config"
)

var cli *gentleman.Client = gentleman.New()

type UserInfo struct {
	Id int64 `json:"id"`
	Url string `json:"url"`
	App map[string]string `json:"app"`
	Token string `json:"token"`
	HashedToken string `json:"hashed_token"`
	User map[string]interface{} `json:"user"`
}

type User struct {
	PK string 
	SK string
	UserName string
	ID int64
}

func getAccessToken(code string) (string,error) {
	cli.URL("https://github.com/login/oauth/access_token")
	req := cli.Request()
	req.Method("POST")
	req.AddHeader("Accept", "application/json")
	req.Use(body.JSON(map[string]string{
		"code": code,
		"client_id": os.Getenv("GITHUB_CLIENT_ID"),
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
	if err := json.Unmarshal([]byte(res.String()), &result); err != nil {
		fmt.Println("Error:", err)
		return "", err
	}

	return result.AccessToken, nil
}

func getUserInfo(accessToken string) (*UserInfo,error) {
	cli.URL(fmt.Sprintf("https://api.github.com/applications/%s/token", os.Getenv("GITHUB_CLIENT_ID")))
	req := cli.Request()
	req.Method("POST")
	req.AddHeader("Accept", "application/vnd.github+json")
	req.AddHeader("X-GitHub-Api-Version", "2022-11-28")
	req.AddHeader("Authorization", "Basic " + basicAuth(os.Getenv("GITHUB_CLIENT_ID"), os.Getenv("GITHUB_CLIENT_SECRET")))
	req.Use(body.JSON(map[string]string{
		"access_token": accessToken,
	}))
	res, err := req.Send()
	if err != nil {
		fmt.Printf("Request error: %s\n", err)
		return &UserInfo{}, err
	}

	result := UserInfo{}
    if err := json.Unmarshal([]byte(res.String()), &result); err != nil {
		fmt.Printf("Request error: %s\n", err)
		return &UserInfo{}, err
	}
	
	return &result, nil
}

func saveToDB(userInfo *UserInfo) error {
	sess := session.Must(session.NewSessionWithOptions(session.Options{
		SharedConfigState: session.SharedConfigEnable,
	}))
	svc := dynamodb.New(sess)

	user, err := dynamodbattribute.MarshalMap(User{
		PK: fmt.Sprintf("USER#%d", int64(userInfo.User["id"].(float64))),
		SK: fmt.Sprintf("USER#%d", int64(userInfo.User["id"].(float64))),
		UserName: userInfo.User["login"].(string),
		ID: int64(userInfo.User["id"].(float64)),
	})
	if err != nil {
		log.Fatalf("Got error marshalling new movie item: %s", err)
		return err
	}

	input := &dynamodb.PutItemInput{
		Item:      user,
		TableName: aws.String(config.SPREADSHEETTABLE),
	}

	_, err = svc.PutItem(input)
	if err != nil {
		log.Fatalf("Got error calling PutItem: %s", err)
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

	err = saveToDB(userInfo)
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