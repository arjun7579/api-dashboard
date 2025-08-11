# API-Pulse: API Monitoring & Analytics Dashboard

API-Pulse is a full-stack MERN application that helps developers monitor the health and performance of their APIs. It features real-time monitoring, data visualization, alerting, and an AI-powered anomaly detection system.

## Features

-   **User Authentication**: Secure user registration and login using JWT.
-   **API Endpoint Management**: CRUD functionality for API endpoints.
-   **Automated Monitoring**: A cron job checks API health every minute.
-   **Real-time Dashboard**: View uptime, latency, and status for each API.
-   **Data Visualization**: Charts showing latency over time using Recharts.
-   **Email Alerts**: Get notified via email when an API goes down.
-   **AI Anomaly Detection**: Flags unusual latency spikes based on statistical analysis.

## Technology Stack

-   **Backend**: Node.js, Express.js, MongoDB, Mongoose
-   **Frontend**: React, Vite, React Router
-   **Styling**: Tailwind CSS
-   **Authentication**: JSON Web Tokens (JWT)
-   **Libraries**: Axios, node-cron, Nodemailer, Recharts, bcryptjs

---

## Setup & Installation

### Prerequisites

-   Node.js (v18 or later)
-   npm
-   MongoDB (local instance or a cloud service like MongoDB Atlas)

### 1. Backend Setup

```bash
# 1. Navigate to the backend directory
cd backend

# 2. Install dependencies
npm install

# 3. Create a .env file in the `backend` root
#    and add the following variables:
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key

# Nodemailer setup (using a service like Ethereal for testing is recommended)
EMAIL_HOST=smtp.ethereal.email
EMAIL_PORT=587
EMAIL_USER=your_ethereal_user
EMAIL_PASS=your_ethereal_password

# 4. Start the backend server
npm run dev