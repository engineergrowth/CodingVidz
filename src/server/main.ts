import express from "express";
import path from "path";
import postsRouter from "./api/routes/posts.js";
import authRouter from "./api/routes/auth.js";
import tagsRouter from "./api/routes/tags.js";
import favoritesRouter from "./api/routes/favorites.js";
import cors from "cors";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.static(path.resolve(__dirname, "../dist")));

app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../dist/index.html"));
});

app.use(
    cors({
        origin: process.env.NODE_ENV === "production" ? "https://url.com" : "http://localhost:5173",
        methods: "GET,POST,PUT,DELETE,OPTIONS",
        credentials: true,
    })
);

app.use(express.json());

app.use("/posts", postsRouter);
app.use("/auth", authRouter);
app.use("/tags", tagsRouter);
app.use("/favorites", favoritesRouter);

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}...`);
});
