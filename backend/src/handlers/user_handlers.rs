use actix_web::{delete, get, post, web, HttpResponse, Result};
use deadpool_postgres::Pool;
use log::{error, info};
use uuid::Uuid;

use crate::{db::index::handle_db_error, models::user_models::{NewUser, User}};


#[post("/users")]
pub async fn create_new_user(pool: web::Data<Pool>, new_user: web::Json<NewUser>) -> Result<HttpResponse> {


    let client = pool.get().await.map_err(|e| {
        error!("Failed to acquire DB connection: {}", e);
        actix_web::error::ErrorInternalServerError("Internal Server Error")
    })?;

    let existing_user = client.query_opt("SELECT id FROM users WHERE email = $1", &[&new_user.email]).await.map_err(handle_db_error)?;

    if existing_user.is_some() {
        return Ok(HttpResponse::Conflict().json(format!("User with email {} already exists", &new_user.email)));
    }


    let stmt = "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id";
    let row = client.query_one(stmt, &[&new_user.name, &new_user.email])
        .await
        .map_err(handle_db_error)?;

    let user_id: Uuid = row.get(0);

    let created_user = NewUser {
        name: new_user.name.clone(),
        email: new_user.email.clone(),
    };

    info!("Created new user with id {}", user_id);

    Ok(HttpResponse::Created().json(created_user))
}


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
    let id: Uuid = path.into_inner();
    let client = pool.get().await.map_err(|e| {
        error!("Failed to acquire DB connection: {}", e);
        actix_web::error::ErrorInternalServerError("Internal Server Error")
    })?;

    let row = client.query_opt("SELECT id, name, email FROM users WHERE id = $1", &[&id])
        .await
        .map_err(handle_db_error)?;

    match row {
        Some(row) => {
            let user = User  {
                id: row.get(0),
                name: row.get(1),
                email: row.get(2)
            };
            Ok(HttpResponse::Ok().json(user))
        }
        None => {
            Ok(HttpResponse::NotFound().json("User not found."))
        }
    }
}




// Handler to delete a user by id
#[delete("/users/{id}/delete")]
pub async fn delete_user_by_id(pool: web::Data<Pool>, path: web::Path<Uuid>) -> Result<HttpResponse> {
    let id: Uuid = path.into_inner();
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
