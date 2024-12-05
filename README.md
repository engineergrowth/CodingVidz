# Coding Vidz

A full-stack video-sharing application built using React, TypeScript, Node.js, Prisma, Material UI, and TailwindCSS. Built in just 4 days, Coding Vidz empowers users to share, discover, and organize coding-related videos efficiently. Designed with a robust backend and a user-friendly frontend, the app enables seamless video sharing, bookmarking, and personalized content organization.

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


## Contributing

Feel free to fork this repository, submit issues, and send pull requests. We would love it if you shared your bookmarks with us as well! Contributions are always welcome!

