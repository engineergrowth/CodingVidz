import express from "express";
import path from "path";
import postsRouter from "./api/routes/posts.js";
import authRouter from "./api/routes/auth.js";
import tagsRouter from "./api/routes/tags.js";
import favoritesRouter from "./api/routes/favorites.js";
import cors from "cors";

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
    cors({
        origin: "https://codingvidz.netlify.app",
        methods: "GET,POST,PUT,DELETE,OPTIONS",
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

app.use(express.static(path.resolve(__dirname, "../dist")));

app.use(express.json());

// API routes
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
