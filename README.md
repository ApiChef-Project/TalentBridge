# TalentBridge (Jobs API)

A RESTful API for managing job listings and applications, built with Node.js, Express, and MongoDB.

- [Presentation ](https://docs.google.com/presentation/d/1odEMsBKAUlZSC6HeYWYpQc2Z2_z-db2I/edit?usp=sharing&ouid=116546584301172370696&rtpof=true&sd=true)
- [Project documentation](https://documenter.getpostman.com/view/38037353/2sAY4vi3mR)

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
- **Validation**: Validator
- **Building, Documentation and API Testing**: Postman
- **Version Control**: Git, GitHub
- **Testing**: Jest and Supatest
- **Deployment**: Render

## Requirements

- Node.js (any)
- MongoDB (>= 7.x)

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/ApiChef-Project/TalentBridge.git
    ```

2. Navigate into the project directory:

    ```bash
    cd TalentBridge/api
    ```

3. Install dependencies:

    ```bash
    npm install
    ```

4. Create a `.env` file in the root directory and add the following environment variables:

    ```env
    PORT=3000
    MONGO_URI=your_mongo_database_uri
    JWT_SECRET=your_secret_key
    ```

5. Start the development server:

    ```bash
    npm run dev
    ```

6. Your API should now be running at `http://localhost:3000`.

## API Endpoints

### What an unauthenticated user can do:
### User related

- ```POST /auth/signup```

### Company related

- ```GET /companies```
- ```GET /companies/:id```

### Jobs related

- ```GET /jobs```
- ```GET /jobs/:id```
- ```GET /jobs/search```

### Protected Routes
The following endpoints require a logged in client

### User related

- ```GET /auth/me```
- ```GET /auth/updateMe```
- ```GET /auth/deleteMe```
- ```POST /auth/logout```

### Company related

- ```POST /companies```
- ```PUT /companies/:id```
- ```DELETE /companies/:id```

### Company-Application interactions (protected)
-  ```GET companies/company_id/jobs/job_id/applications```
-  ```POST companies/company_id/jobs/job_id/applications/accept```
-  ```POST companies/company_id/jobs/job_id/applications/review```
-  ```POST companies/company_id/jobs/job_id/applications/review```


### Jobs related

- ```POST /jobs```
- ```PUT /jobs/:id```
- ```DELETE /jobs/:id```

### Applications

- ```GET /applications```
- ```GET /applications/:id```
- ```POST /applications```
- ```PUT /applications/:id```
- ```DELETE /applications/:id```


## Example Objects
The basic structure of the mongoose objects in these project are as follows

### User Object

```json
{
    "firstName": "John",
    "lastName": "Doe",
    "email": "johndoe@email.com",
    "phone": "878-593-4766",
    "hashedPassword": "$2a$10$dNKgJh93FrUsfoMB7TbkWe.L/31B0LIMaxfhN3/GUIjceskVKm9Be",
    "applications": [ "6721cc78012a956141050061" ],
    "refreshToken": "",
    "_id": "671f605444ff4e47ed0d63c2",
    "createdAt": "2024-10-28T09:58:44.812Z",
    "updatedAt": "2024-10-28T09:58:44.812Z",
    "__v": 0
}

```

### Company Object

```json
{
    "name": "Meta",
    "description": "Company that specialises in data and targeted social media marketing.",
    "email": "meta@meta.com",
    "authorizedEmails": [
        "johndoe@email.com"
    ],
    "phone": "599-965-5396",
    "_id": "671faa8dc6e4a771a590d3fa",
    "createdAt": "2024-10-28T15:15:25.935Z",
    "updatedAt": "2024-10-28T15:15:25.935Z",
    "__v": 0
}

```

### Job Object

```json
{
    "title": "Junior Frontend Engineer",
    "type": "Remote",
    "description": "A Junior Frontend Developer skilled in creating responsive and user-friendly interfaces. Proficient in HTML, CSS, and JavaScript, with experience in frameworks like React to build dynamic web applications.",
    "salaryRange": "Not Specified",
    "country": "Kenya",
    "location": "Nairobi",
    "company":"6720669efd20bd50a1cb908d",
    "applications": [ "6721cc78012a956141050061" ],
    "_id": "672074aafd20bd50a1cb909b",
    "expiresAt": "2025-10-29T05:37:46.665Z",
    "createdAt": "2024-10-29T05:37:46.675Z",
    "updatedAt": "2024-10-29T05:37:46.675Z",
    "__v": 0
}

```

### Application Object

```json
{
    "_id": "6721cc78012a956141050061",
    "user": "6721ca5a012a95614104fff0",
    "job": "6721cb94012a956141050023",
    "resume": "https://mason.name",
    "status": "pending",
    "createdAt": "2024-10-30T06:04:40.657Z",
    "updatedAt": "2024-10-30T06:04:40.657Z",
    "__v": 0
}

```



## Project Structure

```
.
├── LICENSE
├── NOTES.md
├── README.md
└── api
    ├── app.js
    ├── config
    │   ├── connect.db.js
    │   └── drop.db.js
    ├── controllers
    │   ├── application.controller.js
    │   ├── auth.controller.js
    │   ├── company.controller.js
    │   ├── job.controller.js
    │   └── user.controller.js
    ├── lib
    │   └── utils.js
    ├── middleware
    │   ├── application.middleware.js
    │   ├── auth.middleware.js
    │   ├── error.handler.js
    │   ├── job.middleware.js
    │   └── user.middleware.js
    ├── models
    │   ├── application.model.js
    │   ├── company.model.js
    │   ├── job.model.js
    │   └── user.model.js
    ├── nodemon.json
    ├── package-lock.json
    ├── package.json
    ├── routes
    │   ├── application.routes.js
    │   ├── auth.routes.js
    │   ├── company.routes.js
    │   ├── job.routes.js
    │   └── user.routes.js
    ├── server.js
    └── tests
```

## License

This project is licensed under the Apache-2.0 License.
