use std::time::Duration;

use crate::config::SPREAD_SHEET_CACHE;

pub struct Redis {
    client: momento::SimpleCacheClient,
}

impl Redis {
    pub fn new() -> Self {
        // Initialize Momento
        let credential_provider =
            momento::CredentialProviderBuilder::from_environment_variable("MOMENTO_AUTH_TOKEN".to_string())
                .build()
                .expect("env var MOMENTO_AUTH_TOKEN must be set to your auth token");
        let item_default_ttl_seconds = 600;
        let cache_client = momento::SimpleCacheClientBuilder::new(
            credential_provider,
            Duration::from_secs(item_default_ttl_seconds),
        )
        .unwrap()
        .build();

        return Self {
            client: cache_client,
        };
    }

    pub async fn set(&mut self, key: &str, value: &str) -> momento::MomentoResult<()> {
        match self
            .client
            .set(
                SPREAD_SHEET_CACHE,
                key,
                value,
                Duration::from_secs(7 * 3600),
            )
            .await
        {
            Ok(_) => Ok(()),
            Err(err) => Err(err),
        }
    }

    pub async fn get(&mut self, key: &str) -> momento::MomentoResult<String> {
        match self.client.get(SPREAD_SHEET_CACHE, key).await {
            Ok(res) => match res {
                momento::response::Get::Hit { value } => Ok(value.try_into().expect("string")),
                momento::response::Get::Miss => Ok("".to_string()),
            },
            Err(err) => Err(err),
        }
    }

    pub fn auth_key(access_token: String) -> String {
        return format!("USER#{}", access_token);
    }

    pub fn spread_sheet_key(spreadsheet_id: String) -> String {
        return format!("SPREADSHEET#{}", spreadsheet_id);
    }
}
