import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import { registerUser, loginUser } from "../services/auth.service.js";

const router = express.Router();

/* ======================================================
   AUTH ROUTES
   Handles user authentication:
   - Register
   - Login
   - Logout
   - Get current user
====================================================== */


/* ======================================================
   REGISTER USER
   POST /api/auth/register

   Creates a new user account and returns user data.
   Also sets an authentication cookie with JWT token.
====================================================== */
router.post("/register", async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Call service to create user
        const { user, token } = await registerUser({ email, password });

        // Store JWT token in secure HTTP-only cookie
        res.cookie("token", token, {
            httpOnly: true,   // Prevents JS access (XSS protection)
            secure: true,     // Only sent over HTTPS
            sameSite: "None"  // Allows cross-site cookies (for frontend apps)
        });

        // Send user info to client (without password)
        res.status(201).json({
            user: {
                id: user._id,
                email: user.email,
                role: user.role
            }
        });

    } catch (err) {
        next(err); // Forward error to global error handler
    }
});


/* ======================================================
   LOGIN USER
   POST /api/auth/login

   Authenticates user credentials and returns JWT token.
====================================================== */
router.post("/login", async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validate credentials via auth service
        const { user, token } = await loginUser({ email, password });

        // Store JWT token in secure cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        });

        // Send logged-in user data
        res.json({
            user: {
                id: user._id,
                email: user.email,
                role: user.role
            }
        });

    } catch (err) {
        next(err);
    }
});


/* ======================================================
   LOGOUT USER
   POST /api/auth/logout

   Clears the authentication cookie to log the user out.
====================================================== */
router.post("/logout", (req, res) => {

    // Remove JWT cookie
    res.clearCookie("token");

    res.json({
        message: "Logged out successfully"
    });
});


/* ======================================================
   GET CURRENT USER
   GET /api/auth/me

   Returns the currently authenticated user based on JWT.
====================================================== */
router.get("/me", async (req, res) => {
    try {
        // Get token from cookies
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                message: "Not authenticated"
            });
        }

        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch user without password field
        const user = await User
            .findById(decoded.id)
            .select("-password");

        res.json({ user });

    } catch (err) {
        res.status(401).json({
            message: "Invalid or expired token"
        });
    }
});

export default router;