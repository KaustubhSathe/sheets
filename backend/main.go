package main

import (
	"log"
	"os"

	"github.com/aws/aws-cdk-go/awscdk/v2"
	"github.com/aws/aws-cdk-go/awscdk/v2/awsdynamodb"
	"github.com/aws/aws-cdk-go/awscdk/v2/awsiam"
	"github.com/aws/aws-cdk-go/awscdk/v2/awslambda"
	"github.com/aws/aws-cdk-go/awscdkapigatewayv2alpha/v2"
	"github.com/aws/aws-cdk-go/awscdkapigatewayv2integrationsalpha/v2"
	"github.com/aws/aws-cdk-go/awscdklambdagoalpha/v2"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/constructs-go/constructs/v10"
	"github.com/aws/jsii-runtime-go"
	"github.com/joho/godotenv"
)

func NewSpreadSheetStack(scope constructs.Construct, id string, props *awscdk.StackProps) awscdk.Stack {
	stack := awscdk.NewStack(scope, &id, props)

	// First create required roles for lambda function, AmazonDynamoDBFullAccess and AWSLambdaBasicExecutionRole role
	requiredRoles := awsiam.NewRole(stack, aws.String("requiredRoles"), &awsiam.RoleProps{
		AssumedBy: awsiam.NewServicePrincipal(aws.String("lambda.amazonaws.com"), &awsiam.ServicePrincipalOpts{}),
		ManagedPolicies: &[]awsiam.IManagedPolicy{
			awsiam.ManagedPolicy_FromManagedPolicyArn(stack, aws.String("AmazonDynamoDBFullAccess"), aws.String("arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess")),
			awsiam.ManagedPolicy_FromManagedPolicyArn(stack, aws.String("AWSLambdaBasicExecutionRole"), aws.String("arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole")),
		},
	})

	// Now create a DynamoDB table
	awsdynamodb.NewTable(stack, jsii.String("spreadsheet_db"), &awsdynamodb.TableProps{
		BillingMode: awsdynamodb.BillingMode_PAY_PER_REQUEST,
		TableName:   jsii.String("spreadsheet_db"),
		PartitionKey: &awsdynamodb.Attribute{
			Name: aws.String("PK"),
			Type: awsdynamodb.AttributeType_STRING,
		},
		SortKey: &awsdynamodb.Attribute{
			Name: aws.String("SK"),
			Type: awsdynamodb.AttributeType_STRING,
		},
	})

	// Now create all lambda functions with previously created AmazonDynamoDBFullAccess role
	loginHandler := awscdklambdagoalpha.NewGoFunction(stack, jsii.String("loginHandler"), &awscdklambdagoalpha.GoFunctionProps{
		Runtime: awslambda.Runtime_GO_1_X(),
		Entry:   jsii.String("./handlers/auth/login.go"),
		Bundling: &awscdklambdagoalpha.BundlingOptions{
			GoBuildFlags: jsii.Strings(`-ldflags "-s -w"`),
		},
		Role: requiredRoles,
		Environment: &map[string]*string{
			"GITHUB_CLIENT_ID":     aws.String(os.Getenv("GITHUB_CLIENT_ID")),
			"GITHUB_CLIENT_SECRET": aws.String(os.Getenv("GITHUB_CLIENT_SECRET")),
			"DOMAIN":               aws.String(os.Getenv("DOMAIN")),
		},
	})

	// Now create a HTTP API
	httpApi := awscdkapigatewayv2alpha.NewHttpApi(stack, jsii.String("loginHTTPApi"), &awscdkapigatewayv2alpha.HttpApiProps{
		ApiName: jsii.String("loginHTTPApi"),
	})

	// add route to HTTP API
	httpApi.AddRoutes(&awscdkapigatewayv2alpha.AddRoutesOptions{
		Path:        jsii.String("/api/auth/callback"),
		Methods:     &[]awscdkapigatewayv2alpha.HttpMethod{awscdkapigatewayv2alpha.HttpMethod_GET},
		Integration: awscdkapigatewayv2integrationsalpha.NewHttpLambdaIntegration(jsii.String("MyHttpLambdaIntegration"), loginHandler, &awscdkapigatewayv2integrationsalpha.HttpLambdaIntegrationProps{}),
	})

	// log HTTP API endpoint
	awscdk.NewCfnOutput(stack, jsii.String("myHttpApiEndpoint"), &awscdk.CfnOutputProps{
		Value:       httpApi.ApiEndpoint(),
		Description: jsii.String("HTTP API Endpoint"),
	})

	return stack
}

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	app := awscdk.NewApp(nil)

	NewSpreadSheetStack(app, "SpreadSheetStack", &awscdk.StackProps{
		Env:         env(),
		StackName:   aws.String("spreadsheet-stack"),
		Description: aws.String("AWS stack for spreadsheet application."),
	})

	app.Synth(nil)
}

func env() *awscdk.Environment {
	return &awscdk.Environment{
		Account: aws.String("473539126755"),
		Region:  aws.String("us-east-1"),
	}
}
