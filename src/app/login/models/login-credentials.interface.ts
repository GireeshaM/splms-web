export interface LoginCredentials {
    id: number; // Unique identifier for the user
    email: string; // User's email address
    password: string; // User's hashed password
    role: string; // User's role (e.g., admin, instructor, user)
    createdAt: Date; // Timestamp when the user was created
    updatedAt: Date; // Timestamp when the user was last updated
  }