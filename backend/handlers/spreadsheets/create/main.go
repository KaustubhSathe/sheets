package main

import (
	"backend/db"
	"backend/db/model"
	"backend/utils"
	"context"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/google/uuid"
)

var dynamo *db.Dynamo
var redis *db.Redis

// This will be a POST request with only access token as body param
func handleRequest(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	// First authenticate the request only after that create SpreadSheet
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
	// Now fetch the user details from redis
	if redis == nil {
		redis = db.NewRedis(ctx)
	}
	user, err := redis.Get(ctx, redis.AuthKey(body.AccessToken))
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: 401,
		}, nil
	}
	userInfo := &model.UserInfo{}
	err = utils.Parse(user, &userInfo)
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
		}, nil
	}

	if dynamo == nil {
		dynamo = db.NewDynamo(ctx)
	}

	// Now create a SpreadSheet object in DB
	spreadSheetID := uuid.NewString()
	spreadsheet, err := dynamo.CreateSpreadSheet(spreadSheetID, &model.User{
		ID:       int64(userInfo.User["id"].(float64)),
		UserName: userInfo.User["login"].(string),
	})
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
		}, err
	}

	// Now store the SpreadSheet object in Redis
	err = redis.Set(ctx, redis.SpreadSheetKey(spreadSheetID), spreadsheet.Stringify())
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
		}, err
	}

	return events.APIGatewayProxyResponse{
		StatusCode: 200,
		Body: spreadsheet.Stringify(),
	}, nil
}

func main() {
	lambda.Start(handleRequest)
}
