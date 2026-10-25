Node.js REST API

A RESTful API built with Node.js, Express.js, and MongoDB.

This project demonstrates backend development concepts, including user authentication, authorization, database operations, and post management.

Technologies

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)
- JavaScript
- Postman

Features

User Management

- User registration and login.
- Retrieve users and individual user information.
- Update and delete user information.
- Retrieve the authenticated user's profile.

Authentication and Authorization

- JWT-based authentication.
- Protected routes using authentication middleware.
- Role-based authorization.
- Access control for protected resources.

Post Management

- Create, retrieve, update, and delete posts.
- Associate posts with their authors.
- Retrieve author information using Mongoose population.
- Restrict users from modifying posts they do not own.

API Features

- Pagination.
- Search posts by title.
- Sort results by selected fields and order.
- Request validation.
- Centralized error handling.

Project Structure

nodejs-rest-api/
├── config/
│   └── db.js
├── controllers/
│   ├── postController.js
│   └── userController.js
├── middleware/
│   ├── authMiddleware.js
│   └── validdatePost.js
├── models/
│   ├── Post.js
│   └── User.js
├── routes/
│   ├── posts.js
│   └── users.js
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
└── server.js

Getting Started

Prerequisites

- Node.js
- npm
- A MongoDB database
- Postman (optional, for testing API requests)

Installation

Clone the repository:

git clone https://github.com/aymanalham/nodejs-rest-api.git

Navigate to the project directory:

cd nodejs-rest-api

Install the dependencies:

npm install

Environment Variables

Create a ".env" file in the root directory of the project.

Add the following variables, using your own values:

PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_secret_key

Do not commit your ".env" file or expose database credentials and JWT secrets.

Run the Application

Start the server:

npm start

The application uses port "3000" in its current configuration.

Ensure that your MongoDB connection settings are correct before starting the application.

API Testing

Use Postman to test the API endpoints, including authentication, protected routes, user management, and post management.

Purpose

This project is part of my practical learning journey in backend development. It has helped me practice building REST APIs, connecting to MongoDB, implementing authentication and authorization, and organizing an application using routes, controllers, models, and middleware.