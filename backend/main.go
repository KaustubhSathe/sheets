package main

import (
	"log"
	"os"

	"github.com/aws/aws-cdk-go/awscdk/v2"
	"github.com/aws/aws-cdk-go/awscdk/v2/awsdynamodb"
	"github.com/aws/aws-cdk-go/awscdk/v2/awsiam"
	"github.com/aws/aws-cdk-go/awscdk/v2/awslambda"
	"github.com/aws/aws-cdk-go/awscdk/v2/awss3"
	"github.com/aws/aws-cdk-go/awscdkapigatewayv2alpha/v2"
	"github.com/aws/aws-cdk-go/awscdkapigatewayv2integrationsalpha/v2"
	"github.com/aws/aws-cdk-go/awscdklambdagoalpha/v2"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/constructs-go/constructs/v10"
	"github.com/aws/jsii-runtime-go"
	"github.com/joho/godotenv"
)

type Lambdas struct {
	CallbackHandler               awscdklambdagoalpha.GoFunction
	AuthenticateHandler           awscdklambdagoalpha.GoFunction
	CreateSpreadSheetHandler      awscdklambdagoalpha.GoFunction
	GetSpreadSheetHandler         awscdklambdagoalpha.GoFunction
	DeleteSpreadSheetHandler      awscdklambdagoalpha.GoFunction
	UpdateSpreadSheetTitleHandler awscdklambdagoalpha.GoFunction
	UpdateSheetsHandler           awscdklambdagoalpha.GoFunction
	CopySpreadSheetHandler        awscdklambdagoalpha.GoFunction
	CreateCommentHandler          awscdklambdagoalpha.GoFunction
	GetCommentsHandler            awscdklambdagoalpha.GoFunction
	DeleteCommentHandler          awscdklambdagoalpha.GoFunction
	UpdateCommentHandler          awscdklambdagoalpha.GoFunction
	CreateNoteHandler             awscdklambdagoalpha.GoFunction
	GetNotesHandler               awscdklambdagoalpha.GoFunction
	DeleteNoteHandler             awscdklambdagoalpha.GoFunction
	UpdateNoteHandler             awscdklambdagoalpha.GoFunction
	ShareSpreadSheetHandler       awscdklambdagoalpha.GoFunction
}

func CreateDynamoTable(stack awscdk.Stack) {
	awsdynamodb.NewTable(stack, jsii.String("spreadsheet_db_go"), &awsdynamodb.TableProps{
		BillingMode: awsdynamodb.BillingMode_PAY_PER_REQUEST,
		TableName:   jsii.String("spreadsheet_db_go"),
		PartitionKey: &awsdynamodb.Attribute{
			Name: aws.String("PK"),
			Type: awsdynamodb.AttributeType_STRING,
		},
		SortKey: &awsdynamodb.Attribute{
			Name: aws.String("SK"),
			Type: awsdynamodb.AttributeType_STRING,
		},
		RemovalPolicy: awscdk.RemovalPolicy_DESTROY,
	})
}

func CreateLambdas(stack awscdk.Stack) *Lambdas {
	// First create required roles for lambda function, AmazonDynamoDBFullAccess and AWSLambdaBasicExecutionRole role
	requiredRoles := awsiam.NewRole(stack, aws.String("requiredRoles"), &awsiam.RoleProps{
		AssumedBy: awsiam.NewServicePrincipal(aws.String("lambda.amazonaws.com"), &awsiam.ServicePrincipalOpts{}),
		ManagedPolicies: &[]awsiam.IManagedPolicy{
			awsiam.ManagedPolicy_FromManagedPolicyArn(stack, aws.String("AmazonDynamoDBFullAccess"), aws.String("arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess")),
			awsiam.ManagedPolicy_FromManagedPolicyArn(stack, aws.String("AWSLambdaBasicExecutionRole"), aws.String("arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole")),
			awsiam.ManagedPolicy_FromManagedPolicyArn(stack, aws.String("AmazonS3FullAccess"), aws.String("arn:aws:iam::aws:policy/AmazonS3FullAccess")),
		},
	})

	envs := &map[string]*string{
		"GITHUB_CLIENT_ID":     aws.String(os.Getenv("GITHUB_CLIENT_ID")),
		"GITHUB_CLIENT_SECRET": aws.String(os.Getenv("GITHUB_CLIENT_SECRET")),
		"DOMAIN":               aws.String(os.Getenv("DOMAIN")),
		"MOMENTO_AUTH_TOKEN":   aws.String(os.Getenv("MOMENTO_AUTH_TOKEN")),
	}

	// Now create all lambda functions with previously created AmazonDynamoDBFullAccess role
	callbackHandler := awscdklambdagoalpha.NewGoFunction(stack, jsii.String("callbackHandler"), &awscdklambdagoalpha.GoFunctionProps{
		Runtime: awslambda.Runtime_PROVIDED_AL2(),
		Entry:   jsii.String("./handlers/auth/callback"),
		Bundling: &awscdklambdagoalpha.BundlingOptions{
			GoBuildFlags: jsii.Strings(`-ldflags "-s -w"`),
		},
		Role:         requiredRoles,
		Environment:  envs,
		Architecture: awslambda.Architecture_ARM_64(),
	})

	authenticateHandler := awscdklambdagoalpha.NewGoFunction(stack, jsii.String("authenticateHandler"), &awscdklambdagoalpha.GoFunctionProps{
		Runtime: awslambda.Runtime_PROVIDED_AL2(),
		Entry:   jsii.String("./handlers/auth/authenticate"),
		Bundling: &awscdklambdagoalpha.BundlingOptions{
			GoBuildFlags: jsii.Strings(`-ldflags "-s -w"`),
		},
		Role:         requiredRoles,
		Environment:  envs,
		Architecture: awslambda.Architecture_ARM_64(),
	})

	createSpreadSheetHandler := awscdklambdagoalpha.NewGoFunction(stack, jsii.String("createSpreadSheetHandler"), &awscdklambdagoalpha.GoFunctionProps{
		Runtime: awslambda.Runtime_PROVIDED_AL2(),
		Entry:   jsii.String("./handlers/spreadsheets/create"),
		Bundling: &awscdklambdagoalpha.BundlingOptions{
			GoBuildFlags: jsii.Strings(`-ldflags "-s -w"`),
		},
		Role:         requiredRoles,
		Environment:  envs,
		Architecture: awslambda.Architecture_ARM_64(),
	})

	copySpreadSheetHandler := awscdklambdagoalpha.NewGoFunction(stack, jsii.String("copySpreadSheetHandler"), &awscdklambdagoalpha.GoFunctionProps{
		Runtime: awslambda.Runtime_PROVIDED_AL2(),
		Entry:   jsii.String("./handlers/spreadsheets/copy"),
		Bundling: &awscdklambdagoalpha.BundlingOptions{
			GoBuildFlags: jsii.Strings(`-ldflags "-s -w"`),
		},
		Role:         requiredRoles,
		Environment:  envs,
		Architecture: awslambda.Architecture_ARM_64(),
	})

	getSpreadSheetHandler := awscdklambdagoalpha.NewGoFunction(stack, jsii.String("getSpreadSheetHandler"), &awscdklambdagoalpha.GoFunctionProps{
		Runtime: awslambda.Runtime_PROVIDED_AL2(),
		Entry:   jsii.String("./handlers/spreadsheets/get"),
		Bundling: &awscdklambdagoalpha.BundlingOptions{
			GoBuildFlags: jsii.Strings(`-ldflags "-s -w"`),
		},
		Role:         requiredRoles,
		Environment:  envs,
		Architecture: awslambda.Architecture_ARM_64(),
	})

	deleteSpreadSheetHandler := awscdklambdagoalpha.NewGoFunction(stack, jsii.String("deleteSpreadSheetHandler"), &awscdklambdagoalpha.GoFunctionProps{
		Runtime: awslambda.Runtime_PROVIDED_AL2(),
		Entry:   jsii.String("./handlers/spreadsheets/delete"),
		Bundling: &awscdklambdagoalpha.BundlingOptions{
			GoBuildFlags: jsii.Strings(`-ldflags "-s -w"`),
		},
		Role:         requiredRoles,
		Environment:  envs,
		Architecture: awslambda.Architecture_ARM_64(),
	})

	updateSpreadSheetTitleHandler := awscdklambdagoalpha.NewGoFunction(stack, jsii.String("updateSpreadSheetTitleHandler"), &awscdklambdagoalpha.GoFunctionProps{
		Runtime: awslambda.Runtime_PROVIDED_AL2(),
		Entry:   jsii.String("./handlers/spreadsheets/update_title"),
		Bundling: &awscdklambdagoalpha.BundlingOptions{
			GoBuildFlags: jsii.Strings(`-ldflags "-s -w"`),
		},
		Role:         requiredRoles,
		Environment:  envs,
		Architecture: awslambda.Architecture_ARM_64(),
	})

	updateSheetsHandler := awscdklambdagoalpha.NewGoFunction(stack, jsii.String("updateSheetsHandler"), &awscdklambdagoalpha.GoFunctionProps{
		Runtime: awslambda.Runtime_PROVIDED_AL2(),
		Entry:   jsii.String("./handlers/spreadsheets/update_sheets"),
		Bundling: &awscdklambdagoalpha.BundlingOptions{
			GoBuildFlags: jsii.Strings(`-ldflags "-s -w"`),
		},
		Role:         requiredRoles,
		Environment:  envs,
		Architecture: awslambda.Architecture_ARM_64(),
	})

	createCommentHandler := awscdklambdagoalpha.NewGoFunction(stack, jsii.String("createCommentHandler"), &awscdklambdagoalpha.GoFunctionProps{
		Runtime: awslambda.Runtime_PROVIDED_AL2(),
		Entry:   jsii.String("./handlers/comment/create"),
		Bundling: &awscdklambdagoalpha.BundlingOptions{
			GoBuildFlags: jsii.Strings(`-ldflags "-s -w"`),
		},
		Role:         requiredRoles,
		Environment:  envs,
		Architecture: awslambda.Architecture_ARM_64(),
	})

	getCommentsHandler := awscdklambdagoalpha.NewGoFunction(stack, jsii.String("getCommentsHandler"), &awscdklambdagoalpha.GoFunctionProps{
		Runtime: awslambda.Runtime_PROVIDED_AL2(),
		Entry:   jsii.String("./handlers/comment/get"),
		Bundling: &awscdklambdagoalpha.BundlingOptions{
			GoBuildFlags: jsii.Strings(`-ldflags "-s -w"`),
		},
		Role:         requiredRoles,
		Environment:  envs,
		Architecture: awslambda.Architecture_ARM_64(),
	})

	deleteCommentHandler := awscdklambdagoalpha.NewGoFunction(stack, jsii.String("deleteCommentHandler"), &awscdklambdagoalpha.GoFunctionProps{
		Runtime: awslambda.Runtime_PROVIDED_AL2(),
		Entry:   jsii.String("./handlers/comment/delete"),
		Bundling: &awscdklambdagoalpha.BundlingOptions{
			GoBuildFlags: jsii.Strings(`-ldflags "-s -w"`),
		},
		Role:         requiredRoles,
		Environment:  envs,
		Architecture: awslambda.Architecture_ARM_64(),
	})

	updateCommentHandler := awscdklambdagoalpha.NewGoFunction(stack, jsii.String("updateCommentHandler"), &awscdklambdagoalpha.GoFunctionProps{
		Runtime: awslambda.Runtime_PROVIDED_AL2(),
		Entry:   jsii.String("./handlers/comment/update"),
		Bundling: &awscdklambdagoalpha.BundlingOptions{
			GoBuildFlags: jsii.Strings(`-ldflags "-s -w"`),
		},
		Role:         requiredRoles,
		Environment:  envs,
		Architecture: awslambda.Architecture_ARM_64(),
	})

	createNoteHandler := awscdklambdagoalpha.NewGoFunction(stack, jsii.String("createNoteHandler"), &awscdklambdagoalpha.GoFunctionProps{
		Runtime: awslambda.Runtime_PROVIDED_AL2(),
		Entry:   jsii.String("./handlers/note/create"),
		Bundling: &awscdklambdagoalpha.BundlingOptions{
			GoBuildFlags: jsii.Strings(`-ldflags "-s -w"`),
		},
		Role:         requiredRoles,
		Environment:  envs,
		Architecture: awslambda.Architecture_ARM_64(),
	})

	getNotesHandler := awscdklambdagoalpha.NewGoFunction(stack, jsii.String("getNotesHandler"), &awscdklambdagoalpha.GoFunctionProps{
		Runtime: awslambda.Runtime_PROVIDED_AL2(),
		Entry:   jsii.String("./handlers/note/get"),
		Bundling: &awscdklambdagoalpha.BundlingOptions{
			GoBuildFlags: jsii.Strings(`-ldflags "-s -w"`),
		},
		Role:         requiredRoles,
		Environment:  envs,
		Architecture: awslambda.Architecture_ARM_64(),
	})

	deleteNoteHandler := awscdklambdagoalpha.NewGoFunction(stack, jsii.String("deleteNoteHandler"), &awscdklambdagoalpha.GoFunctionProps{
		Runtime: awslambda.Runtime_PROVIDED_AL2(),
		Entry:   jsii.String("./handlers/note/delete"),
		Bundling: &awscdklambdagoalpha.BundlingOptions{
			GoBuildFlags: jsii.Strings(`-ldflags "-s -w"`),
		},
		Role:         requiredRoles,
		Environment:  envs,
		Architecture: awslambda.Architecture_ARM_64(),
	})

	updateNoteHandler := awscdklambdagoalpha.NewGoFunction(stack, jsii.String("updateNoteHandler"), &awscdklambdagoalpha.GoFunctionProps{
		Runtime: awslambda.Runtime_PROVIDED_AL2(),
		Entry:   jsii.String("./handlers/note/update"),
		Bundling: &awscdklambdagoalpha.BundlingOptions{
			GoBuildFlags: jsii.Strings(`-ldflags "-s -w"`),
		},
		Role:         requiredRoles,
		Environment:  envs,
		Architecture: awslambda.Architecture_ARM_64(),
	})

	shareSpreadSheetHandler := awscdklambdagoalpha.NewGoFunction(stack, jsii.String("shareSpreadSheetHandler"), &awscdklambdagoalpha.GoFunctionProps{
		Runtime: awslambda.Runtime_PROVIDED_AL2(),
		Entry:   jsii.String("./handlers/spreadsheets/share"),
		Bundling: &awscdklambdagoalpha.BundlingOptions{
			GoBuildFlags: jsii.Strings(`-ldflags "-s -w"`),
		},
		Role:         requiredRoles,
		Environment:  envs,
		Architecture: awslambda.Architecture_ARM_64(),
	})

	return &Lambdas{
		CallbackHandler:               callbackHandler,
		AuthenticateHandler:           authenticateHandler,
		CreateSpreadSheetHandler:      createSpreadSheetHandler,
		GetSpreadSheetHandler:         getSpreadSheetHandler,
		DeleteSpreadSheetHandler:      deleteSpreadSheetHandler,
		UpdateSpreadSheetTitleHandler: updateSpreadSheetTitleHandler,
		CopySpreadSheetHandler:        copySpreadSheetHandler,
		UpdateSheetsHandler:           updateSheetsHandler,
		CreateCommentHandler:          createCommentHandler,
		GetCommentsHandler:            getCommentsHandler,
		DeleteCommentHandler:          deleteCommentHandler,
		UpdateCommentHandler:          updateCommentHandler,
		CreateNoteHandler:             createNoteHandler,
		GetNotesHandler:               getNotesHandler,
		DeleteNoteHandler:             deleteNoteHandler,
		UpdateNoteHandler:             updateNoteHandler,
		ShareSpreadSheetHandler:       shareSpreadSheetHandler,
	}
}

func CreateS3Bucket(stack awscdk.Stack) {
	_ = awss3.NewBucket(stack, jsii.String("spreadsheet-bucket"), &awss3.BucketProps{
		BlockPublicAccess: awss3.BlockPublicAccess_BLOCK_ALL(),
		EnforceSSL:        aws.Bool(true),
		Versioned:         aws.Bool(false),
		Encryption:        awss3.BucketEncryption_S3_MANAGED,
		RemovalPolicy:     awscdk.RemovalPolicy_DESTROY,
		AutoDeleteObjects: aws.Bool(true),
	})
}

func CreateHTTPApi(stack awscdk.Stack, lambdas *Lambdas) awscdkapigatewayv2alpha.HttpApi {
	spreadsheetApi := awscdkapigatewayv2alpha.NewHttpApi(stack, jsii.String("SpreadSheetHTTPApi"), &awscdkapigatewayv2alpha.HttpApiProps{
		ApiName: jsii.String("SpreadSheetHTTPApi"),
		CorsPreflight: &awscdkapigatewayv2alpha.CorsPreflightOptions{
			AllowCredentials: aws.Bool(true),
			AllowOrigins: &[]*string{
				aws.String("https://work-sheets.vercel.app"),
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
	spreadsheetApi.AddRoutes(&awscdkapigatewayv2alpha.AddRoutesOptions{
		Path:        jsii.String("/api/auth/callback"),
		Methods:     &[]awscdkapigatewayv2alpha.HttpMethod{awscdkapigatewayv2alpha.HttpMethod_GET},
		Integration: awscdkapigatewayv2integrationsalpha.NewHttpLambdaIntegration(jsii.String("SpreadSheetHttpLambdaIntegration"), lambdas.CallbackHandler, &awscdkapigatewayv2integrationsalpha.HttpLambdaIntegrationProps{}),
	})

	// authenticate API
	spreadsheetApi.AddRoutes(&awscdkapigatewayv2alpha.AddRoutesOptions{
		Path:        jsii.String("/api/auth/authenticate"),
		Methods:     &[]awscdkapigatewayv2alpha.HttpMethod{awscdkapigatewayv2alpha.HttpMethod_POST},
		Integration: awscdkapigatewayv2integrationsalpha.NewHttpLambdaIntegration(jsii.String("SpreadSheetHttpLambdaIntegration"), lambdas.AuthenticateHandler, &awscdkapigatewayv2integrationsalpha.HttpLambdaIntegrationProps{}),
	})

	// Create Spreadsheet API
	spreadsheetApi.AddRoutes(&awscdkapigatewayv2alpha.AddRoutesOptions{
		Path:        jsii.String("/api/spreadsheet"),
		Methods:     &[]awscdkapigatewayv2alpha.HttpMethod{awscdkapigatewayv2alpha.HttpMethod_POST},
		Integration: awscdkapigatewayv2integrationsalpha.NewHttpLambdaIntegration(jsii.String("SpreadSheetHttpLambdaIntegration"), lambdas.CreateSpreadSheetHandler, &awscdkapigatewayv2integrationsalpha.HttpLambdaIntegrationProps{}),
	})

	// Copy Spreadsheet API
	spreadsheetApi.AddRoutes(&awscdkapigatewayv2alpha.AddRoutesOptions{
		Path:        jsii.String("/api/spreadsheet_copy"),
		Methods:     &[]awscdkapigatewayv2alpha.HttpMethod{awscdkapigatewayv2alpha.HttpMethod_POST},
		Integration: awscdkapigatewayv2integrationsalpha.NewHttpLambdaIntegration(jsii.String("SpreadSheetHttpLambdaIntegration"), lambdas.CopySpreadSheetHandler, &awscdkapigatewayv2integrationsalpha.HttpLambdaIntegrationProps{}),
	})

	// Get Spreadsheet API
	spreadsheetApi.AddRoutes(&awscdkapigatewayv2alpha.AddRoutesOptions{
		Path:        jsii.String("/api/spreadsheet"),
		Methods:     &[]awscdkapigatewayv2alpha.HttpMethod{awscdkapigatewayv2alpha.HttpMethod_GET},
		Integration: awscdkapigatewayv2integrationsalpha.NewHttpLambdaIntegration(jsii.String("SpreadSheetHttpLambdaIntegration"), lambdas.GetSpreadSheetHandler, &awscdkapigatewayv2integrationsalpha.HttpLambdaIntegrationProps{}),
	})

	// Delete Spreadsheet API
	spreadsheetApi.AddRoutes(&awscdkapigatewayv2alpha.AddRoutesOptions{
		Path:        jsii.String("/api/spreadsheet"),
		Methods:     &[]awscdkapigatewayv2alpha.HttpMethod{awscdkapigatewayv2alpha.HttpMethod_DELETE},
		Integration: awscdkapigatewayv2integrationsalpha.NewHttpLambdaIntegration(jsii.String("SpreadSheetHttpLambdaIntegration"), lambdas.DeleteSpreadSheetHandler, &awscdkapigatewayv2integrationsalpha.HttpLambdaIntegrationProps{}),
	})

	// Update SpreadsheetTitle API
	spreadsheetApi.AddRoutes(&awscdkapigatewayv2alpha.AddRoutesOptions{
		Path:        jsii.String("/api/spreadsheet_title"),
		Methods:     &[]awscdkapigatewayv2alpha.HttpMethod{awscdkapigatewayv2alpha.HttpMethod_PATCH},
		Integration: awscdkapigatewayv2integrationsalpha.NewHttpLambdaIntegration(jsii.String("SpreadSheetHttpLambdaIntegration"), lambdas.UpdateSpreadSheetTitleHandler, &awscdkapigatewayv2integrationsalpha.HttpLambdaIntegrationProps{}),
	})

	// Update spreadsheet sheets API
	spreadsheetApi.AddRoutes(&awscdkapigatewayv2alpha.AddRoutesOptions{
		Path:        jsii.String("/api/spreadsheet_sheets"),
		Methods:     &[]awscdkapigatewayv2alpha.HttpMethod{awscdkapigatewayv2alpha.HttpMethod_PATCH},
		Integration: awscdkapigatewayv2integrationsalpha.NewHttpLambdaIntegration(jsii.String("SpreadSheetHttpLambdaIntegration"), lambdas.UpdateSheetsHandler, &awscdkapigatewayv2integrationsalpha.HttpLambdaIntegrationProps{}),
	})

	// Create comment API
	spreadsheetApi.AddRoutes(&awscdkapigatewayv2alpha.AddRoutesOptions{
		Path:        jsii.String("/api/comment"),
		Methods:     &[]awscdkapigatewayv2alpha.HttpMethod{awscdkapigatewayv2alpha.HttpMethod_POST},
		Integration: awscdkapigatewayv2integrationsalpha.NewHttpLambdaIntegration(jsii.String("SpreadSheetHttpLambdaIntegration"), lambdas.CreateCommentHandler, &awscdkapigatewayv2integrationsalpha.HttpLambdaIntegrationProps{}),
	})

	// Get comment API
	spreadsheetApi.AddRoutes(&awscdkapigatewayv2alpha.AddRoutesOptions{
		Path:        jsii.String("/api/comment"),
		Methods:     &[]awscdkapigatewayv2alpha.HttpMethod{awscdkapigatewayv2alpha.HttpMethod_GET},
		Integration: awscdkapigatewayv2integrationsalpha.NewHttpLambdaIntegration(jsii.String("SpreadSheetHttpLambdaIntegration"), lambdas.GetCommentsHandler, &awscdkapigatewayv2integrationsalpha.HttpLambdaIntegrationProps{}),
	})

	// Delete comment API
	spreadsheetApi.AddRoutes(&awscdkapigatewayv2alpha.AddRoutesOptions{
		Path:        jsii.String("/api/comment"),
		Methods:     &[]awscdkapigatewayv2alpha.HttpMethod{awscdkapigatewayv2alpha.HttpMethod_DELETE},
		Integration: awscdkapigatewayv2integrationsalpha.NewHttpLambdaIntegration(jsii.String("SpreadSheetHttpLambdaIntegration"), lambdas.DeleteCommentHandler, &awscdkapigatewayv2integrationsalpha.HttpLambdaIntegrationProps{}),
	})

	// Update comment API
	spreadsheetApi.AddRoutes(&awscdkapigatewayv2alpha.AddRoutesOptions{
		Path:        jsii.String("/api/comment"),
		Methods:     &[]awscdkapigatewayv2alpha.HttpMethod{awscdkapigatewayv2alpha.HttpMethod_PATCH},
		Integration: awscdkapigatewayv2integrationsalpha.NewHttpLambdaIntegration(jsii.String("SpreadSheetHttpLambdaIntegration"), lambdas.UpdateCommentHandler, &awscdkapigatewayv2integrationsalpha.HttpLambdaIntegrationProps{}),
	})

	// Create note API
	spreadsheetApi.AddRoutes(&awscdkapigatewayv2alpha.AddRoutesOptions{
		Path:        jsii.String("/api/note"),
		Methods:     &[]awscdkapigatewayv2alpha.HttpMethod{awscdkapigatewayv2alpha.HttpMethod_POST},
		Integration: awscdkapigatewayv2integrationsalpha.NewHttpLambdaIntegration(jsii.String("SpreadSheetHttpLambdaIntegration"), lambdas.CreateNoteHandler, &awscdkapigatewayv2integrationsalpha.HttpLambdaIntegrationProps{}),
	})

	// Get notes API
	spreadsheetApi.AddRoutes(&awscdkapigatewayv2alpha.AddRoutesOptions{
		Path:        jsii.String("/api/note"),
		Methods:     &[]awscdkapigatewayv2alpha.HttpMethod{awscdkapigatewayv2alpha.HttpMethod_GET},
		Integration: awscdkapigatewayv2integrationsalpha.NewHttpLambdaIntegration(jsii.String("SpreadSheetHttpLambdaIntegration"), lambdas.GetNotesHandler, &awscdkapigatewayv2integrationsalpha.HttpLambdaIntegrationProps{}),
	})

	// Delete note API
	spreadsheetApi.AddRoutes(&awscdkapigatewayv2alpha.AddRoutesOptions{
		Path:        jsii.String("/api/note"),
		Methods:     &[]awscdkapigatewayv2alpha.HttpMethod{awscdkapigatewayv2alpha.HttpMethod_DELETE},
		Integration: awscdkapigatewayv2integrationsalpha.NewHttpLambdaIntegration(jsii.String("SpreadSheetHttpLambdaIntegration"), lambdas.DeleteNoteHandler, &awscdkapigatewayv2integrationsalpha.HttpLambdaIntegrationProps{}),
	})

	// Update note API
	spreadsheetApi.AddRoutes(&awscdkapigatewayv2alpha.AddRoutesOptions{
		Path:        jsii.String("/api/note"),
		Methods:     &[]awscdkapigatewayv2alpha.HttpMethod{awscdkapigatewayv2alpha.HttpMethod_PATCH},
		Integration: awscdkapigatewayv2integrationsalpha.NewHttpLambdaIntegration(jsii.String("SpreadSheetHttpLambdaIntegration"), lambdas.UpdateNoteHandler, &awscdkapigatewayv2integrationsalpha.HttpLambdaIntegrationProps{}),
	})

	// Share spreadsheet API
	spreadsheetApi.AddRoutes(&awscdkapigatewayv2alpha.AddRoutesOptions{
		Path:        jsii.String("/api/share"),
		Methods:     &[]awscdkapigatewayv2alpha.HttpMethod{awscdkapigatewayv2alpha.HttpMethod_GET},
		Integration: awscdkapigatewayv2integrationsalpha.NewHttpLambdaIntegration(jsii.String("SpreadSheetHttpLambdaIntegration"), lambdas.ShareSpreadSheetHandler, &awscdkapigatewayv2integrationsalpha.HttpLambdaIntegrationProps{}),
	})


	return spreadsheetApi
}

func NewSpreadSheetGoStack(scope constructs.Construct, id string, props *awscdk.StackProps) awscdk.Stack {
	stack := awscdk.NewStack(scope, &id, props)

	// Now create a DynamoDB table
	CreateDynamoTable(stack)

	// Also create a S3 bucket to store sheets state in json files
	// Object name will be USER#<USER_ID>SPREADSHEET#<SPREADSHEET_ID>.json ----> Sheet[] will be an array json
	CreateS3Bucket(stack)

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

	NewSpreadSheetGoStack(app, "SpreadSheetGoStack", &awscdk.StackProps{
		Env:         env(),
		StackName:   aws.String("spreadsheet-go-stack"),
		Description: aws.String("AWS go stack for spreadsheet application."),
	})

	app.Synth(nil)
}

func env() *awscdk.Environment {
	return &awscdk.Environment{
		Account: aws.String("473539126755"),
		Region:  aws.String("ap-south-1"),
	}
}
