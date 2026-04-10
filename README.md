# MithiVerse - Event Management Platform

[![Live Site](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge)](https://mithiverse-frontend.onrender.com)

A modern, full-stack platform designed to enable creation, discovery, and management of college events, fests, and seminars.

---

## Overview

[MithiVerse](https://mithiverse-frontend.onrender.com) is a full-stack event management application designed for college ecosystems. It enables students to explore different types of events in college such as tech fests,seminars,workshops etc. Students can easily participate in events with secure and seamless payment and email notifier system. 

---

---

## Screenshots

![Screenshot 3](https://lh3.googleusercontent.com/u/0/d/1F5OyXW6amaoxg5i_o2q5VwBI9Ksk4_0o)

![Screenshot 2](https://lh3.googleusercontent.com/u/0/d/1v5sqA15uxyfUzAANKZAS7ASdIqEatmXO)
![Screenshot 1](https://lh3.googleusercontent.com/u/0/d/1zj4wpD-W25gXl6FQu9_Ep2YFLaIr6SvR)



---



## Features

### Authentication & Authorization
* **JWT-Based Auth:** Secure user sessions using JSON Web Tokens.
* **Role-Based Access Control (RBAC):**
    * **Users:** Discover events, register for free or paid events, and manage personal registrations.
    * **Admins:** Full CRUD operations on events, participant management, and user moderation.
* **Route Protection:** Middleware-protected private routes and role-specific visibility.

### Payment Integration
* **Razorpay API:** Secure payment gateway integration for paid events.
* **Verification:** Backend checksum verification for all transactions to prevent fraud.

### Event Discovery & Promotion
* **Smart Search:** Filter events by title and category.
* **Status Tracking:** Expired events are automatically flagged and registrations are disabled.
* **Social Sharing:** Integrated social media sharing and email invitation systems.

### UI/UX & Notifications
* **Automated Emails:** Instant confirmation emails sent upon event registration.
* **Modern Design:** Responsive UI built with Tailwind CSS, featuring skeleton loaders and smooth transitions.

---

## Tech Stack

| Component | Technology |
| :--- | :--- |
| **Frontend** | React.js, Tailwind CSS, Context API |
| **Backend** | Node.js, Express.js, Mongoose |
| **Database** | MongoDB |
| **Security** | Helmet, Express Rate Limiter, JWT |
| **Payments** | Razorpay |

---

## Project Structure

```text
MithiVerse/
├── client/   # React.js frontend
└── server/   # Node.js backend

```

---

---

## Installation and Setup
> [!NOTE]
> KEEP the .env file in the root folder

Frontend Setup

```
cd client
npm install
npm run dev
```
Frontend env variables -
```
VITE_API_URL=

```
Backend Setup

```
cd server
npm install
npm run dev
```

Backend env variables -
```
MONGO_URI=
NODE_ENV=
PORT=
JWT_SECRET=
JWT_EXPIRES_IN=
JWT_COOKIE_EXPIRE=
SMTP_EMAIL=
SMTP_PASSWORD=
FROM_NAME=
FRONTEND_URL=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
FEEDBACK_EMAIL=

```
---
## API Endpoints

### Authentication
* `POST /api/auth/register` - Register a new user
* `POST /api/auth/login` - User login
* `POST /api/auth/logout` - Clear session cookies
* `GET /api/auth//me` - Get current user profile

### Events
* `GET /api/events/` - Fetch all events
* `POST /api/events/` - Create a new event (Admin)
* `GET /api/events/:id` - Get specific event details
* `PATCH /api/events/:id` - Update event (Admin)
* `DELETE /api/events/:id` - Remove event (Admin)
* `POST /api/events/:id/register` - Register for an event
* `DELETE /api/events/:id/unregister` - Cancel registration

### Payments & Emails
* `POST /api/payments/create-order` - Create Razorpay order
* `POST /api/payments/verify-payment` - Verify transaction
* `GET /api/emails/send-invites` - Trigger email invitations
* `POST /api/emails/send-feedback` - Submit user feedback\ (get feedback on `FEEDBACK_EMAIL` \)

---



