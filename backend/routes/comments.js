const express = require("express");
const db = require("../db");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

// GET COMMENTS FOR A POST
router.get("/post/:postId", async (req, res) => {
    try {
        const postId = Number(req.params.postId);

        if (!Number.isInteger(postId) || postId < 1) {
            return res.status(400).json({
                success: false,
                message: "Invalid post ID."
            });
        }

        const [comments] = await db.execute(
            `SELECT c.id, c.post_id, c.content, c.created_at,
                    u.id AS author_id, u.name AS author_name
             FROM comments c
             JOIN users u ON u.id = c.user_id
             WHERE c.post_id = ?
             ORDER BY c.created_at ASC`,
            [postId]
        );

        res.json({
            success: true,
            count: comments.length,
            comments
        });
    } catch (error) {
        console.error("Get comments error:", error.message);
        res.status(500).json({
            success: false,
            message: "Unable to load comments."
        });
    }
});

// ADD COMMENT
router.post("/post/:postId", authenticateToken, async (req, res) => {
    try {
        const postId = Number(req.params.postId);
        const content = typeof req.body.content === "string"
            ? req.body.content.trim()
            : "";

        if (!Number.isInteger(postId) || postId < 1) {
            return res.status(400).json({
                success: false,
                message: "Invalid post ID."
            });
        }

        if (!content || content.length > 2000) {
            return res.status(400).json({
                success: false,
                message: "Comment must contain 1–2000 characters."
            });
        }

        const [posts] = await db.execute(
            "SELECT id FROM posts WHERE id = ?",
            [postId]
        );

        if (posts.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Blog post not found."
            });
        }

        const [result] = await db.execute(
            "INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)",
            [postId, req.user.id, content]
        );

        res.status(201).json({
            success: true,
            message: "Comment added successfully!",
            commentId: result.insertId
        });
    } catch (error) {
        console.error("Add comment error:", error.message);
        res.status(500).json({
            success: false,
            message: "Unable to add comment."
        });
    }
});

// DELETE OWN COMMENT
router.delete("/:id", authenticateToken, async (req, res) => {
    try {
        const commentId = Number(req.params.id);

        if (!Number.isInteger(commentId) || commentId < 1) {
            return res.status(400).json({
                success: false,
                message: "Invalid comment ID."
            });
        }

        const [result] = await db.execute(
            "DELETE FROM comments WHERE id = ? AND user_id = ?",
            [commentId, req.user.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Comment not found or you cannot delete it."
            });
        }

        res.json({
            success: true,
            message: "Comment deleted successfully."
        });
    } catch (error) {
        console.error("Delete comment error:", error.message);
        res.status(500).json({
            success: false,
            message: "Unable to delete comment."
        });
    }
});

module.exports = router;