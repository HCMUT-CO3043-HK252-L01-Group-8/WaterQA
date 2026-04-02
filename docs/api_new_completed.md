# API document
New. Refined. Grouped by functionality.

JSON response format:

- Successful request: 
```{
  "success": true,
  "payload": {
    /* Application-specific data would go here. */
  },
  "timestamp": "2026-04-02T08:27:47.721Z"
}
```
- Failed request:

```
{
  "success": false,
  "payload": {
    /* Application-specific data would go here. */
  },
  "error": {
    "code": 123,
    "message": "An error occurred!"
  }
  "timestamp": "2026-04-02T08:27:47.721Z"
}
```

# Dashboard and login-related operations

1. **GET** `/` (or **GET** `/dashboard`)

Parameters: none

Responses:

|Status code|Description|Response payload example|Links|
|-|-|-|-|
|200|Open dashboard|||
|302|Redirects to login page||`/login`|

2. **GET** `/accounts/all`

Parameters: none

Responses:

|Status code|Description|Response payload example|Links|
|-|-|-|-|
|200|Get all rows from User table in DB in JSON format|Example 1.1||


3. **GET** `/accounts/id/:id`

Parameters: 

|Param name|Request type|Data type|Required?|Description|
|-|:-:|:-:|:-:|-|
|id|path|int|x||

Responses

|Status code|Description|Response payload example|Links|
|:-:|-|-|-|
|200|Get 1 row by user_id (also UID) in JSON format|Example 1.2||





### Response payload examples
Example 1.1
```
{
    "count": 3,
    "rows": [
      {
        "user_id": 1,
        "email": "user1@example.com",
        "phone_number": "0123456789",
        "password_hash": "75320c934ed4d3b0310d0ede33d7e260d4c9e118",
        "role": "User",
        "verification_status": 0,
        "created_at": "2026-03-23T02:59:00.633Z",
        "updated_at": "2026-03-24T00:43:37.796Z"
      }
	]
}
```
Example 1.2
```
{
    "count": 1,
    "rows": [
      {
        "user_id": 1,
        "email": "user1@example.com",
        "phone_number": "0123456789",
        "password_hash": "75320c934ed4d3b0310d0ede33d7e260d4c9e118",
        "role": "User",
        "verification_status": 0,
        "created_at": "2026-03-23T02:59:00.633Z",
        "updated_at": "2026-03-24T00:43:37.796Z"
      }
    ]
}
```
























# Example material
## Parameter table

## Response table

Parameters:

|Param name|Request type|Data type|Required?|Description|
|-|:-:|:-:|:-:|-|
||||||

Responses:

|Status code|Description|Response payload example|Links|
|:-:|-|-|-|
|||||


4. **GET** `/auth/login`

Parameters: none

Responses:

|Status code|Description|Response payload example|Links|
|:-:|-|-|-|
|200|Open login page|||

---

5. **GET** `/accounts/signup`

Parameters: none

Responses:

|Status code|Description|Response payload example|Links|
|:-:|-|-|-|
|200|Open sign up page|||

---

6. **GET** `/dashboard`

Parameters: none

Responses:

|Status code|Description|Response payload example|Links|
|:-:|-|-|-|
|200|Open dashboard page with session data|||
|302|Redirect to login if no session||`/auth/login`|

---

7. **GET** `/accounts/change-password`

Parameters: none

Responses:

|Status code|Description|Response payload example|Links|
|:-:|-|-|-|
|200|Open change password page|||

---

8. **POST** `/auth/login`

Parameters:

|Param name|Request type|Data type|Required?|Description|
|-|:-:|:-:|:-:|-|
|user_id|body|int|x|User ID|
|password|body|string|x|User password|
Responses:

|Status code|Description|Response payload example|Links|
|:-:|-|-|-|
|302|Login success, redirect to dashboard||`/dashboard`|

---

9. **POST** `/accounts/signup`

Parameters:

|Param name|Request type|Data type|Required?|Description|
|-|:-:|:-:|:-:|-|
|email|body|string|x|User email address|
|phone_number|body|string|x|User phone number|
|password|body|string|x|User password|
|role|body|string|x|Role|

Responses:

|Status code|Description|Response payload example|Links|
|:-:|-|-|-|
|302|Create account, login and redirect||`/dashboard`|

---

10. **POST** `/accounts/change-password`

Parameters:

|Param name|Request type|Data type|Required?|Description|
|-|:-:|:-:|:-:|-|
|current_password|body|string|x|Current password|
|new_password|body|string|x|New password|
|confirm_password|body|string|x|Confirm new password|

Responses:

|Status code|Description|Response payload example|Links|
|:-:|-|-|-|
|200|Change password successfully|||

---

# Monitoring data operations

1. **GET** `/data/live`

Parameters: none

Responses:

|Status code|Description|Response payload example|Links|
|:-:|-|-|-|
|200|View live monitoring data in real-time|||

---

2. **GET** `/data/history`

Parameters: none

Responses:

|Status code|Description|Response payload example|Links|
|:-:|-|-|-|
|200|View monitoring data history|||

---

# Forecast operations

1. **GET** `/data/forecast`

Parameters: none

Responses:

|Status code|Description|Response payload example|Links|
|:-:|-|-|-|
|200|Open data forecast page|||

---

2. **POST** `/data/forecast`

Parameters:

|Param name|Request type|Data type|Required?|Description|
|-|:-:|:-:|:-:|-|
|observation_id|body|int|x|Observation ID|
|model_name|body|string|x|Model name|

Responses:

|Status code|Description|Response payload example|Links|
|:-:|-|-|-|
|200|Create data forecast using AI|||

---

# Export operations

1. **GET** `/data/export`

Parameters: none

Responses:

|Status code|Description|Response payload example|Links|
|:-:|-|-|-|
|200|Open export data page|||

---

2. **POST** `/data/export`

Parameters:

|Param name|Request type|Data type|Required?|Description|
|-|:-:|:-:|:-:|-|
|station_id|body|int|x|Station ID|
|file_type|body|string|x|File type|
|path|body|string|x|File path|

Responses:

|Status code|Description|Response payload example|Links|
|:-:|-|-|-|
|200|Create data file in designated path|||

---

# IoT device management

1. **GET** `/devices/all`

Parameters: none

Responses:

|Status code|Description|Response payload example|Links|
|:-:|-|-|-|
|200|Show all IoT devices|||

---

2. **GET** `/devices/id/:id`

Parameters:

|Param name|Request type|Data type|Required?|Description|
|-|:-:|:-:|:-:|-|
|id|path|int|x|Station ID|

Responses:

|Status code|Description|Response payload example|Links|
|:-:|-|-|-|
|200|Show detailed info of an IoT device|||

---

# Manual data input

*(No information available)*

---

# User management

*(No information available)*

