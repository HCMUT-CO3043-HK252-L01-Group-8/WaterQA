# DADN API Documentation

This document provides a detailed overview of the API endpoints available in the backend server.
**Note**: The API is accessible via `http://localhost:3000` or the production domain.

---

## 1. Auth & Session Management

### 1.1. Login (Email/Password)
**Method:** `POST`  
**Endpoint:** `/auth/login`
**Request Body (JSON):**
```json
{
    "email": "user@example.com",
    "password": "yourpassword"
}
```

### 1.2. Login with Google (OAuth)
**Method:** `POST`  
**Endpoint:** `/auth/google`
**Request Body (JSON):**
```json
{
    "name": "User Name",
    "email": "user@example.com",
    "picture": "https://url-to-profile-picture.jpg"
}
```

### 1.3. Get Current Session
**Method:** `GET`  
**Endpoint:** `/auth/me`
**Description:** Retrieves information of the currently logged-in user. Requires an active session.

### 1.4. Log out
**Method:** `DELETE`  
**Endpoint:** `/auth/logout`

### 1.5. Forgot Password (Send OTP)
**Method:** `POST`
**Endpoint:** `/auth/forgot-password`
**Request Body (JSON):**
```json
{
    "email": "user@example.com"
}
```

### 1.6. Verify OTP
**Method:** `POST`
**Endpoint:** `/auth/verify-otp`
**Request Body (JSON):**
```json
{
    "email": "user@example.com",
    "otp": "123456"
}
```

### 1.7. Reset Password
**Method:** `POST`
**Endpoint:** `/auth/reset-password`
**Request Body (JSON):**
```json
{
    "email": "user@example.com",
    "otp": "123456",
    "new_password": "newpassword123"
}
```

---

## 2. Account Management

### 2.1. Get All Users
**Method:** `GET`  
**Endpoint:** `/accounts`

### 2.2. Get User By ID
**Method:** `GET`  
**Endpoint:** `/accounts/:id`

### 2.3. Get My Profile Info
**Method:** `GET`  
**Endpoint:** `/accounts/me`
**Response Body (JSON):**
```json
{
    "success": true,
    "payload": {
        "user_id": 1,
        "name": "User Name",
        "email": "user@example.com",
        "role": "User",
        "phone_number": "0901234567",
        "email_notifications": 1
    },
    "timestamp": "2026-06-02T10:00:00.000Z"
}
```

### 2.4. Update Email Notifications
**Method:** `PUT`
**Endpoint:** `/accounts/me/email-notifications`
**Request Body (JSON):**
```json
{
    "email_notifications": 1
}
```
*(Requires active session)*

### 2.5. Sign Up (Create Account)
**Method:** `POST`  
**Endpoint:** `/accounts`
**Request Body (JSON):**
```json
{
    "email": "newuser@example.com",
    "phone_number": "0908765432",
    "password": "yourpassword",
    "role": "User"
}
```

### 2.6. Change Password
**Method:** `PUT`  
**Endpoint:** `/accounts/me/password`
**Request Body (JSON):**
```json
{
    "current_password": "yourpassword",
    "new_password": "newpassword",
    "confirm_password": "newpassword"
}
```

### 2.7. Request Delete Account OTP
**Method:** `POST`  
**Endpoint:** `/accounts/me/delete-otp`
**Description:** Generates an OTP and sends it to the authenticated user's email to confirm account deletion.

### 2.8. Delete Account (Self)
**Method:** `DELETE`  
**Endpoint:** `/accounts/me`
**Request Body (JSON):**
```json
{
    "otp": "123456"
}
```
**Description:** Deletes the currently authenticated user's account after verifying the OTP.

### 2.9. Delete Account (Admin)
**Method:** `DELETE`  
**Endpoint:** `/accounts/:id`
**Description:** Allows an Admin to delete a user's account by ID. Requires an active session with Admin role.

---

## 3. Data & Thresholds

### 3.1. Get Data History (JSON)
**Method:** `GET`  
**Endpoint:** `/data/history`
**Description:** Retrieves raw JSON monitoring data history.

### 3.2. Export Data File
**Method:** `GET`  
**Endpoint:** `/data/export`

### 3.3. Get Telemetry Data (Fetch from Adafruit IO)
**Method:** `GET`  
**Endpoint:** `/data/telemetry`

### 3.4. Get Thresholds (JSON Data)
**Method:** `GET`  
**Endpoint:** `/data/thresholds`

### 3.5. Add Threshold
**Method:** `POST`  
**Endpoint:** `/data/thresholds`

### 3.6. Edit Threshold
**Method:** `PUT`  
**Endpoint:** `/data/thresholds/:id`

### 3.7. Delete Threshold
**Method:** `DELETE`  
**Endpoint:** `/data/thresholds/:id`

---

## 4. Devices & IoT Sensors

### 4.1. Get All Devices
**Method:** `GET`  
**Endpoint:** `/devices`

### 4.2. Get Device By ID
**Method:** `GET`  
**Endpoint:** `/devices/:id`

### 4.3. Rename Sensor (User Only)
**Method:** `PATCH`  
**Endpoint:** `/devices/:id/name`
**Request Body (JSON):**
```json
{
    "newName": "Mysterious device from Millenium"
}
```

*(Note: Admin endpoints like `POST /devices`, `PUT /devices/:id`, `DELETE /devices/:id` are currently disabled/commented out in the codebase.)*

---

## 5. Machine Learning Model

### 5.1. Predict Water Potability
**Method:** `POST`
**Endpoint:** `/model/predict-potability`
**Request Body (JSON):**
```json
{
    "ph": 8.32,
    "Hardness": 207.25,
    "Solids": 28049.65,
    "Chloramines": 8.83,
    "Sulfate": 297.81,
    "Conductivity": 358.73,
    "Organic_carbon": 18.71,
    "Trihalomethanes": 60.91,
    "Turbidity": 4.05
}
```

---

## 6. Dashboard

### 6.1. Get Dashboard Page
**Method:** `GET`
**Endpoint:** `/dashboard/`
**Description:** Renders the dashboard HTML page. Requires authentication.
