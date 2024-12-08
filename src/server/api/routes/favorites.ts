import { PrismaClient } from '@prisma/client';
import express from 'express';

const prisma = new PrismaClient();
const router = express.Router();

router.get('/:user_id', async (req, res) => {
    try {
        const { user_id } = req.params;
        const userId = parseInt(user_id, 10);

        const bookmarks = await prisma.bookmark.findMany({
            where: { user_id: userId },
            include: {
                post: {
                    include: {
                        instructor: true,
                        tags: {
                            include: { tag: true },
                        },
                    },
                },
            },
        });

        res.status(200).json(bookmarks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch bookmarks' });
    }
});

router.post('/:user_id', async (req, res) => {
    try {
        const userId = parseInt(req.params.user_id, 10);
        const { post_id } = req.body;
        const postId = parseInt(post_id, 10);

        const existingBookmark = await prisma.bookmark.findUnique({
            where: {
                user_id_post_id: {
                    user_id: userId,
                    post_id: postId,
                },
            },
        });

        if (existingBookmark) {
            return res.status(400).json({ message: 'Bookmark already exists' });
        }

        const bookmark = await prisma.bookmark.create({
            data: {
                user: { connect: { id: userId } },
                post: { connect: { id: postId } },
            },
        });

        return res.status(201).json(bookmark);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create bookmark' });
    }
});

router.delete('/:user_id/:post_id', async (req, res) => {
    try {
        const { user_id, post_id } = req.params;
        const userId = parseInt(user_id, 10);
        const postId = parseInt(post_id, 10);

        const existingBookmark = await prisma.bookmark.findUnique({
            where: {
                user_id_post_id: {
                    user_id: userId,
                    post_id: postId,
                },
            },
        });

        if (!existingBookmark) {
            return res.status(404).json({ error: 'Bookmark not found' });
        }

        await prisma.bookmark.delete({
            where: {
                user_id_post_id: {
                    user_id: userId,
                    post_id: postId,
                },
            },
        });

        return res.status(200).json({ message: 'Bookmark deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete bookmark' });
    }
});

export default router;
