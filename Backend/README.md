# API Documentation

## `/users/register` Endpoint Documentation

### Description
The `/users/register` endpoint allows new users to register an account. Upon successful registration, the endpoint creates a new user record, hashes the password, and returns a JSON web token (JWT) along with the user data.

### HTTP Method
**POST**

### Request Body
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

#### Field Details
- **fullname.firstname**: (String) User's first name (required).
- **fullname.lastname**: (String) User's last name (required).
- **email**: (String) A valid email address (required, must be unique).
- **password**: (String) User's password with a minimum length of 6 characters (required).

### Responses
#### Success
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

#### Validation Error
- **Status Code**: `422 Unprocessable Entity`
- **Response Body**:
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



## Example Response
- `user` (object):
  - `fullname` (object):
    - `firstname` (string): User's first name
    - `lastname` (string): User's last name
  - `email` (string): Users's email (must be valid)
  - `password` (string): Users's password (must be min 6)
  - `token` (string): JWT Token

---

## `/users/login` Endpoint Documentation

### Description
The `/users/login` endpoint allows existing users to log in by providing their email and password. Upon successful authentication, the endpoint returns a JSON web token (JWT) along with the user data.

### HTTP Method
**POST**

### Request Body
The endpoint expects a JSON payload with the following structure:

```json
{
  "email": "johndoe@example.com",
  "password": "securePassword123"
}
```

#### Field Details
- **email**: (String) A valid email address (required).
- **password**: (String) User's password (required).

### Responses
#### Success
- **Status Code**: `200 OK`
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

#### Validation Error
- **Status Code**: `422 Unprocessable Entity`
- **Response Body**:
  ```json
  {
    "errors": [
      {
        "msg": "Invalid email address",
        "param": "email",
        "location": "body"
      },
      {
        "msg": "Password is required",
        "param": "password",
        "location": "body"
      }
    ]
  }
  ```

#### Authentication Error
- **Status Code**: `401 Unauthorized`
- **Response Body**:
  ```json
  {
    "error": "Invalid email or password"
  }
  ```


## Example Response
- `user` (object):
  - `fullname` (object):
    - `firstname` (string): User's first name
    - `lastname` (string): User's last name
  - `email` (string): Users's email (must be valid)
  - `password` (string): Users's password (must be min 6)
  - `token` (string): JWT Token



---

## Notes
- Both endpoints use `express-validator` to validate input data.
- Passwords are hashed using bcrypt before saving to the database.
- JWT tokens are generated for authenticated users with a 1-hour expiration.