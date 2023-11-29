package db

import (
	"context"
	"fmt"
	"time"

	"github.com/momentohq/client-sdk-go/auth"
	"github.com/momentohq/client-sdk-go/config"
	"github.com/momentohq/client-sdk-go/config/logger"
	"github.com/momentohq/client-sdk-go/momento"
	"github.com/momentohq/client-sdk-go/responses"
)

const CACHE_NAME = "spreadsheet_cache"

type Redis struct {
	Client *momento.CacheClient
}

func NewRedis(ctx context.Context) *Redis {
	return &Redis{
		Client: initializeRedis(ctx),
	}
}

func initializeRedis(ctx context.Context) *momento.CacheClient {
	credentialProvider, err := auth.NewEnvMomentoTokenProvider("MOMENTO_AUTH_TOKEN")
	if err != nil {
		return nil
	}

	client, err := momento.NewCacheClient(
		config.LaptopLatestWithLogger(logger.NewNoopMomentoLoggerFactory()).WithClientTimeout(15*time.Second),
		credentialProvider,
		600*time.Second,
	)
	if err != nil {
		return nil
	}

	return &client
}

func (redis *Redis) Set(ctx context.Context, key, value string) error {
	_, err := (*redis.Client).Set(ctx, &momento.SetRequest{
		CacheName: CACHE_NAME,
		Key:       momento.String(key),
		Value:     momento.String(value),
		Ttl:       7 * 3600 * time.Second,
	})

	if err != nil {
		return err
	}

	return nil
}

func (redis *Redis) Get(ctx context.Context, key string) (string, error) {
	res, err := (*redis.Client).Get(ctx, &momento.GetRequest{
		CacheName: CACHE_NAME,
		Key:       momento.String(key),
	})
	if err != nil {
		return "", err
	}

	switch r := res.(type) {
	case *responses.GetHit:
		{
			return r.ValueString(), nil
		}
	case *responses.GetMiss:
		{
			return "", nil
		}
	}

	return "", nil
}

func (redis *Redis) Delete(ctx context.Context, key string) error {
	_, err := (*redis.Client).Delete(ctx, &momento.DeleteRequest{
		CacheName: CACHE_NAME,
		Key:       momento.String(key),
	})
	if err != nil {
		return err
	}

	return nil
}

func (redis *Redis) AuthKey(access_token string) string {
	return fmt.Sprintf("USER#%s", access_token)
}

func (redis *Redis) SpreadSheetKey(spreadsheet_id string) string {
	return fmt.Sprintf("SPREADSHEET#%s", spreadsheet_id)
}
