# ✍️ BlogSphere — Full-Stack Blogging Platform

BlogSphere is a full-stack blogging web application where users can create, publish, explore, and share blog posts. It also supports comments, allowing users to interact with posts and share their thoughts.

## 🚀 Features

### 👤 User Authentication

* User registration and login
* Password encryption using bcrypt
* JWT-based authentication
* Secure access to protected features

### 📝 Blog Management

* Create and publish blog posts
* Add a title, category, and content
* View published posts
* Explore posts created by the community

### 💬 Comments

* Add comments to blog posts
* View comments from other users
* Delete your own comments

### 🔍 Explore and Search

* Browse published blog posts
* Search for stories
* Organize posts by category
* View post details and comment counts

### 🎨 User Interface

* Clean and responsive interface
* Modern design
* Simple navigation
* Dedicated pages for login, registration, creating posts, and reading stories

## 🛠️ Technologies Used

### Frontend

* HTML5
* CSS3
* JavaScript

### Backend

* Node.js
* Express.js
* REST APIs
* JSON Web Token (JWT)
* bcryptjs

### Database

* MySQL

### Development Tools

* Visual Studio Code
* MySQL Workbench
* Git
* GitHub

## 📁 Project Structure

```text
blog-platform/
├── backend/
│   ├── middleware/
│   ├── routes/
│   │   ├── auth.js
│   │   ├── posts.js
│   │   └── comments.js
│   ├── db.js
│   └── server.js
├── frontend/
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── create-post.html
│   ├── post.html
│   ├── script.js
│   └── style.css
├── .gitignore
├── package.json
└── package-lock.json
```

*Note: The project structure above describes the main files; some additional files may be present.*

## ⚙️ Installation and Setup

### Prerequisites

Install the following before running the project:

* Node.js
* MySQL Server
* Visual Studio Code

### 1. Clone the Repository

```bash
git clone https://github.com/pranavmarimuthu123-cmd/blogsphere.git
```

### 2. Navigate to the Project

```bash
cd blogsphere
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the project root directory.

Add the following variables using your own local MySQL credentials:

```env
PORT=5001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=blog_platform
JWT_SECRET=your_long_random_secret
```

Replace `your_mysql_password` and `your_long_random_secret` with your own values. Do not commit the `.env` file to GitHub.

### 5. Create the Database

Open MySQL Workbench and execute the SQL commands provided for the project to create the `blog_platform` database and its tables.

The application requires these tables:

* `users`
* `posts`
* `comments`

### 6. Start the Server

From the project root directory, run:

```bash
node backend/server.js
```

If the server starts successfully, open:

**Application:** http://localhost:5001

**API Health Check:** http://localhost:5001/api/health

## 🔌 Main API Routes

| Method | Endpoint                | Purpose                      |
| ------ | ----------------------- | ---------------------------- |
| POST   | `/api/auth/register`    | Register a new user          |
| POST   | `/api/auth/login`       | Log in                       |
| GET    | `/api/posts`            | Retrieve blog posts          |
| POST   | `/api/posts`            | Create a blog post           |
| GET    | `/api/comments/:postId` | Retrieve comments for a post |
| POST   | `/api/comments`         | Add a comment                |

*The exact request formats and authentication requirements depend on the implementation in the backend route files.*

## 🧪 Testing

Test the main application workflow:

1. Register a new account.
2. Log in using the registered account.
3. Create and publish a blog post.
4. Open the published post.
5. Add a comment.
6. Confirm that the comment appears.
7. Explore and search for posts.
8. Verify that your posts and comments are stored in MySQL.

## 🎯 Project Objective

The objective of BlogSphere is to gain practical experience in full-stack web development, REST API development, database integration, user authentication, and interactive web application design.

## 👨‍💻 Author

**Pranav**

## 📄 License

This project was developed for educational and internship purposes.
