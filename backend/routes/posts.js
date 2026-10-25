const express = require("express");
const db = require("../db");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

// GET ALL BLOG POSTS
router.get("/", async (req, res) => {
    try {
        const [posts] = await db.execute(`
            SELECT
                p.id,
                p.title,
                p.content,
                p.category,
                p.created_at,
                u.id AS author_id,
                u.name AS author_name,
                (SELECT COUNT(*) FROM comments c
                 WHERE c.post_id = p.id) AS comment_count
            FROM posts p
            JOIN users u ON u.id = p.user_id
            ORDER BY p.created_at DESC
        `);

        res.json({
            success: true,
            count: posts.length,
            posts
        });
    } catch (error) {
        console.error("Fetch posts error:", error.message);
        res.status(500).json({
            success: false,
            message: "Unable to load blog posts."
        });
    }
});

// GET ONE BLOG POST
router.get("/:id", async (req, res) => {
    try {
        const postId = Number(req.params.id);

        if (!Number.isInteger(postId) || postId < 1) {
            return res.status(400).json({
                success: false,
                message: "Invalid post ID."
            });
        }

        const [posts] = await db.execute(`
            SELECT p.id, p.title, p.content, p.category,
                   p.created_at, p.updated_at,
                   u.id AS author_id, u.name AS author_name
            FROM posts p
            JOIN users u ON u.id = p.user_id
            WHERE p.id = ?
        `, [postId]);

        if (posts.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Blog post not found."
            });
        }

        res.json({
            success: true,
            post: posts[0]
        });
    } catch (error) {
        console.error("Fetch post error:", error.message);
        res.status(500).json({
            success: false,
            message: "Unable to load this post."
        });
    }
});

// CREATE BLOG POST
router.post("/", authenticateToken, async (req, res) => {
    try {
        const { title, content, category } = req.body;

        if (
            typeof title !== "string" ||
            typeof content !== "string" ||
            !title.trim() ||
            !content.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "Title and content are required."
            });
        }

        if (title.trim().length > 200) {
            return res.status(400).json({
                success: false,
                message: "Title must be 200 characters or fewer."
            });
        }

        const safeCategory =
            typeof category === "string" && category.trim()
                ? category.trim().slice(0, 100)
                : "General";

        const [result] = await db.execute(
            `INSERT INTO posts (user_id, title, content, category)
             VALUES (?, ?, ?, ?)`,
            [
                req.user.id,
                title.trim(),
                content.trim(),
                safeCategory
            ]
        );

        res.status(201).json({
            success: true,
            message: "Blog post published successfully!",
            postId: result.insertId
        });
    } catch (error) {
        console.error("Create post error:", error.message);
        res.status(500).json({
            success: false,
            message: "Unable to publish blog post."
        });
    }
});

// UPDATE OWN BLOG POST
router.put("/:id", authenticateToken, async (req, res) => {
    try {
        const postId = Number(req.params.id);
        const { title, content, category } = req.body;

        if (!Number.isInteger(postId) || postId < 1) {
            return res.status(400).json({
                success: false,
                message: "Invalid post ID."
            });
        }

        if (
            typeof title !== "string" ||
            typeof content !== "string" ||
            !title.trim() ||
            !content.trim() ||
            title.trim().length > 200
        ) {
            return res.status(400).json({
                success: false,
                message: "A valid title and content are required."
            });
        }

        const safeCategory =
            typeof category === "string" && category.trim()
                ? category.trim().slice(0, 100)
                : "General";

        const [result] = await db.execute(
            `UPDATE posts
             SET title = ?, content = ?, category = ?
             WHERE id = ? AND user_id = ?`,
            [
                title.trim(),
                content.trim(),
                safeCategory,
                postId,
                req.user.id
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Post not found or you cannot edit it."
            });
        }

        res.json({
            success: true,
            message: "Blog post updated successfully."
        });
    } catch (error) {
        console.error("Update post error:", error.message);
        res.status(500).json({
            success: false,
            message: "Unable to update blog post."
        });
    }
});

// DELETE OWN BLOG POST
router.delete("/:id", authenticateToken, async (req, res) => {
    try {
        const postId = Number(req.params.id);

        if (!Number.isInteger(postId) || postId < 1) {
            return res.status(400).json({
                success: false,
                message: "Invalid post ID."
            });
        }

        const [result] = await db.execute(
            "DELETE FROM posts WHERE id = ? AND user_id = ?",
            [postId, req.user.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Post not found or you cannot delete it."
            });
        }

        res.json({
            success: true,
            message: "Blog post deleted successfully."
        });
    } catch (error) {
        console.error("Delete post error:", error.message);
        res.status(500).json({
            success: false,
            message: "Unable to delete blog post."
        });
    }
});

module.exports = router;