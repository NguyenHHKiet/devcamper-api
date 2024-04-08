# What is HTTP?

-   Hyper Text Transfer Protocol
-   Communication between web servers & clients
-   HTTP Requests / Responses
-   Includes header & body

## There are several ways to send authenticated HTTP requests:

-   Send a HTTP header Api-Token: {api_token}, where {api_token} is your API token
-   Send a HTTP header Authorization: Bearer #{token}, where {api_token} is your API token (more info: Token Access Authentication)

You can manage your API token on the API Tokens page. API token does not have an expiration date, you may reset it manually.

## Allowed requests and common responses

Allowed HTTPs requests include:

-   **POST** - to create a resource
-   **PATCH** - to update a resource
-   **PUT** - to replace a resource
-   **GET** - to get a resource or a list of resources
-   **DELETE** - to delete a resource

Here is the description of common server responses:

-   **200 OK** - the request was successful (some API calls may return 201 instead).
-   **204 No Content** - the request was successful but there is no representation to return (i.e. the response is empty).
-   **401 Unauthorized** - authentication failed or user doesn't have permissions for requested operation.
-   **403 Forbidden** - access denied.
-   404 Not Found - resource was not found.
-   **422 Unprocessable Entity** - requested data contain invalid values.

All requests must be sent over HTTPS protocol.
