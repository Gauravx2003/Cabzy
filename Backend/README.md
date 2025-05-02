# `/users/register` Endpoint Documentation

## Description
The `/users/register` endpoint allows new users to register an account. Upon successful registration, the endpoint creates a new user record, hashes the password, and returns a JSON web token (JWT) along with the user data.

## HTTP Method
**POST**

## Request Body
The endpoint expects a JSON payload with the following structure:

```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "johndoe@example.com",
  "password": "securePassword123"
}
```

### Field Details
- **fullname.firstname**: (String) User's first name (required).
- **fullname.lastname**: (String) User's last name (required).
- **email**: (String) A valid email address (required, must be unique).
- **password**: (String) User's password with a minimum length of 6 characters (required).

## Responses
### Success
- **Status Code**: `201 Created`
- **Response Body**:
  ```json
  {
    "user": {
      "_id": "user_id",
      "fullname": {
        "firstname": "John",
        "lastname": "Doe"
      },
      "email": "johndoe@example.com",
      "socketID": null
    },
    "token": "generated_jwt_token"
  }
  ```

### Validation Error
- **Status Code**: `422 Unprocessable Entity`
- **Response Body**: Returns an array of validation error messages.
  ```json
  {
    "errors": [
      {
        "msg": "First name is required",
        "param": "fullname.firstname",
        "location": "body"
      },
      {
        "msg": "Invalid email address",
        "param": "email",
        "location": "body"
      }
    ]
  }
  ```

### Other Errors
- **Status Code**: `400 Bad Request`
- **Response Body**: Returns an error message if any issues occur during the user creation process.
  ```json
  {
    "error": "Detailed error message"
  }
  ```

## Example cURL Request
```bash
curl -X POST http://localhost:3000/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "johndoe@example.com",
    "password": "securePassword123"
  }'
```

## Example Response
- `user` (object):
  - `fullname` (object):
    - `firstname` (string): User's first name
    - `lastname` (string): User's last name
  - `email` (string): Users's email (must be valid)
  - `password` (string): Users's password (must be min 6)
  - `token` (string): JWT Token

## Notes
- The endpoint uses `express-validator` to validate input data.
- Passwords are hashed using bcrypt before saving to the database.
- Upon a successful registration, a JWT is generated for the user with a 1-hour expiration.