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

## `/users/profile` Endpoint Documentation

### Description
Get the authenticated user's profile information. This endpoint requires authentication using a valid JWT token.

### HTTP Method
**GET**

### Authentication
Requires a valid JWT token in one of:
- Cookie named 'token'
- Authorization header: `Bearer <token>`

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
    }
  }
  ```

#### Authentication Error
- **Status Code**: `401 Unauthorized`
- **Response Body**:
  ```json
  {
    "error": "Unauthorized"
  }
  ```

### Example cURL Request
```bash
curl -X GET http://localhost:3000/users/profile \
  -H "Authorization: Bearer <your_jwt_token>"
```

## Example Response
- `user` (object):
  - `fullname` (object):
    - `firstname` (string): User's first name
    - `lastname` (string): User's last name
  - `email` (string): Users's email (must be valid)
 

---

## `/users/logout` Endpoint Documentation

### Description
Logs out the current user by invalidating their JWT token and clearing the token cookie.

### HTTP Method
**GET**

### Authentication
Requires a valid JWT token in one of:
- Cookie named 'token'
- Authorization header: `Bearer <token>`

### Responses
#### Success
- **Status Code**: `200 OK`
- **Response Body**:
  ```json
  {
    "message": "Logged out successfully"
  }
  ```

#### Authentication Error
- **Status Code**: `401 Unauthorized`
- **Response Body**:
  ```json
  {
    "error": "Unauthorized"
  }
  ```

### Effects
- Clears the 'token' cookie
- Adds the token to blacklist to prevent reuse
- Invalidates the current session

### Example cURL Request
```bash
curl -X GET http://localhost:3000/users/logout \
  -H "Authorization: Bearer <your_jwt_token>"
```

---

# Captain API Documentation

## `/captains/register` Endpoint Documentation

### Description
The `/captains/register` endpoint allows new captains to register their account with vehicle details. Upon successful registration, the endpoint creates a new captain record and returns the captain data.

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
  "password": "securePassword123",
  "vehicle": {
    "color": "Black",
    "plate": "ABC-123",
    "capacity": 4,
    "vehicleType": "car"
  }
}
```

#### Field Details
- **fullname**
  - **firstname**: (String) Captain's first name (required)
  - **lastname**: (String) Captain's last name (required)
- **email**: (String) Valid email address (required, must be unique)
- **password**: (String) Password with minimum 6 characters (required)
- **vehicle**
  - **color**: (String) Vehicle color (required)
  - **plate**: (String) Vehicle plate number (required)
  - **capacity**: (Number) Vehicle passenger capacity, minimum 1 (required)
  - **vehicleType**: (String) Type of vehicle, must be one of: 'car', 'motorcycle', 'auto' (required)

### Responses
#### Success
- **Status Code**: `201 Created`
- **Response Body**:
  ```json
  {
    "captain": {
      "_id": "captain_id",
      "fullname": {
        "firstname": "John",
        "lastname": "Doe"
      },
      "email": "johndoe@example.com",
      "status": "inactive",
      "vehicle": {
        "color": "Black",
        "plate": "ABC-123",
        "capacity": 4,
        "vehicleType": "car"
      },
      "socketID": null,
      "location": {
        "latitude": null,
        "longitude": null
      }
    }
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
        "msg": "Vehicle capacity must be at least 1",
        "param": "vehicle.capacity",
        "location": "body"
      },
      {
        "msg": "Invalid vehicle type",
        "param": "vehicle.vehicleType",
        "location": "body"
      }
    ]
  }
  ```

#### Conflict Error
- **Status Code**: `409 Conflict`
- **Response Body**:
  ```json
  {
    "error": "Captain with this email already exists"
  }
  ```

## Example Response
- `user` (object):
  - `fullname` (object):
    - `firstname` (string): User's first name
    - `lastname` (string): User's last name
  - `email` (string): Users's email (must be valid)
  - `password` (string): Users's password (must be min 6)
  - `vehicle` (object):
    - `color`(string): Vehicle Color
    - `plate`(string): Vehicle's Number Plate
    - `capacity`(number): Vehicle Passenger Capacity (minimum 1)
    - `VehicleType`(string): Type of Vehicle (must be 'car', 'motorcycle' or 'auto')
  - `token` (string): JWT Token

### Captain Model Details
#### Status Types
- **active**: Captain is currently available for rides
- **inactive**: Captain is not available for rides

#### Vehicle Types
- **car**: Standard car service
- **motorcycle**: Motorcycle service
- **auto**: Auto-rickshaw service

### Notes
- Newly registered captains are set to 'inactive' status by default
- Location coordinates are initially set to null until the captain updates their location
- Password is hashed using bcrypt before storage
- Email addresses are stored in lowercase and must be unique
- Vehicle capacity must be at least 1 passenger

---

## `/captains/profile` Endpoint Documentation

### Description
Get the authenticated captain's profile information including vehicle and status details. This endpoint requires captain authentication using a valid JWT token.

### HTTP Method
**GET**

### Authentication
Requires a valid JWT token in one of:
- Cookie named 'token'
- Authorization header: `Bearer <token>`

### Responses
#### Success
- **Status Code**: `200 OK`
- **Response Body**:
  ```json
  {
    "captain": {
      "_id": "captain_id",
      "fullname": {
        "firstname": "John",
        "lastname": "Doe"
      },
      "email": "johndoe@example.com",
      "status": "active",
      "vehicle": {
        "color": "Black",
        "plate": "ABC-123",
        "capacity": 4,
        "vehicleType": "car"
      },
      "socketID": null,
      "location": {
        "latitude": 12.345678,
        "longitude": 98.765432
      }
    }
  }
  ```

#### Authentication Error
- **Status Code**: `401 Unauthorized`
- **Response Body**:
  ```json
  {
    "error": "Unauthorized"
  }
  ```

### Example cURL Request
```bash
curl -X GET http://localhost:3000/captains/profile \
  -H "Authorization: Bearer <your_jwt_token>"
```

---

## `/captains/logout` Endpoint Documentation

### Description
Logs out the current captain by invalidating their JWT token and clearing the token cookie. This endpoint requires captain authentication.

### HTTP Method
**GET**

### Authentication
Requires a valid JWT token in one of:
- Cookie named 'token'
- Authorization header: `Bearer <token>`

### Responses
#### Success
- **Status Code**: `200 OK`
- **Response Body**:
  ```json
  {
    "message": "Logged out successfully"
  }
  ```

#### Authentication Error
- **Status Code**: `401 Unauthorized`
- **Response Body**:
  ```json
  {
    "error": "Unauthorized"
  }
  ```

### Effects
- Clears the 'token' cookie
- Adds the token to blacklist to prevent reuse
- Invalidates the current captain session

### Example cURL Request
```bash
curl -X GET http://localhost:3000/captains/logout \
  -H "Authorization: Bearer <your_jwt_token>"
```

---

## Notes
- Both endpoints use `express-validator` to validate input data.
- Passwords are hashed using bcrypt before saving to the database.
- JWT tokens are generated for authenticated users with a 1-hour expiration.

---

## Authentication Notes
- Protected endpoints require a valid JWT token
- Tokens can be provided via:
  - HTTP-only cookie named 'token'
  - Authorization header in format: `Bearer <token>`
- Blacklisted tokens cannot be reused
- Tokens expire after 24 hours