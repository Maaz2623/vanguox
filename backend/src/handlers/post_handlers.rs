use actix_web::{delete, get, post, web, HttpResponse, Result};
use deadpool_postgres::Pool;
use log::{error, info};
use uuid::Uuid;

use crate::{db::index::handle_db_error, models::{post_models::{NewPost, Post}, user_models::{NewUser, User}}};

#[post("/posts")]
pub async fn create_post(pool: web::Data<Pool>, new_post: web::Json<NewPost>) -> Result<HttpResponse> {
    let client = pool.get().await.map_err(|e| {
        error!("Failed to acquire DB connection: {}", e);
        actix_web::error::ErrorInternalServerError("Internal Server Error")
    })?;

    let stmt = "INSERT INTO posts (title, content, user_id) VALUES ($1, $2, $3) RETURNING id";
    let row = client
        .query_one(stmt, &[&new_post.title, &new_post.content, &new_post.user_id])
        .await
        .map_err(|e| {
            error!("Failed to execute query: {}", e);
            actix_web::error::ErrorInternalServerError("Internal Server Error")
        })?;

    let post_id: Uuid = row.get(0);

    Ok(HttpResponse::Created().json(format!("Post created with id: {}", post_id)))
}


#[get("/posts")]
pub async fn get_all_posts(pool: web::Data<Pool>) -> Result<HttpResponse> {
    let client = pool.get().await.map_err(|e| {
        error!("Failed to accquire DB connection: {}", e);
        actix_web::error::ErrorInternalServerError("Internal Server Error")
    })?;

    let rows = client.query("SELECT * FROM posts", &[]).await.map_err(|e| {
        error!("Failed to execute query: {}", e);
        actix_web::error::ErrorInternalServerError("Internal Server Error")
    })?;

    let result: Vec<Post> = rows.iter().map(|row| Post {
        id: row.get(0),
        title: row.get(1),
        content: row.get(2),
        user_id: row.get(3)
    }).collect();

    Ok(HttpResponse::Ok().json(result))
}