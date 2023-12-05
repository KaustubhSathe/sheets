package db

import (
	"backend-go/config"
	"backend-go/db/model"
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
		SpreadSheetTitle: "Untitled spreadsheet",
		Favorited:        false,
		CSVs:             []string{},
		LastOpened:       time.Now(),
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

func (db *Dynamo) DeleteSpreadSheet(spreadsheetID string, user *model.User) (*model.SpreadSheet, error) {
	_, err := db.Client.DeleteItem(&dynamodb.DeleteItemInput{
		TableName: aws.String(config.SPREADSHEETTABLE),
		Key: map[string]*dynamodb.AttributeValue{
			"PK": {
				S: aws.String(db.UserPK(user.ID)),
			},
			"SK": {
				S: aws.String(db.SpreadSheetSK(spreadsheetID)),
			},
		},
	})
	if err != nil {
		return nil, err
	}

	return nil, nil
}

func (db *Dynamo) UpdateSpreadSheetTitle(spreadsheetID string, user *model.User, newTitle string) error {
	_, err := db.Client.UpdateItem(&dynamodb.UpdateItemInput{
		TableName: aws.String(config.SPREADSHEETTABLE),
		Key: map[string]*dynamodb.AttributeValue{
			"PK": {
				S: aws.String(db.UserPK(user.ID)),
			},
			"SK": {
				S: aws.String(db.SpreadSheetSK(spreadsheetID)),
			},
		},
		UpdateExpression: aws.String("set SpreadSheetTitle = :spreadSheetTitle"),
		ExpressionAttributeValues: map[string]*dynamodb.AttributeValue{
			":spreadSheetTitle": {
				S: aws.String(newTitle),
			},
		},
	})
	if err != nil {
		return err
	}

	return nil
}

func (db *Dynamo) GetSpreadSheets(spreadsheetID string, userID int64) ([]*model.SpreadSheet, error) {
	res, err := db.Client.Query(&dynamodb.QueryInput{
		TableName:              aws.String(config.SPREADSHEETTABLE),
		KeyConditionExpression: aws.String("#PK = :pk AND begins_with(#SK, :sk)"),
		ExpressionAttributeValues: map[string]*dynamodb.AttributeValue{
			":pk": {
				S: aws.String(db.UserPK(userID)),
			},
			":sk": {
				S: aws.String(db.SpreadSheetSK(spreadsheetID)),
			},
		},
		ExpressionAttributeNames: map[string]*string{
			"#PK": aws.String("PK"),
			"#SK": aws.String("SK"),
		},
	})
	if err != nil {
		return nil, err
	}
	if res.Items == nil {
		return nil, nil
	}
	spreadsheets := []*model.SpreadSheet{}

	for i := 0; i < len(res.Items); i++ {
		spreadsheet := model.SpreadSheet{}
		err = dynamodbattribute.UnmarshalMap(res.Items[i], &spreadsheet)
		if err != nil {
			return nil, err
		}
		spreadsheets = append(spreadsheets, &spreadsheet)
	}

	return spreadsheets, nil
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
