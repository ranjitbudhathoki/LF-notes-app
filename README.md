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
cp .env.example .env

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

# Engineering Decisions and Assumptions made during the development of this project

Technologies Used
-------------
- **Hono js**

  I've used Hono js in this project as it is a modern and lightweight web framework for javascript runtimes and it  supports all kinds of js runtimes like node, deno, bun, cloudflare workers, edge functions, and more unlike other frameworks. It is fast, efficient, and easy to use and the best thing is it can be deployed on any platform.

- **Tailwind css**

  I've used Tailwind css for styling the application. It is a utility-first CSS framework that provides a set of pre-built classes that can be used to style HTML elements. It is highly customizable and can be used to create responsive and mobile-first designs. It is also easy to learn and use, and can be integrated with other frameworks like React, Vue, and Angular. It makes designing easier and faster.

- **Shadcn ui**

  I've used Shadcn ui for building reusable components.Shadcn provides collection of components that can be used to build user interfaces. It is highly customizable and can be used to create responsive and mobile-first designs. It provides accessible ui components (styled radix primitives). It is different from other ui libraries like Chakra UI, Material UI, and Ant Design because we own the code and can customize it as per our needs which means we don't have to stick with the default styles.

- **Drizzle orm**

  I've used Drizzle ORM for database operations. It is typesafe and follows a schema-first approach, making database queries safe, predictable, and fully integrated with TypeScript. Compared to other ORMs like Prisma or TypeORM, Drizzle is more lightweight, easier to debug, and better suited for SQLite and edge-based applications. It also keeps SQL close to the developer without abstracting it away too much, which aids in understanding and maintainability.

- **Vite**

  I've used Vite as the build tool and development server for the frontend. It provides lightning-fast startup and hot module replacement during development. Vite is designed for modern web development and works seamlessly with React, Tailwind CSS, and TypeScript, which made it an ideal choice for this project.

- **SQLite**

  I've used SQLite as the database for this project because it is lightweight, file-based relational database that doesn't require a separate server process, making it ideal for the scope of this project. I chose SQLite over other databases like PostgreSQL or MySQL because it's simple to set up, requires zero configuration, and integrates well with Drizzle ORM. Sqlite is not only lightweight but is suitable for production environments as well and scales very well



## Assumptions Made During Database Schema Design

The database schema was designed with the following assumptions and considerations:

### User Management
-   Each `note` and `category` is associated with a specific `user`
-   Users are identified by unique email addresses for authentication
-   User passwords are stored in hashed format
-   Each user operates within their own isolated data space

### Note-Category Relationships

-   **Many-to-Many Relationship**: A note can belong to multiple categories, and a category can contain multiple notes
-   **Bridge Table**: `note_categories` table acts as a brdge table between `notes` and `categories`
-   **Flexible Organization**: Notes can exist without categories (uncategorized notes)
-   **Empty Categories**: Categories can exist without assigned notes

### Data Integrity and Constraints

-   **Cascading Deletes**: All foreign keys use `onDelete: "cascade"` for automatic cleanup
-   **Referential Integrity**: Deleting a user automatically removes their notes, categories, and associations
-   **Unique Constraints**: Note slugs are globally unique for URL generation
-   **Required Fields**: Required fields are marked as NOT NULL
