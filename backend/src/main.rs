mod models;
mod handlers;
mod db;


use std::{env, str::FromStr};
use actix_web::{http, middleware::Logger, web, App, HttpServer};
use deadpool_postgres::{Manager, Pool};
use dotenv::dotenv;
use handlers::{post_handlers::{create_post, get_all_posts}, user_handlers::{create_new_user, delete_user_by_id, get_all_users, get_user_by_id}};
use openssl::ssl::{SslConnector, SslMethod};
use postgres_openssl::MakeTlsConnector;
use std::error::Error;
use actix_cors::Cors;



async fn create_pool() -> Result<Pool, Box<dyn Error>> {
    dotenv::dotenv().ok(); // Load environment variables from .env file

    let db_url = env::var("DATABASE_URL")?;

    // Set up OpenSSL connector
    let builder = SslConnector::builder(SslMethod::tls())?;
    let connector = MakeTlsConnector::new(builder.build());

    // Set up the PostgreSQL connection manager with TLS
    let config = tokio_postgres::Config::from_str(&db_url)?;
    let manager = Manager::new(config, connector);

    // Create the connection pool asynchronously
    let pool = Pool::builder(manager)
        .max_size(16) // Set the maximum pool size
        .build()
        .map_err(|e| Box::new(e) as Box<dyn Error>)?; // Handle the error

    Ok(pool)
}


#[actix_web::main]
async fn main() -> std::io::Result<()> {

    env_logger::init();

    dotenv().ok();

    let pool = create_pool().await.unwrap();

    let log_format = "%a \"%r\" %s %b \"%{Referer}i\" \"%{User-Agent}i\""; 


    HttpServer::new(move || {
        App::new()
            .wrap(Logger::new(log_format))
            .wrap(Cors::default().allow_any_origin().allowed_methods(vec!["GET", "POST"])
            .allowed_headers(vec![http::header::CONTENT_TYPE]))
            .app_data(web::Data::new(pool.clone()))
            .service(create_new_user)
            .service(get_all_users)
            .service(get_user_by_id)
            .service(delete_user_by_id)
            .service(create_post)
            .service(get_all_posts)
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}