package main

import (
	"backend/db"
	"backend/db/model"
	"backend/utils"
	"context"
	"fmt"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

var dynamo *db.Dynamo
var redis *db.Redis

// This will be a DELETE request
func handleRequest(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	// First authenticate the request only after that delete SpreadSheet by id
	access_token := request.Headers["spreadsheet_access_token"]
	spreadsheet_id := request.QueryStringParameters["spreadsheet_id"]
	// Now fetch the user details from redis
	if redis == nil {
		redis = db.NewRedis(ctx)
	}
	user, err := redis.Get(ctx, redis.AuthKey(access_token))
	if err != nil || len(user) == 0 {
		return events.APIGatewayProxyResponse{
			StatusCode: 401,
		}, nil
	}
	userInfo := model.UserInfo{}
	if err = utils.Parse(user, &userInfo); err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
		}, nil
	}

	if dynamo == nil {
		dynamo = db.NewDynamo(ctx)
	}

	// Now delete the spreadsheet using spreadsheet ID from redis first
	err = redis.Delete(ctx, redis.SpreadSheetKey(spreadsheet_id))
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
		}, nil
	}

	// Now delete the spreadsheet using spreadsheet IF from dynamo DB
	_, err = dynamo.DeleteSpreadSheet(spreadsheet_id, &model.User{
		ID: int64(userInfo.User["id"].(float64)),
	})
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
		}, nil
	}

	return events.APIGatewayProxyResponse{
		StatusCode: 200,
		Body:       fmt.Sprintf("Spreadsheet deleted with id: %s", spreadsheet_id),
	}, nil
}

func main() {
	lambda.Start(handleRequest)
}
