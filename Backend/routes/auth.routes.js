import express from "express";
import { registerUser, loginUser } from "../services/auth.service.js";
import User from "../models/User.model.js";
import jwt from "jsonwebtoken";
const router = express.Router();

/* ===============================
   REGISTER
================================ */
router.post("/register", async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const { user, token } = await registerUser({ email, password });

        // Set cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        });

        res.status(201).json({
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        next(err);
    }
});

/* ===============================
   LOGIN
================================ */
router.post("/login", async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const { user, token } = await loginUser({ email, password });

        // Set cookie
         res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        });

        res.json({
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        next(err);
    }
});

/* ===============================
   LOGOUT
================================ */
router.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out successfully" });
});



/* ===============================
   LOGOUT
================================ */
router.get("/me", async (req, res) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id).select("-password");

        res.json({ user });
    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
});


export default router;