# ApiChef (Jobs API)

A RESTful API for managing job listings and applications, built with Node.js, Express, and MongoDB.

- [Presentation ](https://docs.google.com/presentation/d/1koaSLvlV7dlSbtDT0RqJIrDIBqMYj1tS/edit?usp=sharing&ouid=116546584301172370696&rtpof=true&sd=true)
- [Project brief](https://docs.google.com/document/d/1kkGZRDlBjDLtXLB8HnklwDJq66q4GaBm/edit?usp=sharing&ouid=116546584301172370696&rtpof=true&sd=true)

## Features

- **CRUD Operations**: Create, Read, Update, and Delete job listings.
- **Job Search**: Search for jobs based on title, location, or company.
- **Pagination**: Get job listings in paginated form.
- **Apply for Jobs**: Submit job applications.
- **Authentication**: User authentication (JWT-based).
- **Role-based Access**: Admins can manage jobs, users can apply for jobs.

## Tech Stack

- **Backend**: Node.js, Express
- **Database**: MongoDB (Mongoose)
- **Authentication**: JSON Web Tokens (JWT)
- **Validation**: Joi for request validation
- **Building and Documentation**: Postman 
- **Version Control**: Git, GitHub
- **Testing**: Jest and Supatest
- **Deployment**: Render

## Requirements

- Node.js (any)
- MongoDB (>= 7.x)

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/ApiChef-Project/ApiChef.git
    ```

2. Navigate into the project directory:

    ```bash
    cd ApiChef/api
    ```

3. Install dependencies:

    ```bash
    npm install
    ```

4. Create a `.env` file in the root directory and add the following environment variables:

    ```env
    PORT=5000
    MONGO_URI=your_mongo_database_uri
    JWT_SECRET=your_secret_key
    ```

5. Start the development server:

    ```bash
    npm run dev
    ```

6. Your API should now be running at `http://localhost:5000`.

## API Endpoints

### Authentication

- **POST** `/api/auth/register`: Register a new user.
- **POST** `/api/auth/login`: Login a user.

### Jobs

- **GET** `/api/jobs`: Get all job listings (paginated).
- **GET** `/api/jobs/:id`: Get a single job listing by ID.
- **POST** `/api/jobs`: Create a new job.
- **PUT** `/api/jobs/:id`: Update a job listing.
- **DELETE** `/api/jobs/:id`: Delete a job listing.

### Job Applications

- **POST** `/api/jobs/:id/apply`: Apply for a job.

## Example Request

**Create a Job**:

```bash
POST /api/jobs
```

Request Body:

```json
{
  "title": "Software Engineer",
  "company": "Tech Corp",
  "location": "New York",
  "description": "We are looking for a skilled software engineer...",
  "salary": 100000
}
```

Response:

```json
{
  "success": true,
  "data": {
    "_id": "609a8f807f456e2c5b7b3e0d",
    "title": "Software Engineer",
    "company": "Tech Corp",
    "location": "New York",
    "description": "We are looking for a skilled software engineer...",
    "salary": 100000,
    "createdAt": "2023-10-15T10:00:00Z"
  }
}
```

## Project Structure

```
├── api/
│   ├── config/
│   │   └── db.js                       # MongoDB connection setup
│   ├── controllers/
│   │   ├── authController.js           # Authentication logic
│   │   ├── jobsController.js           # Job-related logic
│   │   └── applicationController.js    # Application logic
│   ├── middlewares/
│   │   ├── authMiddleware.js           # JWT Authentication middleware
│   │   └── errorHandler.js             # Error handling middleware
│   ├── models/
│   │   ├── Job.js                      # Job model
│   │   ├── User.js                     # User model
│   │   └── Application.js              # Job application model
│   ├── routes/
│   │   ├── authRoutes.js               # Authentication routes
│   │   ├── jobsRoutes.js               # Jobs routes
│   │   └── applicationRoutes.js        # Job application routes
│   ├──.env                             # Environment variables
│   ├── app.js                          # Express app setup
│   └── server.js                       # App entry point
│
├── README.md                           # README.md
└── .gitignore                          # .gitignore
```

## License

This project is licensed under the Apache-2.0 License.
