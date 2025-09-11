<p align="left">
  <img src="https://blog-app-1729.vercel.app/assets/logo-aNB-VLew.svg" alt="BloomVerse Logo" width="500" style="vertical-align: middle;">
  <h1 style="font-size: 100px; vertical-align: middle;">BloomVerse</span> – A Comprehensive Blogging Platform</h1>
</p>

BloomVerse is a modern, full-stack blogging platform designed to empower users to create, share, and discover engaging content. It offers a rich set of features, including user authentication, blog post management, commenting, liking, saving, and more. Whether you're a seasoned blogger or just starting out, BlogSphere provides the tools and community to thrive.

## 🚀 Key Features

- **User Authentication:** Secure signup, sign-in, and password reset functionality. Google Authentication is also supported. 🔐
- **Blog Post Management:** Create, edit, and delete blog posts with rich text formatting and image uploads. ✍️
- **Commenting System:** Engage in discussions with other users through a nested commenting system. 💬
- **Like and Save Blogs:** Show appreciation for content and save your favorite blogs for later reading. ❤️
- **User Profiles:** Customizable user profiles with the ability to follow other creators. 👤
- **Tag-Based Filtering:** Discover content based on specific tags. 🏷️
- **Search Functionality:** Easily find blogs using keywords. 🔍
- **Responsive Design:** Enjoy a seamless experience on any device. 📱💻
- **Email Verification:** Ensures the authenticity of user accounts. ✅
- **Syntax Highlighting:** Code blocks in blog posts are displayed with syntax highlighting. 💡
- **User Settings:** Manage account settings, including profile picture and password. ⚙️

## 🛠️ Tech Stack

*   **Frontend:**
    *   React: A JavaScript library for building user interfaces.
    *   React Router DOM: For routing and navigation within the React application.
    *   Redux Toolkit: For state management.
    *   React Hot Toast: For displaying toast notifications.
    *   Axios: For making HTTP requests to the backend API.
    *   Tailwind CSS: A utility-first CSS framework for styling.
    *   Vite: A build tool that bundles the frontend code for production.
    *   Shadcn UI: UI components.
    *   React Syntax Highlighter: For syntax highlighting in code blocks.

*   **Backend:**
    *   Node.js: A JavaScript runtime environment.
    *   Express: A web application framework for Node.js.
    *   Mongoose: An Object Data Modeling (ODM) library for MongoDB and Node.js.
    *   MongoDB: A NoSQL database for storing application data.
    *   JWT (JSON Web Tokens): For user authentication and authorization.
    *   Bcrypt: For password hashing.
    *   Cors: Middleware for enabling Cross-Origin Resource Sharing (CORS).
    *   Multer: Middleware for handling file uploads.
    *   Cloudinary: For image storage and retrieval.
    *   Nodemailer: For sending emails (e.g., for password reset, email verification).
    *   Dotenv: For managing environment variables.

*   **Other:**
    *   Firebase: For Google Authentication.

## 📦 Getting Started

### Prerequisites

- Node.js (>=16)
- npm or yarn
- MongoDB installed and running
- Cloudinary account (for image storage)
- Firebase project (for Google Authentication)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd BlogSphere
    ```

2.  **Install backend dependencies:**

    ```bash
    cd backend
    npm install  # or yarn install
    ```

3.  **Configure backend environment variables:**

    *   Create a `.env` file in the `backend` directory.
    *   Add the following environment variables:

        ```
        PORT=5000
        DB_URI=<your-mongodb-connection-string>
        DB_NAME=<your-database-name>
        JWT_SECRET=<your-jwt-secret>
        CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
        CLOUDINARY_API_KEY=<your-cloudinary-api-key>
        CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>
        EMAIL_USER=<your-email-address>
        EMAIL_PASS=<your-email-password>
        FRONTEND_URL=<your-frontend-url>
        ```

4.  **Install frontend dependencies:**

    ```bash
    cd ../frontend
    npm install # or yarn install
    ```

5.  **Configure frontend environment variables:**

    *   Create a `.env` file in the `frontend` directory.
    *   Add the following environment variable:

        ```
        VITE_BACKEND_URL=<your-backend-url>
        ```

6.  **Configure Tailwind CSS:**
    * Ensure `tailwind.config.js` is properly configured with your theme customizations.

7.  **Configure Vite:**
    * Ensure `vite.config.js` is properly configured with plugins and aliases.

### Running Locally

1.  **Start the backend server:**

    ```bash
    cd backend
    npm run dev
    ```

2.  **Start the frontend development server:**

    ```bash
    cd frontend
    npm run dev
    ```

## 💻 Usage

1.  Open your browser and navigate to the frontend URL (usually `http://localhost:5173`).
2.  Sign up for a new account or sign in with an existing account.
3.  Start creating and sharing your blog posts!
4.  Explore the platform, discover new content, and engage with other users.

## 📂 Project Structure

```
BlogSphere/
├── backend/
│   ├── config/
│   │   ├── dbConnect.js
│   │   ├── cloudinaryConfig.js
│   │   └── dotenv.config.js
│   ├── controllers/
│   │   ├── blogController.js
│   │   └── userController.js
│   ├── middlewares/
│   │   └── auth.js
│   ├── models/
│   │   ├── blogModel.js
│   │   └── userModel.js
│   ├── routes/
│   │   ├── blogRoute.js
│   │   └── userRoute.js
│   ├── utils/
│   │   ├── generateToken.js
│   │   ├── multer.js
│   │   └── logger.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── react-components/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── index.css
│   │   └── ...
│   ├── public/
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
├── .gitignore
├── README.md
└── package.json
```

## 📸 Screenshots

(Add screenshots of your application here to showcase its features and design.)

## 🤝 Contributing

We welcome contributions to BlogSphere! If you'd like to contribute, please follow these steps:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and commit them with descriptive commit messages.
4.  Push your changes to your fork.
5.  Submit a pull request to the main repository.

## 📝 License

This project is licensed under the [MIT License](LICENSE).

## 📬 Contact

If you have any questions or suggestions, please feel free to contact us at [your-email@example.com](mailto:your-email@example.com).

## 💖 Thanks

Thank you for checking out BlogSphere! We hope you find it useful and enjoyable.

This is written by [readme.ai](https://readme-generator-phi.vercel.app/), your go-to platform for generating beautiful and informative README files.
