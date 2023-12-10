package main

import (
	"log"
	"os"

	"github.com/aws/aws-cdk-go/awscdk/v2"
	"github.com/aws/aws-cdk-go/awscdk/v2/awsdynamodb"
	"github.com/aws/aws-cdk-go/awscdk/v2/awsiam"
	"github.com/aws/aws-cdk-go/awscdk/v2/awslambda"
	"github.com/aws/aws-cdk-go/awscdk/v2/awss3assets"
	"github.com/aws/aws-cdk-go/awscdkapigatewayv2alpha/v2"
	"github.com/aws/aws-cdk-go/awscdkapigatewayv2integrationsalpha/v2"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/constructs-go/constructs/v10"
	"github.com/aws/jsii-runtime-go"
	"github.com/joho/godotenv"
)

type Lambdas struct {
	CallbackHandler               awslambda.Function
	AuthenticateHandler           awslambda.Function
	CreateSpreadSheetHandler      awslambda.Function
	GetSpreadSheetHandler         awslambda.Function
	DeleteSpreadSheetHandler      awslambda.Function
	UpdateSpreadSheetTitleHandler awslambda.Function
}

func CreateDynamoTable(stack awscdk.Stack) {
	awsdynamodb.NewTable(stack, jsii.String("spreadsheet_db_rust"), &awsdynamodb.TableProps{
		BillingMode: awsdynamodb.BillingMode_PAY_PER_REQUEST,
		TableName:   jsii.String("spreadsheet_db_rust"),
		PartitionKey: &awsdynamodb.Attribute{
			Name: aws.String("PK"),
			Type: awsdynamodb.AttributeType_STRING,
		},
		SortKey: &awsdynamodb.Attribute{
			Name: aws.String("SK"),
			Type: awsdynamodb.AttributeType_STRING,
		},
	})
}

func CreateLambdas(stack awscdk.Stack) *Lambdas {
	// First create required roles for lambda function, AmazonDynamoDBFullAccess and AWSLambdaBasicExecutionRole role
	requiredRoles := awsiam.NewRole(stack, aws.String("requiredRoles"), &awsiam.RoleProps{
		AssumedBy: awsiam.NewServicePrincipal(aws.String("lambda.amazonaws.com"), &awsiam.ServicePrincipalOpts{}),
		ManagedPolicies: &[]awsiam.IManagedPolicy{
			awsiam.ManagedPolicy_FromManagedPolicyArn(stack, aws.String("AmazonDynamoDBFullAccess"), aws.String("arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess")),
			awsiam.ManagedPolicy_FromManagedPolicyArn(stack, aws.String("AWSLambdaBasicExecutionRole"), aws.String("arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole")),
		},
	})

	envs := &map[string]*string{
		"GITHUB_CLIENT_ID":     aws.String(os.Getenv("GITHUB_CLIENT_ID")),
		"GITHUB_CLIENT_SECRET": aws.String(os.Getenv("GITHUB_CLIENT_SECRET")),
		"DOMAIN":               aws.String(os.Getenv("DOMAIN")),
		"MOMENTO_AUTH_TOKEN":   aws.String(os.Getenv("MOMENTO_AUTH_TOKEN")),
	}

	// Now create all lambda functions with previously created AmazonDynamoDBFullAccess role
	// callbackHandler := awslambda.NewFunction(stack, jsii.String("callbackHandler"), &awslambda.FunctionProps{
	// 	Runtime:      awslambda.Runtime_PROVIDED_AL2(),
	// 	Role:         requiredRoles,
	// 	Environment:  envs,
	// 	Architecture: awslambda.Architecture_ARM_64(),
	// 	Code:         awslambda.AssetCode_FromAsset(aws.String("./target/lambda/spreadsheet-get/bootstrap.zip"), &awss3assets.AssetOptions{}),
	// })

	// authenticateHandler := awslambda.NewFunction(stack, jsii.String("authenticateHandler"), &awslambda.FunctionProps{
	// 	Runtime: awslambda.Runtime_PROVIDED_AL2(),
	// 	Role:         requiredRoles,
	// 	Environment:  envs,
	// 	Architecture: awslambda.Architecture_ARM_64(),
	// 	Code: awslambda.AssetCode_FromAsset(aws.String("./target/lambda/spreadsheet-get/bootstrap.zip"), &awss3assets.AssetOptions{}),
	// })

	// createSpreadSheetHandler := awscdklambdagoalpha.NewGoFunction(stack, jsii.String("createSpreadSheetHandler"), &awscdklambdagoalpha.GoFunctionProps{
	// 	Runtime: awslambda.Runtime_PROVIDED_AL2(),
	// 	Entry:   jsii.String("./handlers/spreadsheets/create"),
	// 	Bundling: &awscdklambdagoalpha.BundlingOptions{
	// 		GoBuildFlags: jsii.Strings(`-ldflags "-s -w"`),
	// 	},
	// 	Role:         requiredRoles,
	// 	Environment:  envs,
	// 	Architecture: awslambda.Architecture_ARM_64(),
	// })

	getSpreadSheetHandler := awslambda.NewFunction(stack, jsii.String("getSpreadSheetHandler"), &awslambda.FunctionProps{
		Runtime:      awslambda.Runtime_PROVIDED_AL2(),
		Role:         requiredRoles,
		Environment:  envs,
		Architecture: awslambda.Architecture_ARM_64(),
		Code:         awslambda.AssetCode_FromAsset(jsii.String("./target/lambda/spreadsheet_get/bootstrap.zip"), &awss3assets.AssetOptions{}),
		Handler:      aws.String("getSpreadSheetHandler"),
		FunctionName: aws.String("getSpreadSheetHandler"),
	})

	// deleteSpreadSheetHandler := awscdklambdagoalpha.NewGoFunction(stack, jsii.String("deleteSpreadSheetHandler"), &awscdklambdagoalpha.GoFunctionProps{
	// 	Runtime: awslambda.Runtime_PROVIDED_AL2(),
	// 	Entry:   jsii.String("./handlers/spreadsheets/delete"),
	// 	Bundling: &awscdklambdagoalpha.BundlingOptions{
	// 		GoBuildFlags: jsii.Strings(`-ldflags "-s -w"`),
	// 	},
	// 	Role:         requiredRoles,
	// 	Environment:  envs,
	// 	Architecture: awslambda.Architecture_ARM_64(),
	// })

	// updateSpreadSheetTitleHandler := awscdklambdagoalpha.NewGoFunction(stack, jsii.String("updateSpreadSheetTitleHandler"), &awscdklambdagoalpha.GoFunctionProps{
	// 	Runtime: awslambda.Runtime_PROVIDED_AL2(),
	// 	Entry:   jsii.String("./handlers/spreadsheets/update_title"),
	// 	Bundling: &awscdklambdagoalpha.BundlingOptions{
	// 		GoBuildFlags: jsii.Strings(`-ldflags "-s -w"`),
	// 	},
	// 	Role:         requiredRoles,
	// 	Environment:  envs,
	// 	Architecture: awslambda.Architecture_ARM_64(),
	// })

	return &Lambdas{
		// CallbackHandler:               callbackHandler,
		// AuthenticateHandler:           authenticateHandler,
		// CreateSpreadSheetHandler:      createSpreadSheetHandler,
		GetSpreadSheetHandler: getSpreadSheetHandler,
		// DeleteSpreadSheetHandler:      deleteSpreadSheetHandler,
		// UpdateSpreadSheetTitleHandler: updateSpreadSheetTitleHandler,
	}
}

func CreateHTTPApi(stack awscdk.Stack, lambdas *Lambdas) awscdkapigatewayv2alpha.HttpApi {
	spreadsheetApi := awscdkapigatewayv2alpha.NewHttpApi(stack, jsii.String("SpreadSheetHTTPApi"), &awscdkapigatewayv2alpha.HttpApiProps{
		ApiName: jsii.String("SpreadSheetHTTPApi"),
		CorsPreflight: &awscdkapigatewayv2alpha.CorsPreflightOptions{
			AllowCredentials: aws.Bool(true),
			AllowOrigins: &[]*string{
				aws.String("https://spreadsheet-clone.vercel.app"),
				aws.String("http://localhost:3000"),
			},
			MaxAge: awscdk.Duration_Minutes(aws.Float64(300)),
			AllowMethods: &[]awscdkapigatewayv2alpha.CorsHttpMethod{
				awscdkapigatewayv2alpha.CorsHttpMethod_DELETE,
				awscdkapigatewayv2alpha.CorsHttpMethod_GET,
				awscdkapigatewayv2alpha.CorsHttpMethod_PUT,
				awscdkapigatewayv2alpha.CorsHttpMethod_POST,
				awscdkapigatewayv2alpha.CorsHttpMethod_PATCH,
				awscdkapigatewayv2alpha.CorsHttpMethod_ANY,
				awscdkapigatewayv2alpha.CorsHttpMethod_OPTIONS,
			},
			AllowHeaders: &[]*string{
				aws.String("Authorization"),
				aws.String("*"),
				aws.String("spreadsheet_access_token"),
			},
		},
	})

	// callback API
	// spreadsheetApi.AddRoutes(&awscdkapigatewayv2alpha.AddRoutesOptions{
	// 	Path:        jsii.String("/api/auth/callback"),
	// 	Methods:     &[]awscdkapigatewayv2alpha.HttpMethod{awscdkapigatewayv2alpha.HttpMethod_GET},
	// 	Integration: awscdkapigatewayv2integrationsalpha.NewHttpLambdaIntegration(jsii.String("SpreadSheetHttpLambdaIntegration"), lambdas.CallbackHandler, &awscdkapigatewayv2integrationsalpha.HttpLambdaIntegrationProps{}),
	// })

	// // authenticate API
	// spreadsheetApi.AddRoutes(&awscdkapigatewayv2alpha.AddRoutesOptions{
	// 	Path:        jsii.String("/api/auth/authenticate"),
	// 	Methods:     &[]awscdkapigatewayv2alpha.HttpMethod{awscdkapigatewayv2alpha.HttpMethod_POST},
	// 	Integration: awscdkapigatewayv2integrationsalpha.NewHttpLambdaIntegration(jsii.String("SpreadSheetHttpLambdaIntegration"), lambdas.AuthenticateHandler, &awscdkapigatewayv2integrationsalpha.HttpLambdaIntegrationProps{}),
	// })

	// // Create Spreadsheet API
	// spreadsheetApi.AddRoutes(&awscdkapigatewayv2alpha.AddRoutesOptions{
	// 	Path:        jsii.String("/api/spreadsheet"),
	// 	Methods:     &[]awscdkapigatewayv2alpha.HttpMethod{awscdkapigatewayv2alpha.HttpMethod_POST},
	// 	Integration: awscdkapigatewayv2integrationsalpha.NewHttpLambdaIntegration(jsii.String("SpreadSheetHttpLambdaIntegration"), lambdas.CreateSpreadSheetHandler, &awscdkapigatewayv2integrationsalpha.HttpLambdaIntegrationProps{}),
	// })

	// Get Spreadsheet API
	spreadsheetApi.AddRoutes(&awscdkapigatewayv2alpha.AddRoutesOptions{
		Path:        jsii.String("/api/spreadsheet"),
		Methods:     &[]awscdkapigatewayv2alpha.HttpMethod{awscdkapigatewayv2alpha.HttpMethod_GET},
		Integration: awscdkapigatewayv2integrationsalpha.NewHttpLambdaIntegration(jsii.String("SpreadSheetHttpLambdaIntegration"), lambdas.GetSpreadSheetHandler, &awscdkapigatewayv2integrationsalpha.HttpLambdaIntegrationProps{}),
	})

	// Delete Spreadsheet API
	// spreadsheetApi.AddRoutes(&awscdkapigatewayv2alpha.AddRoutesOptions{
	// 	Path:        jsii.String("/api/spreadsheet"),
	// 	Methods:     &[]awscdkapigatewayv2alpha.HttpMethod{awscdkapigatewayv2alpha.HttpMethod_DELETE},
	// 	Integration: awscdkapigatewayv2integrationsalpha.NewHttpLambdaIntegration(jsii.String("SpreadSheetHttpLambdaIntegration"), lambdas.DeleteSpreadSheetHandler, &awscdkapigatewayv2integrationsalpha.HttpLambdaIntegrationProps{}),
	// })

	// // Update SpreadsheetTitle API
	// spreadsheetApi.AddRoutes(&awscdkapigatewayv2alpha.AddRoutesOptions{
	// 	Path:        jsii.String("/api/spreadsheet_title"),
	// 	Methods:     &[]awscdkapigatewayv2alpha.HttpMethod{awscdkapigatewayv2alpha.HttpMethod_PATCH},
	// 	Integration: awscdkapigatewayv2integrationsalpha.NewHttpLambdaIntegration(jsii.String("SpreadSheetHttpLambdaIntegration"), lambdas.UpdateSpreadSheetTitleHandler, &awscdkapigatewayv2integrationsalpha.HttpLambdaIntegrationProps{}),
	// })

	return spreadsheetApi
}

func NewSpreadSheetRustStack(scope constructs.Construct, id *string, props *awscdk.StackProps) awscdk.Stack {
	stack := awscdk.NewStack(scope, id, props)

	// Now create a DynamoDB table
	CreateDynamoTable(stack)

	// Now create all lambdas
	lambdas := CreateLambdas(stack)

	// Now create a HTTP API
	spreadSheetApi := CreateHTTPApi(stack, lambdas)

	// log HTTP API endpoint
	awscdk.NewCfnOutput(stack, jsii.String("SpreadSheetApiEndpoint"), &awscdk.CfnOutputProps{
		Value:       spreadSheetApi.ApiEndpoint(),
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

	NewSpreadSheetRustStack(app, aws.String("SpreadSheetRustStack"), &awscdk.StackProps{
		Env:         env(),
		StackName:   aws.String("spreadsheet-rust-stack"),
		Description: aws.String("AWS rust stack for spreadsheet application."),
	})

	app.Synth(nil)
}

func env() *awscdk.Environment {
	return &awscdk.Environment{
		Account: aws.String("473539126755"),
		Region:  aws.String("ap-south-1"),
	}
}
