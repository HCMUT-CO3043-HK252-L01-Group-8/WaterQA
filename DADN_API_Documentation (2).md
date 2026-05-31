# DADN API Documentation

This document provides a detailed overview of the API endpoints available in the collection.

`{{host}}` is `localhost:{{port}}`.

## Auth

### Login
**Method:** `POST`  
**Endpoint:** `/auth/login`

**Request Body (JSON):**
```json
{
    "id": "4",
    "password": "bluearchive"
}
```

---

### Log out
**Method:** `DELETE`  
**Endpoint:** `/auth/logout`

---

## Account

### Get all
**Method:** `GET`  
**Endpoint:** `/accounts`

---

### Get by id
**Method:** `GET`  
**Endpoint:** `/accounts/:id`

---

### Get my session
**Method:** `GET`  
**Endpoint:** `/accounts/session`

---

### Get my profile info
**Method:** `GET`  
**Endpoint:** `/accounts/profile`

---

### Sign up (create account)
**Method:** `POST`  
**Endpoint:** `/accounts/signup`

**Request Body (JSON):**
```json
{
    "mail": "noa@example.com",
    "phone": "0908765432",
    "password": "bluearchive",
    "confirmPassword": "bluearchive"
}
```

---

### Change password
**Method:** `PUT`  
**Endpoint:** `/accounts/change-password`

**Request Body (JSON):**
```json
{
    "currentPassword": "bluearchive",
    "newPassword": "lovesensei",
    "confirmPassword": "lovesensei"
}
```

---

### Delete account
**Method:** `DELETE`  
**Endpoint:** `/accounts/:id`

---

## Data

### Get data history (no limit)
**Method:** `GET`  
**Endpoint:** `/data/history`

---

### Get data history (with limit)
**Method:** `GET`  
**Endpoint:** `/data/history?rowLimit=4`

---

### Export file (no limit)
**Method:** `GET`  
**Endpoint:** `/data/export`

---

### Export file (with limit)
**Method:** `GET`  
**Endpoint:** `/data/export?rowLimit=5`

---

### Fetch data from Adafruit IO
**Method:** `GET`  
**Endpoint:** `/data/telemetry?feedKey=temp&rowLimit=5`

---

### (WIP) Receive IoT data
**Method:** `POST`  
**Endpoint:** `/data/telemetry`

**Request Body (JSON):**
```json
{
    "stationName": "Station1",
    "temperature": 25.5,
    "humidity": 60
}
```

---

### Get thresholds
**Method:** `GET`  
**Endpoint:** `/data/thresholds`

---

### Get threshold by id
**Method:** `GET`  
**Endpoint:** `/data/thresholds/:id`

---

### Add threshold
**Method:** `POST`  
**Endpoint:** `/data/thresholds/`

**Request Body (JSON):**
```json
{
    "parameter": "temperature",
    "lower_threshold": 20,
    "upper_threshold": 70,
    "severity": "high",
    "station": "3"
}
```

---

### Edit threshold
**Method:** `PUT`  
**Endpoint:** `/data/thresholds/:id`

**Request Body (JSON):**
```json
{
    "parameter": "temperature",
    "lower_threshold": 20,
    "upper_threshold": 67,
    "severity": "high",
    "station": "3"
}
```

---

### Delete threshold
**Method:** `DELETE`  
**Endpoint:** `/data/thresholds/:id`

---

## Devices

### Get all devices
**Method:** `GET`  
**Endpoint:** `/devices`

---

### Get device by id
**Method:** `GET`  
**Endpoint:** `/devices/:id`

---

### Create (add) device
**Method:** `POST`  
**Endpoint:** `/devices`

**Request Body (JSON):**
```json
{
    "station_id": 3,
    "sensor_name": "Secret device from Gehenna",
    "sensor_type": "infared",
    "unit": "boolean",
    "status": "active"
}
```

---

### Edit sensor (admin)
**Method:** `PUT`  
**Endpoint:** `/devices/:id`

**Request Body (JSON):**
```json
{
    "station_id": 2,
    "sensor_name": "Secret device from Abydos",
    "sensor_type": "infared",
    "unit": "boolean",
    "status": "active"
}
```

---

### Rename sensor (user only)
**Method:** `PUT`  
**Endpoint:** `/devices/rename/:id`

**Request Body (JSON):**
```json
{
    "newName": "Mysterious device from Millenium"
}
```

---

### Delete device
**Method:** `DELETE`  
**Endpoint:** `/devices/:id`

---

