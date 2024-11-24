use std::{env, str::FromStr};
use serde::Deserialize;
use actix_web::{get, middleware::Logger, post, web, App, HttpResponse, HttpServer, Responder};
use deadpool_postgres::{Manager, Pool};
use dotenv::dotenv;
use openssl::ssl::{SslConnector, SslMethod};
use postgres_openssl::MakeTlsConnector;
use std::error::Error;
use actix_cors::Cors;

#[get("/")]
async fn hello() -> impl Responder {
    HttpResponse::Ok().body("Hello world!")
}

#[post("/echo")]
async fn echo(req_body: String) -> impl Responder {
    HttpResponse::Ok().body(req_body)
}


#[derive(Deserialize)]
struct NewRecord {
    name: String,
    email: String,
}

#[post("/insert")]
async fn insert_record(pool: web::Data<Pool>, new_record: web::Json<NewRecord>) -> impl Responder {
    let client = pool.get().await.unwrap();

    // SQL query to insert new record
    let insert_query = "
        INSERT INTO test_table (name, email)
        VALUES ($1, $2)
        RETURNING id;
    ";

    // Execute the insert query
    match client
        .query_one(insert_query, &[&new_record.name, &new_record.email])
        .await
    {
        Ok(row) => {
            let id: i32 = row.get(0);
            HttpResponse::Ok().body(format!("Record inserted with ID: {}", id))
        }
        Err(e) => {
            eprintln!("Error inserting record: {}", e);
            HttpResponse::InternalServerError().body("Failed to insert record")
        }
    }
}

#[get("/db-query")]
async fn db_query(pool: web::Data<Pool>) -> HttpResponse {
    let client = pool.get().await.unwrap();
    let rows = client.query("SELECT * FROM test_table", &[]).await.unwrap();
    let result = rows.iter().map(|row| {
        let id: i32 = row.get(0);      // Column 0 is `id`, which is an integer
        let name: String = row.get(1); // Column 1 is `name`, which is a string
        let email: String = row.get(2); // Column 2 is `email`, which is a string
        format!("id: {}, name: {}, email: {}", id, name, email)
    }).collect::<Vec<String>>().join(", ");
    HttpResponse::Ok().body(format!("Rows: {}", result))
}


async fn manual_hello() -> impl Responder {
    HttpResponse::Ok().body("Hey there!")
}

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

    dotenv().ok();

    let pool = create_pool().await.unwrap();

    let client = pool.get().await.unwrap();

    let create_table_query = "
        CREATE TABLE IF NOT EXISTS test_table (
            id SERIAL PRIMARY KEY,
            name VARCHAR NOT NULL,
            email VARCHAR NOT NULL
        );
    ";

    // Execute the query to create the table
    match client.execute(create_table_query, &[]).await {
        Ok(_) => println!("Table created successfully"),
        Err(e) => eprintln!("Error creating table: {}", e),
    }


    HttpServer::new(move || {
        App::new()
            .wrap(Logger::default())
            .wrap(Cors::default().allow_any_origin())
            .app_data(web::Data::new(pool.clone()))
            .service(hello)
            .service(echo)
            .service(db_query)
            .service(insert_record)
            .route("/hey", web::get().to(manual_hello))
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}