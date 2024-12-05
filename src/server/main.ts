import express from "express";
import ViteExpress from "vite-express";
import postsRouter from "./api/routes/posts.js";
import authRouter from "./api/routes/auth.js";
import tagsRouter from "./api/routes/tags.js";
import favoritesRouter from "./api/routes/favorites.js";

import cors from "cors";



const app = express();

app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`); // Log the request method and URL
    next();
});

app.use(
    cors({
        origin: "http://localhost:5173",
        methods: "GET,POST,PUT,DELETE,OPTIONS",
        credentials: true,
    })
);
app.use(express.json());

app.use("/posts", postsRouter);
app.use("/auth", authRouter);
app.use("/tags", tagsRouter);
app.use('/favorites', favoritesRouter);


app.get('/test', (req, res) => {
    res.json({ message: "Test route works!" });
});

ViteExpress.listen(app, 3000, () =>
    console.log("Server is listening on port 3000..."),
);
