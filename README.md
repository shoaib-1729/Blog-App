<p align="left">
  <img src="https://vicharlekhan.vercel.app/assets/logo-aNB-VLew.svg" alt="BloomVerse Logo" width="500" style="vertical-align: middle;">
<span>
  <h1 style="font-size: 100px; vertical-align: middle;">BloomVerse</span> – A Comprehensive Blogging Platform</h1>
</span>
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



### 🔐 Authentication & User Routes


| Method | Endpoint | Description |
|:-------|:----------|:-------------|
| `POST` | `/signup` | Create a new user account |
| `POST` | `/signin` | Login and receive JWT token |
| `GET` | `/users` | Fetch all users |
| `GET` | `/users/:username` | Get user by username |
| `PATCH` | `/users/:id` | Update user profile (auth required) |
| `DELETE` | `/users/` | Delete logged-in user |
| `GET` | `/users/check-username/:username` | Check username availability |
| `GET` | `/verify-email/:verificationToken` | Verify user email |
| `POST` | `/google-auth` | Google OAuth login |
| `PATCH` | `/follow/:creatorId` | Follow/unfollow a creator |
| `POST` | `/users/:username/settings` | Update account settings |
| `PUT` | `/auth/reset-password/:id` | Reset password (auth required) |
| `PUT` | `/auth/forget-password` | Send password reset link |



### 📝 Blog Routes

| Method | Endpoint | Description |
|:-------|:----------|:-------------|
| `GET` | `/blogs` | Get all blogs (with filters/pagination) |
| `GET` | `/blogs/:id` | Fetch specific blog details |
| `POST` | `/blogs` | Create a blog post (auth + image upload) |
| `PUT` | `/blogs/:id` | Edit a blog post (author only) |
| `DELETE` | `/blogs/:id` | Delete a blog post (author only) |
| `POST` | `/blogs/like/:id` | Like/unlike a blog |
| `PATCH` | `/save-blog/:id` | Save/unsave a blog |
| `GET` | `/search-query` | Search blogs |
| `GET` | `/tag/:tagName` | Filter blogs by tag |




### 💬 Comment Routes

| Method | Endpoint | Description |
|:-------|:----------|:-------------|
| `POST` | `/blogs/comment/:id` | Add a comment to a blog |
| `PUT` | `/blogs/edit-comment/:id` | Edit comment |
| `DELETE` | `/blogs/comment/:id` | Delete comment |
| `PATCH` | `/blogs/like-comment/:id` | Like/unlike a comment |
| `POST` | `/comment/:parentCommentId/:id` | Reply to a comment (nested) |  







## 🧱 Scaling the Frontend–Backend Integration for Production 



To ensure **BloomVerse** can handle real-world usage efficiently, the app’s architecture and deployment pipeline are designed with **scalability**, **maintainability**, and **performance** in mind.



### 🔹 1. Frontend Optimization

- **Code Splitting & Lazy Loading:** Reduces bundle size by loading components on demand.  
- **CDN Caching:** Static assets served via **Vercel CDN** for global fast delivery.  
- **Environment-Based Config:** Frontend consumes API via `VITE_BACKEND_URL`, supporting development, staging, and production environments.  
- **Responsive UI:** Built with **Tailwind CSS** and **Shadcn UI**, ensuring smooth rendering across all screen sizes and devices.  



### 🔹 2. Backend Scalability

- **Modular Architecture:** Controllers, routes, and middleware are fully modular, allowing future conversion into microservices.  
- **MongoDB Atlas:** Provides automatic scaling, backups, and global distribution.  
- **Load Balancing:** Easily scalable horizontally using **NGINX** or **AWS Load Balancer**.  
- **Media Handling:** **Cloudinary CDN** offloads image delivery, reducing backend load.  
- **Security:** Implemented **bcrypt** for password hashing, **JWT** for secure authentication, and environment-based secret management.  

### 🔹 3. Deployment & CI/CD

- **Frontend:** Deployed on **Vercel** with automatic caching, build optimization, and instant rollback capabilities.  
- **Backend:** Hosted on **Render**, with potential to migrate to **Docker** or **AWS EC2** for advanced scaling.    
- **Error Monitoring:** Logging middleware using **Winston** and error tracking with **Sentry** ensure scalable observability. 


### 🔹 4. Future Scalability Plan

- Introduce **Redis caching** for trending posts and session management.  
- Implement **message queues** (e.g., Kafka or RabbitMQ) for asynchronous tasks like email delivery and notifications. 
- **CI/CD:** Easy integration with **GitHub Actions** for automated testing and continuous deployment. 
- Containerize the app using **Docker**, and deploy via **Kubernetes** for automatic load balancing and scaling.  
- Add **GraphQL API** support for efficient and flexible data querying.  



> 💡 With this architecture, **BloomVerse** can scale both **vertically** (by increasing resources) and **horizontally** (by adding nodes), while maintaining high performance, security, and reliability.


## 📸 Screenshots

![Hero Page](https://media.licdn.com/dms/image/v2/D4E22AQHQ5vveUQFhkg/feedshare-shrink_1280/B4EZlsILEAHEAw-/0/1758455706976?e=1763596800&v=beta&t=KsljFfrptFd77k8_kvksROI-BtB7OL2E_QTHnFAQ_1g)

![Signin Page](https://media.licdn.com/dms/image/v2/D4E22AQFkHTC2JLCC9g/feedshare-shrink_1280/B4EZlsILD2IQAs-/0/1758455706637?e=1763596800&v=beta&t=Bhjz-EmIkVy1Vf3A1i7mZBUhlpJ0V_UT5BF-sKm0eAE)


![Home Page](https://media.licdn.com/dms/image/v2/D4E22AQH6aN2vczaPkQ/feedshare-shrink_1280/B4EZlsILEXGoAs-/0/1758455707290?e=1763596800&v=beta&t=zIrGUKdSD9r4v6UfrXs7zuvM0QWQ9lDlZNgbOElVeTs)

![User Profile Page](https://media.licdn.com/dms/image/v2/D4E22AQFK6b9ZwInwVA/feedshare-shrink_1280/B4EZlsILEgKgAw-/0/1758455707236?e=1763596800&v=beta&t=y3J7yq8wGdecgSCeUYQIopvZtL7x20j61uwM61JdoD4)


![Edit User Profile Page](https://media.licdn.com/dms/image/v2/D4E22AQFfg2pFbSAJQQ/feedshare-shrink_1280/B4EZlsILEWKcAs-/0/1758455706854?e=1763596800&v=beta&t=WCDeRuiEuEPvPvg64cZFGwL2u8_H9X6PcQA4yKn07yA)

![Add Blog Page](https://media.licdn.com/dms/image/v2/D4E22AQH-vFlo04owTw/feedshare-shrink_1280/B4EZlsILEIKUAw-/0/1758455706647?e=1763596800&v=beta&t=coyAUFKLL4GNFhPNGn17PCoZidsOW8dze2Dt1Sxbr4A)




## 🤝 Contributing

We welcome contributions to BlogSphere! If you'd like to contribute, please follow these steps:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and commit them with descriptive commit messages.
4.  Push your changes to your fork.
5.  Submit a pull request to the main repository.

## 📝 License

This project is licensed under the [MIT License](LICENSE).


## 💖 Thanks

Thank you for checking out BloomVerse! We hope you find it useful and enjoyable.

This is written by [readme.ai](https://readme-generator-phi.vercel.app/), your go-to platform for generating beautiful and informative README files.
