const express = require("express");
const cors = require("cors");
const path = require("path");
const postRoutes = require("./routes/posts");
const commentRoutes = require("./routes/comments");


require("dotenv").config({
    path: path.join(__dirname, "../.env")
});

const db = require("./db");
const authRoutes = require("./routes/auth");

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend files
app.use(express.static(path.join(__dirname, "../frontend")));

// Authentication APIs
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);

// Health check
app.get("/api/health", async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT DATABASE() AS database_name"
        );

        res.json({
            success: true,
            message: "BlogSphere API is running!",
            database: rows[0].database_name
        });
    } catch (error) {
        console.error("Database health check failed:", error.message);

        res.status(500).json({
            success: false,
            message: "Database connection failed."
        });
    }
});

// Unknown API route
app.use("/api", (req, res) => {
    res.status(404).json({
        success: false,
        message: "API route not found."
    });
});

app.listen(PORT, () => {
    console.log("==================================");
    console.log("     BLOGSPHERE SERVER");
    console.log(`     http://localhost:${PORT}`);
    console.log("==================================");
});