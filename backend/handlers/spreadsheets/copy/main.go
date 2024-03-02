package main

import (
	"backend-go/db"
	"backend-go/db/model"
	"backend-go/utils"
	"context"
	"encoding/json"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/google/uuid"
)

var dynamo *db.Dynamo
var redis *db.Redis

// This will be a POST request
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
		dynamo = db.NewDynamo(ctx)
	}

	// Now parse body
	body := struct {
		SpreadSheetTitle string          `json:"SpreadSheetTitle"`
		Favorited        bool            `json:"Favorited"`
		Versions         []model.Version `json:"Versions"`
	}{}
	err = json.Unmarshal([]byte(request.Body), &body)
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
		}, nil
	}

	// Now create a copy of SpreadSheet object in DB
	spreadSheetID := uuid.NewString()
	spreadsheet, err := dynamo.CopySpreadSheet(&model.SpreadSheet{
		Base: model.Base{
			SK: dynamo.SpreadSheetSK(spreadSheetID),
		},
		SpreadSheetTitle: body.SpreadSheetTitle,
		Favorited:        body.Favorited,
		Versions:         body.Versions,
	}, &model.User{
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
		Body:       spreadsheet.Stringify(),
	}, nil
}

func main() {
	lambda.Start(handleRequest)
}
