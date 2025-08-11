# TodoTracker 🚀

A full-stack todo application with a React frontend and an Express.js backend. This project utilizes a PostgreSQL database for data persistence and is designed for a smooth developer experience with modern tools like TypeScript, Tailwind CSS, and Drizzle ORM.

### Features ✨

* **Frontend**: A responsive and accessible user interface built with React, TypeScript, and Tailwind CSS.
* **Backend**: A RESTful API powered by Express.js to handle todo operations.
* **Database**: Uses a PostgreSQL database with Drizzle ORM for a type-safe and efficient data layer.
* **State Management**: Implements TanStack Query (React Query) for managing server-side state, caching, and background data fetching.
* **Form Handling**: Features robust form validation using React Hook Form and Zod schemas.
* **UI Components**: Built with `shadcn/ui`, a library of re-usable components styled with Tailwind CSS.
* **Deployment**: Configured for easy deployment to platforms like Vercel.

### Getting Started 🛠️

#### Prerequisites

To run this project, you need to have the following installed:

* Node.js (v18 or higher)
* npm or yarn

#### Installation

1.  Clone the repository:

    ```
    git clone [https://github.com/YOUR_USERNAME/TodoTracker.git](https://github.com/YOUR_USERNAME/TodoTracker.git)
    cd TodoTracker
    ```

2.  Install the dependencies:

    ```
    npm install
    ```

#### Configuration

Create a `.env` file in the root directory and add your database connection string:

```
DATABASE_URL="postgresql://[USER]:[PASSWORD]@[HOST]:[PORT]/[DATABASE]"
```

You can use a service like **Neon Database** for a serverless PostgreSQL instance. The `drizzle.config.ts` file is already configured to use this environment variable.

#### Running the Application

* **Development**:
    This command will start both the frontend and backend with hot-reloading.

    ```
    npm run dev
    ```

    The application will be accessible at `http://localhost:5000`.

* **Production**:
    First, build the application:

    ```
    npm run build
    ```

    Then, start the production server:

    ```
    npm run start
    ```

### Project Structure 📂

```
.
├── client/                 # React frontend source code
│   ├── src/                # Main application source
│   │   ├── components/
│   │   ├── hooks/
│   │   └── ...
│   └── index.html
├── server/                 # Express.js backend source code
│   └── index.ts
├── shared/                 # Shared code (e.g., database schema)
│   └── schema.ts
├── migrations/             # Drizzle ORM database migrations
├── .env.example            # Example environment variables
├── package.json            # Project dependencies and scripts
└── ...
```

### Technologies Used 💻

* **Frontend**:
    * [React](https://reactjs.org/)
    * [TypeScript](https://www.typescriptlang.org/)
    * [Tailwind CSS](https://tailwindcss.com/)
    * [shadcn/ui](https://ui.shadcn.com/)
    * [TanStack Query](https://tanstack.com/query/latest)
    * [Wouter](https://www.npmjs.com/package/wouter)
    * [Vite](https://vitejs.dev/)
* **Backend**:
    * [Express.js](https://expressjs.com/)
    * [TypeScript](https://www.typescriptlang.org/)
    * [Drizzle ORM](https://orm.drizzle.team/)
    * [Zod](https://zod.dev/)
* **Database**:
    * [PostgreSQL](https://www.postgresql.org/)
    * [Neon Database](https://neon.tech/)

### Deployment ☁️

This application is configured to be deployed on **Vercel**. For detailed steps, refer to the `DEPLOYMENT.md` file in this repository.

### Contributing 🙌

Feel free to open issues or submit pull requests.

1.  Fork the repository.
2.  Create a new branch: `git checkout -b feature/your-feature-name`.
3.  Make your changes and commit them: `git commit -m 'feat: Add new feature'`.
4.  Push to the branch: `git push origin feature/your-feature-name`.
5.  Open a pull request.
