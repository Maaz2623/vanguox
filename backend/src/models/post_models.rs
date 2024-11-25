use serde::{Serialize, Deserialize};
use uuid::Uuid;

#[derive(Serialize, Deserialize)]
pub struct Post {
    pub id: Uuid,       // Unique identifier for the post
    pub title: String,  // Title of the post
    pub content: String, // Content of the post
    pub user_id: Uuid,  // Foreign key referencing User::id
}

#[derive(Deserialize)]
pub struct NewPost {
    pub title: String,
    pub content: String,
    pub user_id: Uuid, // ID of the user who created the post
}
