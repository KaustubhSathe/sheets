package main

import (
	"backend-go/db"
	"backend-go/db/model"
	"backend-go/utils"
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
	note_id := request.QueryStringParameters["note_id"]
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
		dynamo = db.NewDynamo()
	}

	// Now delete the note using spreadsheet ID and noteID from dynamo DB
	err = dynamo.DeleteNote(spreadsheet_id, note_id)
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
		}, nil
	}

	return events.APIGatewayProxyResponse{
		StatusCode: 200,
		Body:       fmt.Sprintf("Note deleted with spreadsheet_id: %s and note_id: %s", spreadsheet_id, note_id),
	}, nil
}

func main() {
	lambda.Start(handleRequest)
}
