package main

import (
	"backend-go/db"
	"backend-go/db/model"
	"backend-go/utils"
	"context"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

func handleRequest(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	body := struct {
		AccessToken string `json:"access_token"`
	}{}
	// First extract the access token from body
	if err := utils.Parse(request.Body, &body); err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: 422,
			Body: utils.Stringify(map[string]interface{}{
				"Reponse": "Missing Parameters",
			}),
		}, err
	}

	var redis *db.Redis
	if redis == nil {
		redis = db.NewRedis(ctx)
	}

	// Now check in redis whether this access token exisits
	// If yes then that means the access token is valid
	// If not then that means either the value stored in redis has expired
	// or the provided access token is invalid, in both cases
	// check the validity of the token by making a Github API call
	// if valid then set the value again in redis
	// if not valid send error that the user needs to login again
	resp, err := redis.Get(ctx, redis.AuthKey(body.AccessToken))
	if resp == "" || err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: 401,
		}, nil
	}

	userInfo := &model.UserInfo{}
	err = utils.Parse(resp, &userInfo)
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
		}, nil
	}

	return events.APIGatewayProxyResponse{
		StatusCode: 200,
		Body:       utils.Stringify(userInfo.User),
	}, nil
}

func main() {
	lambda.Start(handleRequest)
}
