## Setup Instructions
============================

Prerequisites
-------------

Before running this application, make sure you have the following installed on your system:

-   **Node.js**
-   **npm** or **pnpm**(recommended) package manager
-   **Git** (to clone the repository)

Installation & Setup
--------------------

### 1\. Clone the Repository

```
git clone https://github.com/ranjitbudhathoki/LF-notes-app.git
cd LF-notes-app

```

### 2\. Environment Configuration

#### Backend Environment Setup

Navigate to the server directory and set up the environment variables:

```
cd server

```

Copy the example environment file and configure it:

```
cp env.example .env

```

Open the `.env` file and update the variables according to your setup:

```
DATABASE_URL="file:local.db"

JWT_SECRET="your_jwt_secret_key"
JWT_EXPIRES_IN=1d

```

#### Frontend Environment Setup

If there's a `env.example` file in the client directory:

```
cd ../client
cp env.example .env

```


### 3\. Install Dependencies

#### Install Server Dependencies

```
cd server
pnpm install

```

#### Install Client Dependencies

```
cd ../client
pnpm install

```

### 4\. Database Setup

As this project uses SQlite database, we don't have to install any additional dependencies. But make sure the database file exists and is writable.

```
cd server
pnpm run db:generate   # to generate migrations
pnpm run db:migrate    # to apply migrations
```

### 5\. Running the Application

#### Option 1: Run Both Frontend and Backend Separately

**Start the Backend Server:**

```
cd server
pnpm run dev

```

The backend server will start on `http://localhost:3000`

**Start the Frontend Client:**

```
cd client
pnpm run dev

```

The frontend will start on `http://localhost:5173`
