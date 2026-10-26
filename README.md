Node.js REST API

A backend REST API built with Node.js, Express.js, MongoDB, and Mongoose.

This project demonstrates backend development fundamentals, including RESTful routing, user authentication, authorization, database operations, input validation, error handling, and post management.

Features

- User registration and login
- Password hashing with bcrypt
- JWT-based authentication
- Role-based authorization for users and administrators
- User profile retrieval and updates
- Post creation, retrieval, updating, and deletion
- Post ownership checks
- Pagination, search, and sorting
- Request validation
- Centralized error handling
- MongoDB integration using Mongoose

Technologies

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)
- bcrypt
- dotenv

Requirements

Install the following before running the project:

- Node.js
- npm
- A MongoDB database

Installation

Clone the repository:

git clone https://github.com/aymanalham/nodejs-rest-api.git

Navigate to the project directory:

cd nodejs-rest-api

Install dependencies:

npm install

Create a ".env" file in the project root directory.

Add the following environment variables:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
PORT=3000

Replace the example values with your own configuration.

Never commit your ".env" file or expose database credentials and secret keys.

Running the Application

Start the server:

npm start

The API will be available at:

http://localhost:3000

API Endpoints

Authentication

Method| Endpoint| Description| Access
POST| "/users/register"| Register a new user| Public
POST| "/users/login"| Log in and receive a JWT| Public

Users

Method| Endpoint| Description| Access
GET| "/users/me"| Get the current user's profile| Authenticated
PATCH| "/users/:id"| Update permitted profile fields| Owner or admin
GET| "/users"| List users| Admin
GET| "/users/:id"| Get user details| Admin

Posts

Method| Endpoint| Description| Access
GET| "/posts"| Retrieve posts| Public
GET| "/posts/:id"| Retrieve a single post| Public
POST| "/posts"| Create a post| Authenticated
PATCH| "/posts/:id"| Update a post| Owner or admin
PUT| "/posts/:id"| Update a post title| Owner or admin
DELETE| "/posts/:id"| Delete a post| Owner or admin

Authentication

After logging in, the API returns a JWT.

For protected endpoints, send the token using the HTTP Authorization header:

Authorization: Bearer YOUR_TOKEN

Post Query Parameters

The posts endpoint supports pagination, search, and sorting.

Example:

GET /posts?page=1&limit=10

Search by title:

GET /posts?search=node

Sort by title:

GET /posts?sortBy=title&order=desc

Supported sorting fields include "_id", "title", and "createdAt".

Authorization

Regular users can update and delete their own posts.

Administrators can update and delete posts belonging to any user.

User registration assigns the "user" role by default. Administrative privileges must be granted through a trusted administrative process.

Error Handling

The API handles common errors, including:

- Invalid request data
- Invalid MongoDB IDs
- Duplicate records
- Missing resources
- Unauthorized requests
- Forbidden operations
- Unexpected server errors

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
├── .env
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
└── server.js

Future Improvements

- Automated API tests
- API documentation with Swagger
- Password reset functionality
- Account deletion with appropriate authorization
- Deployment to a production hosting platform

Author

Ayman Abdul-Ilah Al-Hamad

GitHub: https://github.com/aymanalham