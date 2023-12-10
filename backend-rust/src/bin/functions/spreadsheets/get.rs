use backend_rust::db::redis::Redis;
use lambda_http::{run, service_fn, Body, Error, Request, Response};

async fn function_handler(redis: &mut Redis,_event: Request) -> Result<Response<Body>, Error> {
    redis.set("hello", "world").await.unwrap();

    let message = redis.get("hello").await.unwrap();

    // Return something that implements IntoResponse.
    // It will be serialized to the right response event automatically by the runtime
    let resp = Response::builder()
        .status(200)
        .header("content-type", "application/json")
        .body(message.into())
        .map_err(Box::new)?;
    Ok(resp)
}

#[tokio::main]
async fn main() -> Result<(), Error> {
    tracing_subscriber::fmt()
        .with_max_level(tracing::Level::INFO)
        // disable printing the name of the module in every log line.
        .with_target(false)
        // disabling time is handy because CloudWatch will add the ingestion time.
        .without_time()
        .init();

    return run(service_fn(|event: Request| async {
        function_handler(&mut Redis::new(), event).await
    })).await;
}