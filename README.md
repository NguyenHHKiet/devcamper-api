### Node.JS API for Devcamper

> Project Description DevCamper is a fully functional application that allows users to search, create, manage, and evaluate bootcamps. With rich features such as pagination, filtering, and authentication, this project provides a powerful platform for managing and evaluating bootcamp courses. Security is a top priority with encryption mechanisms, common attack protection, and request rate limiting.

## Usage

1. Create and configure the `config/config.env` file with your settings.
2. Install dependencies and manage the database:
   ```bash
   cd devcamper-api
   yarn
   node seeder -i  # Create database
   node seeder -d  # Delete database
   ```

## Tech Stack

- Node.js / Express.js
- Mongoose
- Husky / Prettier / ESLint
- MongoDB

## Documentation

- [DevCamper API Documentation](https://documentation-devcamperapi.netlify.app/)
- [Docgen](https://github.com/thedevsaddam/docgen?tab=readme-ov-file)

### API Endpoints

#### Base URL: `/api/v1/`

| Resource                | GET           | POST                                    | PUT                 | DELETE       |
|-------------------------|---------------|----------------------------------------|---------------------|--------------|
| **Bootcamps**           | `/`, `/:id`   | `/`                                    | `/:id`, `/:id/photo`| `/:id`       |
| **Courses**             | `/`, `/:id`   |                                        | `/:id`              | `/:id`       |
| **Reviews**             |               |                                        |                     |              |
| **Auth**                | `/me`         | `/register`, `/login`, `/forgetpassword`| `/updatedetails`    |              |
| **Forget Password**     |               |                                        | `/:resettoken`      |              |
| **Users**               | `/`, `/:id`   | `/`                                    | `/:id`              | `/:id`       |

**Query Parameters:**

- Filter: `housing=true&averageCost[lte]=100`
- Select: `select=name&sort=-name`
- Pagination: `page=2&limit=10`

### Bootcamps

- **List**: All bootcamps with pagination, filtering, and field selection.
- **Search**: By radius from a zipcode.
- **Create**: Authenticated users with roles "publisher" or "admin".
- **Update/Delete**: Owner only.
- **Photo Upload**: Owner only.
- **Calculate**: Average course cost and review rating.

### Courses

- **List**: All or specific bootcamp's courses with pagination and filtering.
- **Create/Update/Delete**: Authenticated users with roles "publisher" or "admin".

### Reviews

- **List**: All reviews or specific bootcamp's reviews with pagination and filtering.
- **Create/Update/Delete**: Authenticated users with roles "user" or "admin".

### Users & Authentication

- **JWT/Cookie**: For authentication, with a 30-day expiry.
- **Registration/Login**: User roles include "user" or "publisher".
- **Password Reset**: Request reset with a hashed token valid for 10 minutes.
- **CRUD Operations**: Admin-only for user management.

## Security

- Password and token encryption
- XSS prevention
- NoSQL injection prevention
- Rate limiting: 100 requests per 10 minutes
- HTTP parameter pollution prevention
- Security headers (helmet)
- CORS enabled for public access
