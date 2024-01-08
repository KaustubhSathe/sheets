package main

import (
	"backend-go/config"
	"backend-go/db"
	"backend-go/db/model"
	"backend-go/utils"
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
		spreadsheets, err := dynamo.GetSpreadSheets(spreadsheet_id, int64(userInfo.User["id"].(float64)))
		if err != nil {
			return events.APIGatewayProxyResponse{
				StatusCode: 500,
			}, nil
		}

		for _, v := range spreadsheets {
			// also set the spreadsheet object in redis
			err = redis.Set(ctx, v.Base.SK, v.Stringify())
			if err != nil {
				return events.APIGatewayProxyResponse{
					StatusCode: 500,
				}, nil
			}
		}

		return events.APIGatewayProxyResponse{
			StatusCode: 200,
			Body:       model.StringifySpreadSheets(spreadsheets),
		}, nil
	}

	spreadsheet := model.SpreadSheet{}
	if err = utils.Parse(res, &spreadsheet); err != nil {
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
		Key:    aws.String(fmt.Sprintf("USER#%d#SPREADSHEET#%s.json", int64(userInfo.User["id"].(float64)), spreadsheet_id)),
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
	err = json.Unmarshal(body, &spreadsheet.Sheets)

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
