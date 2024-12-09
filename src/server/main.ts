import express from "express";
import path from "path";
import rateLimit from "express-rate-limit";
import postsRouter from "./api/routes/posts.js";
import authRouter from "./api/routes/auth.js";
import tagsRouter from "./api/routes/tags.js";
import favoritesRouter from "./api/routes/favorites.js";
import cors from "cors";

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per window
    message: { error: "Too many requests, please try again later." },
    standardHeaders: true, // Sends rate limit info in RateLimit-* headers
    legacyHeaders: false, // Disables the X-RateLimit-* headers
});

app.use(
    cors({
        origin: ["https://codingvidz.netlify.app", "http://localhost:5173"],
        methods: "GET,POST,PUT,DELETE,OPTIONS",
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

app.use(express.static(path.resolve(__dirname, "../dist")));
app.use(express.json());

// Apply rate limiter to all routes
app.use(limiter);

app.use((req, res, next) => {
    console.log(`Incoming Request: ${req.method} ${req.url}`);
    next();
});



app.use("/posts", postsRouter);
app.use("/auth", authRouter);
app.use("/tags", tagsRouter);
app.use("/favorites", favoritesRouter);

app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../../../client/index.html"));
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}...`);
});
