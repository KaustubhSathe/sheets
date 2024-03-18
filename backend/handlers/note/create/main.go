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
		dynamo = db.NewDynamo()
	}

	// Now parse body
	body := struct {
		Content       string `json:"Content"`
		SpreadSheetID string `json:"SpreadSheetID"`
		SheetNo       int64  `json:"SheetNo"`
		CellID        string `json:"CellID"`
	}{}
	err = json.Unmarshal([]byte(request.Body), &body)
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
		}, nil
	}

	// Now create a new note in DB
	// PK: spreadsheet id
	// SK: note id
	note, err := dynamo.CreateNote(body.SpreadSheetID, int64(userInfo.User["id"].(float64)), userInfo.User["login"].(string), body.SheetNo, body.CellID, body.Content)
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
		}, err
	}

	var stringified = note.Stringify()

	return events.APIGatewayProxyResponse{
		StatusCode: 200,
		Body:       stringified,
	}, nil
}

func main() {
	lambda.Start(handleRequest)
}
