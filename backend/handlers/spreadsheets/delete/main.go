package main

import (
	"backend/db"
	"backend/db/model"
	"backend/utils"
	"context"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

var dynamo *db.Dynamo
var redis *db.Redis

// This will be a GET request
func handleRequest(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	// First authenticate the request only after that create SpreadSheet
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

	// Now first check for spreadsheet in redis, if not present in redis fetch from DB
	res, err := redis.Get(ctx, redis.SpreadSheetKey(spreadsheet_id))
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
		}, nil
	}

	if res == "" {
		// means fetch from DB
		spreadsheet, err := dynamo.GetSpreadSheet(spreadsheet_id, int64(userInfo.User["id"].(float64)))
		if err != nil {
			return events.APIGatewayProxyResponse{
				StatusCode: 500,
			}, nil
		}

		// also set the spreadsheet object in redis
		err = redis.Set(ctx, redis.SpreadSheetKey(spreadsheet_id), spreadsheet.Stringify())
		if err != nil {
			return events.APIGatewayProxyResponse{
				StatusCode: 500,
			}, nil
		}

		return events.APIGatewayProxyResponse{
			StatusCode: 200,
			Body:       spreadsheet.Stringify(),
		}, nil
	}

	spreadsheet := model.SpreadSheet{}
	if err = utils.Parse(res, &spreadsheet); err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
		}, nil
	}

	return events.APIGatewayProxyResponse{
		StatusCode: 200,
		Body:       spreadsheet.Stringify(),
	}, nil
}

func main() {
	lambda.Start(handleRequest)
}
