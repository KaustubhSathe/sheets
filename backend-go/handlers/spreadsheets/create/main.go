package main

import (
	"backend-go/config"
	"backend-go/db"
	"backend-go/db/model"
	"backend-go/utils"
	"bytes"
	"context"
	"fmt"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/google/uuid"
)

var dynamo *db.Dynamo
var redis *db.Redis
var s3Client *s3.S3

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

	// Now also create the sheets.json file in S3 bucket
	sess, _ := session.NewSession(&aws.Config{
		Region: aws.String("ap-south-1"),
	})

	if s3Client == nil {
		s3Client = s3.New(sess)
	}

	_, err = s3Client.PutObject(&s3.PutObjectInput{
		Bucket:      aws.String(config.SPREADSHEET_BUCKET),
		Key:         aws.String(fmt.Sprintf("USER#%d#SPREADSHEET#%s.json", int64(userInfo.User["id"].(float64)), spreadSheetID)),
		ContentType: aws.String("application/json"),
		Body:        bytes.NewReader([]byte("[{\r\n    \"SheetName\": \"Sheet 1\",\r\n    \"SheetIndex\": 1,\r\n\t\"State\":      {}\r\n}]\r\n")),
	})
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
		}, err
	}

	spreadsheet.Sheets = []model.Sheet{
		{
			SheetName: "Sheet 1",
			State:     make(map[string]model.State),
		},
	}

	var stringified = spreadsheet.Stringify()
	// Now store the SpreadSheet object in Redis
	err = redis.Set(ctx, redis.SpreadSheetKey(spreadSheetID), stringified)
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
		}, err
	}

	return events.APIGatewayProxyResponse{
		StatusCode: 200,
		Body:       stringified,
	}, nil
}

func main() {
	lambda.Start(handleRequest)
}
