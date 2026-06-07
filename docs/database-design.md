# Database Design

This document defines the database architecture for the URL Shortener platform.

The system uses MongoDB as its primary datastore and follows a document-oriented design optimized for scalability, analytics, and future feature expansion.

---

# Goals

The database design should:

- Support millions of shortened URLs
- Enable fast URL redirection
- Support detailed click analytics
- Maintain clear ownership of URLs
- Allow future features such as QR codes, teams, and workspaces
- Scale independently for analytics workloads

---

# Collections Overview

The platform consists of three primary collections:

```text
Users
│
└── URLs
      │
      └── Analytics
```

---

# Entity Relationship Diagram

```text
User
│
│ 1:N
▼
URL
│
│ 1:N
▼
Analytics
```

---

# Users Collection

The Users collection stores authentication and account information.

## Schema

```json
{
  "_id": "ObjectId",
  "name": "John Doe",
  "email": "john@example.com",
  "password": "hashed_password",
  "isVerified": false,
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Fields

| Field      | Type     | Description           |
| ---------- | -------- | --------------------- |
| \_id       | ObjectId | Unique identifier     |
| name       | String   | User name             |
| email      | String   | User email            |
| password   | String   | Hashed password       |
| isVerified | Boolean  | Verification status   |
| createdAt  | Date     | Creation timestamp    |
| updatedAt  | Date     | Last update timestamp |

## Indexes

```js
email: 1;
```

## Constraints

```text
email → unique
```

---

# URLs Collection

The URLs collection stores shortened URLs and their metadata.

## Schema

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "originalUrl": "https://example.com",
  "shortCode": "abc123",
  "customAlias": null,
  "title": "",
  "description": "",
  "qrCodeUrl": "",
  "clickCount": 0,
  "expiresAt": null,
  "isActive": true,
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Fields

| Field       | Type     | Description              |
| ----------- | -------- | ------------------------ |
| \_id        | ObjectId | Unique identifier        |
| userId      | ObjectId | URL owner                |
| originalUrl | String   | Original destination URL |
| shortCode   | String   | Generated unique code    |
| customAlias | String   | User-defined alias       |
| title       | String   | URL title                |
| description | String   | URL description          |
| qrCodeUrl   | String   | QR code location         |
| clickCount  | Number   | Total clicks             |
| expiresAt   | Date     | Expiration date          |
| isActive    | Boolean  | Soft delete status       |
| createdAt   | Date     | Creation timestamp       |
| updatedAt   | Date     | Last update timestamp    |

## Indexes

```js
shortCode: 1;
userId: 1;
createdAt: -1;
```

## Constraints

```text
shortCode → unique
customAlias → unique
```

---

# Analytics Collection

The Analytics collection stores click events separately from URL documents.

This design prevents URL documents from growing indefinitely and improves performance under heavy traffic.

## Schema

```json
{
  "_id": "ObjectId",
  "urlId": "ObjectId",
  "shortCode": "abc123",
  "ipAddress": "192.168.1.1",
  "country": "India",
  "city": "Delhi",
  "browser": "Chrome",
  "os": "Windows",
  "device": "Desktop",
  "referrer": "Google",
  "clickedAt": "Date"
}
```

## Fields

| Field     | Type     | Description       |
| --------- | -------- | ----------------- |
| \_id      | ObjectId | Unique identifier |
| urlId     | ObjectId | Related URL       |
| shortCode | String   | Short URL code    |
| ipAddress | String   | Visitor IP        |
| country   | String   | Visitor country   |
| city      | String   | Visitor city      |
| browser   | String   | Browser name      |
| os        | String   | Operating system  |
| device    | String   | Device type       |
| referrer  | String   | Referring source  |
| clickedAt | Date     | Click timestamp   |

## Indexes

```js
urlId: 1;
clickedAt: -1;
```

---

# Collection Relationships

## User → URLs

```text
One User
    ↓
Many URLs
```

A user can create multiple shortened URLs.

---

## URL → Analytics

```text
One URL
    ↓
Many Analytics Records
```

Each click generates a separate analytics record.

---

# Data Access Patterns

## Create URL

```text
User
    ↓
POST /api/urls
    ↓
Insert URL Document
```

---

## Redirect URL

```text
Short Code
    ↓
Find URL
    ↓
Increment Click Count
    ↓
Create Analytics Record
    ↓
Redirect User
```

---

## Dashboard

```text
User
    ↓
Fetch URLs
    ↓
Aggregate Analytics
    ↓
Display Metrics
```

---

# Scaling Considerations

## URL Collection

Potential Growth:

```text
Millions of URLs
```

Optimization:

- Unique indexes
- ShortCode lookup optimization
- Redis caching layer

---

## Analytics Collection

Potential Growth:

```text
Millions of click events
```

Optimization:

- Separate collection
- Aggregation pipelines
- Analytics archiving strategy

---

# Future Enhancements

The database design supports future features without major schema changes.

Planned additions:

- Team Workspaces
- Link Tags
- Link Categories
- Password Protected URLs
- Scheduled Publishing
- UTM Campaign Tracking
- Public Analytics Sharing
- Multi-Tenant Architecture

---

# Summary

The database architecture follows a scalable document-oriented design with:

- User ownership
- Fast URL lookups
- Dedicated analytics storage
- Optimized indexing strategy
- Support for future expansion

This schema serves as the foundation for all backend APIs and application features.
