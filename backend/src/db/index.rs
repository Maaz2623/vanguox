use tokio_postgres::Error as PgError;
use log::error;

// Utility function to handle database connection errors
pub fn handle_db_error(e: PgError) -> actix_web::Error {
    error!("Database error: {}", e);
    actix_web::error::ErrorInternalServerError("Internal Server Error")
}
