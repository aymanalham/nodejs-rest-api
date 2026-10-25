Node.js REST API

A RESTful API built with Node.js, Express.js, and MongoDB. The project provides user authentication, authorization, and post management.

Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)
- JavaScript
- Postman

Features

User Management

- Create and retrieve users.
- Update and delete user information.
- User registration and login.
- Retrieve the authenticated user's profile.

Authentication and Authorization

- JWT-based authentication.
- Protected routes using authentication middleware.
- Role-based authorization.
- Access control for protected resources.

Post Management

- Create, retrieve, update, and delete posts.
- Associate posts with their authors.
- Populate author information using Mongoose.
- Restrict unauthorized users from modifying posts they do not own.

API Improvements

- Pagination.
- Search posts by title.
- Sorting results by selected fields and order.
- Request validation.
- Centralized error handling.

Getting Started

Prerequisites

Make sure you have installed:

- Node.js
- npm
- A MongoDB database
- Postman (optional, for API testing)

Installation

1. Clone the repository:
   
   git clone https://github.com/aymanalham/nodejs-rest-api.git

2. Navigate to the project directory:
   
   cd nodejs-rest-api

3. Install the dependencies:
   
   npm install

Environment Variables

Create a ".env" file in the project root directory and configure the environment variables required by the application.

Example:

PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_secret_key

Replace the example values with your own configuration.

Important: Never commit your ".env" file, database credentials, or JWT secrets to GitHub.

Running the Application

Start the server using:

npm start

Make sure the start script is configured in "package.json" and the required environment variables are set.

API Testing

You can use Postman to send HTTP requests and test the API endpoints, including authentication, protected routes, user management, and post management.

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
├── server.js
├── package.json
├── package-lock.json
└── .gitignore

Purpose

This project was developed as part of my practical learning journey in backend development, with a focus on building REST APIs, working with databases, implementing authentication, and organizing code using controllers, routes, models, and middleware.