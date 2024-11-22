use actix_web::{delete, get, post, web, HttpResponse, Result};
use deadpool_postgres::Pool;
use serde::{Deserialize, Serialize};
use tokio_postgres::Error as PgError;
use log::{error, info};
use uuid::Uuid;

#[derive(Serialize, Deserialize)]
pub struct User {
    id: Uuid,
    name: String,
    email: String,
}

// Utility function to handle database connection errors
fn handle_db_error(e: PgError) -> actix_web::Error {
    error!("Database error: {}", e);
    actix_web::error::ErrorInternalServerError("Internal Server Error")
}

#[post("/users")]
pub async fn create_new_user(pool: web::Data<Pool>, new_user: web::Json<User>) -> Result<HttpResponse> {
    let client = pool.get().await.map_err(|e| {
        error!("Failed to acquire DB connection: {}", e);
        actix_web::error::ErrorInternalServerError("Internal Server Error")
    })?;

    // Insert the new user into the database
    let stmt = "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id";
    let row = client.query_one(stmt, &[&new_user.name, &new_user.email])
        .await
        .map_err(handle_db_error)?;

    let user_id: Uuid = row.get(0);  // Extract the generated UUID

    // Return a successful response with the created user data
    let created_user = User {
        id: user_id,
        name: new_user.name.clone(),
        email: new_user.email.clone(),
    };

    info!("Created new user with id {}", user_id);

    Ok(HttpResponse::Created().json(created_user))
}


// Handler to get all users
#[get("/users")]
pub async fn get_all_users(pool: web::Data<Pool>) -> Result<HttpResponse> {
    let client = pool.get().await.map_err(|e| {
        error!("Failed to acquire DB connection: {}", e);
        actix_web::error::ErrorInternalServerError("Internal Server Error")
    })?;

    let rows = client.query("SELECT id, name, email FROM users", &[])
        .await
        .map_err(handle_db_error)?;

    let result: Vec<User> = rows.iter().map(|row| User {
        id: row.get(0),  // UUID is directly mapped
        name: row.get(1),
        email: row.get(2),
    }).collect();

    Ok(HttpResponse::Ok().json(result))
}

// Handler to get a user by id
#[get("/users/{id}")]
pub async fn get_user_by_id(pool: web::Data<Pool>, path: web::Path<Uuid>) -> Result<HttpResponse> {
    let id = path.to_string();
    let client = pool.get().await.map_err(|e| {
        error!("Failed to acquire DB connection: {}", e);
        actix_web::error::ErrorInternalServerError("Internal Server Error")
    })?;

    let row = client.query_one("SELECT id, name, email FROM users WHERE id = $1", &[&id])
        .await
        .map_err(handle_db_error)?;

    let formatted_id = row.get(0);

    let user = User {
        id: formatted_id,
        name: row.get(1),
        email: row.get(2),
    };

    Ok(HttpResponse::Ok().json(user))
}

// Handler to delete a user by id
#[delete("/users/{id}/delete")]
pub async fn delete_user_by_id(pool: web::Data<Pool>, path: web::Path<Uuid>) -> Result<HttpResponse> {
    let id = path.to_string();
    let client = pool.get().await.map_err(|e| {
        error!("Failed to acquire DB connection: {}", e);
        actix_web::error::ErrorInternalServerError("Internal Server Error")
    })?;

    // Check if the user exists before deleting
    let user_exists = client.query_one("SELECT id FROM users WHERE id = $1", &[&id]).await.is_ok();

    if !user_exists {
        return Ok(HttpResponse::NotFound().json(format!("User with id {} not found", id)));
    }

    // Delete the user
    let rows_deleted = client.execute("DELETE FROM users WHERE id = $1", &[&id])
        .await
        .map_err(handle_db_error)?;

    // If no rows were deleted, return NotFound
    if rows_deleted == 0 {
        return Ok(HttpResponse::NotFound().json(format!("User with id {} not found", id)));
    }

    // Return a successful response with the deleted user's id
    info!("Deleted user with id {}", id);
    Ok(HttpResponse::Ok().json(format!("Deleted user with id: {}", id)))
}
