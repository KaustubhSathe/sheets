package main

import (
	"backend-go/config"
	"backend-go/db"
	"backend-go/db/model"
	"backend-go/utils"
	"bytes"
	"context"
	"encoding/json"
	"fmt"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
)

var dynamo *db.Dynamo
var redis *db.Redis
var s3Client *s3.S3

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
		Versions      []model.Version `json:"Versions"`
		SpreadSheetID string          `json:"SpreadSheetID"`
	}{}
	err = json.Unmarshal([]byte(request.Body), &body)
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
		}, nil
	}

	sess, _ := session.NewSession(&aws.Config{
		Region: aws.String("ap-south-1"),
	})

	if s3Client == nil {
		s3Client = s3.New(sess)
	}

	// Now delete the old sheet.json from s3 and add the new one which is present in request body
	sheets, err := json.Marshal(body.Versions)
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
		}, nil
	}

	_, err = s3Client.PutObject(&s3.PutObjectInput{
		Bucket:      aws.String(config.SPREADSHEET_BUCKET),
		Key:         aws.String(fmt.Sprintf("SPREADSHEET#%s.json", body.SpreadSheetID)),
		ContentType: aws.String("application/json"),
		Body:        bytes.NewReader(sheets),
	})

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
