## Features

- **User Authentication**:  
  - Secure registration and login using **JSON Web Tokens** (JWT) and **bcrypt** for password hashing.

- **Video Tagging System**:  
  - Add one or multiple tags to videos.
  - Discover videos by filtering based on one or more tags.

- **Video Collection**:  
  - Bookmark videos you like or plan to watch later, and organize your collection efficiently.
- **CRUD Operations on Videos**:  
  - Edit and delete your video posts.

## Technologies Used

- **React**: Frontend framework for building interactive user interfaces.
- **TypeScript**: Type-safe language for improved developer experience and error prevention.
- **Node.js**: Backend runtime environment for building scalable server-side applications.
- **Express**: Web framework for Node.js, handling routing and server logic.
- **Prisma**: ORM for database interaction, making queries more efficient and type-safe.
- **JWT (JSON Web Tokens)**: For secure authentication and user sessions.
- **bcrypt**: For hashing and comparing user passwords securely.

## Database Schema

The application uses a **Prisma**-designed schema to manage the database. Key models include:
- **User**: Stores user data such as email, hashed password, and authentication details.
- **Video**: Stores video details, including the title, URL, description, and associated tags.
- **Tag**: A tag model to categorize videos.
- **Bookmark**: Allows users to save and organize their favorite videos.

## Screenshots

**Video Page**  
![Video Page Screenshot](./public/screenshot.png)





