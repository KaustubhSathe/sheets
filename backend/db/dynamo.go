package db

import (
	"backend/config"
	"backend/db/model"
	"context"
	"fmt"
	"log"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
)

type Dynamo struct {
	Client *dynamodb.DynamoDB
}

func NewDynamo(ctx context.Context) *Dynamo {
	return &Dynamo{
		Client: initializeDynamo(ctx),
	}
}

func initializeDynamo(ctx context.Context) *dynamodb.DynamoDB {
	sess := session.Must(session.NewSessionWithOptions(session.Options{
		SharedConfigState: session.SharedConfigEnable,
	}))
	svc := dynamodb.New(sess)

	return svc
}

func (db *Dynamo) CreateUser(userInfo *model.UserInfo) error {
	user, err := dynamodbattribute.MarshalMap(model.User{
		Base: model.Base{
			PK:        db.UserPK(int64(userInfo.User["id"].(float64))),
			SK:        db.UserSK(int64(userInfo.User["id"].(float64))),
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		},
		UserName: userInfo.User["login"].(string),
		ID:       int64(userInfo.User["id"].(float64)),
	})
	if err != nil {
		log.Fatalf("Got error marshalling User: %s", err.Error())
		return err
	}

	input := &dynamodb.PutItemInput{
		Item:      user,
		TableName: aws.String(config.SPREADSHEETTABLE),
	}

	_, err = db.Client.PutItem(input)
	if err != nil {
		log.Fatalf("Got error calling PutItem: %s", err)
		return err
	}

	return nil
}

func (db *Dynamo) CreateSpreadSheet(spreadsheetID string, user *model.User) (*model.SpreadSheet, error) {
	ss := &model.SpreadSheet{
		Base: model.Base{
			PK:        db.UserPK(user.ID),
			SK:        db.SpreadSheetSK(spreadsheetID),
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		},
		UserName:         user.UserName,
		UserID:           user.ID,
		SpreadSheetTitle: "",
		Favorited:        false,
		CSVs:             []string{},
	}
	spreadsheet, err := dynamodbattribute.MarshalMap(ss)
	if err != nil {
		return nil, err
	}

	_, err = db.Client.BatchWriteItem(&dynamodb.BatchWriteItemInput{
		RequestItems: map[string][]*dynamodb.WriteRequest{
			config.SPREADSHEETTABLE: {
				{
					PutRequest: &dynamodb.PutRequest{
						Item: spreadsheet,
					},
				},
			},
		},
	})
	if err != nil {
		return nil, err
	}

	return ss, nil
}

func (db *Dynamo) GetSpreadSheet(spreadsheetID string, userID int64) (*model.SpreadSheet, error) {
	res, err := db.Client.GetItem(&dynamodb.GetItemInput{
		TableName: aws.String(config.SPREADSHEETTABLE),
		Key: map[string]*dynamodb.AttributeValue{
			"PK": {
				S: aws.String(db.UserPK(userID)),
			},
			"SK": {
				S: aws.String(db.SpreadSheetSK(spreadsheetID)),
			},
		},
	})
	if err != nil {
		return nil, err
	}
	if res.Item == nil {
		return nil, nil
	}
	spreadsheet := model.SpreadSheet{}
	err = dynamodbattribute.UnmarshalMap(res.Item, &spreadsheet)
	if err != nil {
		return nil, err
	}

	return &spreadsheet, nil
}

func (db *Dynamo) UserPK(userID int64) string {
	return fmt.Sprintf("USER#%d", userID)
}

func (db *Dynamo) UserSK(userID int64) string {
	return fmt.Sprintf("USER#%d", userID)
}

func (db *Dynamo) SpreadSheetPK(spreadsheetID string) string {
	return fmt.Sprintf("SPREADSHEET#%s", spreadsheetID)
}

func (db *Dynamo) SpreadSheetSK(spreadsheetID string) string {
	return fmt.Sprintf("SPREADSHEET#%s", spreadsheetID)
}
