package main

import (
	"backend-go/config"
	"backend-go/db"
	"context"
	"encoding/json"
	"fmt"
	"io"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
)

var dynamo *db.Dynamo
var redis *db.Redis
var s3Client *s3.S3

// This will be a GET request
func handleRequest(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	spreadsheet_id := request.QueryStringParameters["spreadsheet_id"]

	if dynamo == nil {
		dynamo = db.NewDynamo()
	}

	spreadsheet, err := dynamo.GetSpreadSheet(spreadsheet_id)
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
		}, nil
	}

	// Now also fetch the sheets.json from s3 and append it in response
	sess, _ := session.NewSession(&aws.Config{
		Region: aws.String("ap-south-1"),
	})

	if s3Client == nil {
		s3Client = s3.New(sess)
	}

	sheets, err := s3Client.GetObject(&s3.GetObjectInput{
		Bucket: aws.String(config.SPREADSHEET_BUCKET),
		Key:    aws.String(fmt.Sprintf("SPREADSHEET#%s.json", spreadsheet_id)),
	})
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
		}, err
	}
	defer sheets.Body.Close()

	body, err := io.ReadAll(sheets.Body)
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
		}, err
	}
	err = json.Unmarshal(body, &spreadsheet.Versions)

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
