package main

import (
	"backend-go/db"
	"backend-go/db/model"
	"backend-go/utils"
	"context"
	"encoding/json"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

var dynamo *db.Dynamo
var redis *db.Redis

// This will be a PATCH request
func handleRequest(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	// First authenticate the request only after that create SpreadSheet
	spreadsheet_access_token := request.Headers["spreadsheet_access_token"]
	// Now fetch the user details from redis
	if redis == nil {
		redis = db.NewRedis(ctx)
	}
	user, err := redis.Get(ctx, redis.AuthKey(spreadsheet_access_token))
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
		dynamo = db.NewDynamo()
	}

	// Now parse body
	body := struct {
		NewTitle      string `json:"NewTitle"`
		SpreadSheetID string `json:"SpreadSheetID"`
	}{}
	err = json.Unmarshal([]byte(request.Body), &body)
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
		}, nil
	}

	// Now update the Spreadsheet item
	err = dynamo.UpdateSpreadSheetTitle(body.SpreadSheetID, &model.User{
		ID: int64(userInfo.User["id"].(float64)),
	}, body.NewTitle)
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
		}, nil
	}

	return events.APIGatewayProxyResponse{
		StatusCode: 200,
	}, nil
}

func main() {
	lambda.Start(handleRequest)
}
