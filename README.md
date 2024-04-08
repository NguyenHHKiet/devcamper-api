# Node.JS API devcamper-api

> Create a real-world backend for a bootcamp directory app, backend API for DevCampers application to manage bootcamps,courses,reviews,users and authentication

## Usage

Create a "config/config.env" file and update the values/settings to your own

```javascript
cd devcamper-api
yarn

// Automated create database of MongoDB
node seeder -i // create
node seeder -d // delete
```

## Tech Stack

-   NodeJS/ExpressJS
-   Mongoose
-   Husky/Prettier/ESLint
-   MongoDB

## Documentation

-   Use Postman to create documentation
-   [Documentation DevCamper API](https://documentation-devcamperapi.netlify.app/)

### GET/POST/PUT/DELETE

root: `/api/v1/`

| Header Routes               | GET        | POST                                                                     | PUT                 | DELETE |
| --------------------------- | ---------- | ------------------------------------------------------------------------ | ------------------- | ------ |
| (parent) bootcamps          | `/`,`/:id` | `/`                                                                      | `/:id`,`/:id/photo` | `/:id` |
| (child) :bootcampId/courses | `/`        | `/`                                                                      |                     |        |
| courses                     | `/`,`/:id` |                                                                          | `/:id`              | `/:id` |
| reviews                     |            |                                                                          |                     |        |
| (parent) auth               | `/me`      | <ul><li>`/register`</li><li>`/login`</li><li>`/forgetpassword`</li></ul> | `/updatedetails`    |        |
| (child) forgetpassword      |            |                                                                          | `/:resettoken`      |        |
| users                       | `/`,`/:id` | `/`                                                                      | `/:id`              | `/:id` |

<ul>
    <li>Filter Values: housing=true&averageCost[lte]=100</li>
    <li>Query Properties: select=name&sort=-name</li>
    <li>Limit Items: page=2&limit=10</li>
</ul>

### Bootcamps

-   List all bootcamps in the database
    -   Pagination
    -   Select specific fields in a result
    -   Limit the number of results
    -   Filter by fields
-   Search bootcamps by radius from zipcode
    -   Use a geocoder to get the exact location and coords from a single address field
-   Get a single bootcamp
-   Create a new bootcamp
    -   Authenticated users only
    -   Must have the role "publisher" or "admin"
    -   Only one bootcamp per publisher (admins can create more)
    -   Field validation via Mongoose
-   Upload a photo for bootcamp
    -   Owner only
    -   Photo will be uploaded to a local filesystem
-   Update bootcamps
    -   Owner only
    -   Validation on update
-   Delete Bootcamp
    -   Owner only
-   Calculate the average cost of all courses for a bootcamp
-   Calculate the average rating from the reviews for a bootcamp

### Courses

-   List all courses for bootcamp
-   List all courses in general
    -   Pagination, filtering, etc
-   Get a single course
-   Create a new course
    -   Authenticated users only
    -   Must have the role "publisher" or "admin"
    -   Only the owner or an admin can create a course for a bootcamp
    -   Publishers can create multiple courses
-   Update course
    -   Owner only
-   Delete Course
    -   Owner only

### Reviews

-   List all reviews for a bootcamp
-   List all reviews in general
    -   Pagination, filtering, etc
-   Get a single review
-   Create a review
    -   Authenticated users only
    -   Must have the role "user" or "admin" (no publishers)
-   Update review
    -   Owner only
-   Delete Review
    -   Owner only

### Users & Authentication

-   Authentication will be very efficient using JWT/cookies
    -   JWT and cookie should expire in 30 days
-   User Registration
    -   Register as a "user" or "publisher"
    -   Once registered, a token will be sent along with a cookie (token = xxx)
    -   Passwords must be hashed
-   User login
    -   User can login with email and password
    -   Plain text password will compare with stored hashed password
    -   Once logged in, a token will be sent along with a cookie (token = xxx)
-   User logout
    -   Cookie will be sent to set token = none
-   Get user
    -   Route to get the currently logged-in user (via token)
-   Password reset (lost password)
    -   User can request to reset password
    -   A hashed token will be emailed to the user's registered email address
    -   A put request can be made to the generated URL to reset the password
    -   The token will expire after 10 minutes
-   Update user info
    -   Authenticated user only
    -   Separate route to update password
-   User CRUD
    -   Admin only
-   Users can only be made admin by updating the database field manually

## Security

-   Encrypt passwords and reset tokens
-   Prevent cross-site scripting - XSS
-   Prevent NoSQL injections
-   Add a rate limit for requests of 100 requests per 10 minutes
-   Protect against HTTP param pollution
-   Add headers for security (helmet)
-   Use Cors to make API public (for now)
