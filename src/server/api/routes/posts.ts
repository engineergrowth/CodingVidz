import { PrismaClient } from '@prisma/client';
import express from 'express';

const prisma = new PrismaClient();
const router = express.Router();


router.post('/', async (req, res) => {
    try {
        const { title, video_url, description, user_id, instructor_name, tags } = req.body;

        const instructorNameUpperCase = instructor_name.toUpperCase();

        let instructor = await prisma.instructor.findUnique({
            where: { name: instructorNameUpperCase },
        });

        if (!instructor) {
            instructor = await prisma.instructor.create({
                data: { name: instructorNameUpperCase },
            });
        }

        const tagConnections = [];
        if (tags && tags.length > 0) {
            for (const tagId of tags) {
                await prisma.tag.update({
                    where: { id: tagId },
                    data: { popularity: { increment: 1 } },
                });
                tagConnections.push({ tag: { connect: { id: tagId } } });
            }
        }

        const userId = parseInt(user_id, 10);
        const instructorId = instructor.id;

        const postData = {
            title,
            video_url,
            description,
            user: { connect: { id: userId } },
            instructor: { connect: { id: instructorId } },
            tags: { create: tagConnections },
        };

        const post = await prisma.post.create({ data: postData });

        res.status(201).json(post);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create post' });
    }
});


router.get('/', async (req, res) => {
    try {
        const { tags } = req.query;

        let posts;

        if (tags && typeof tags === 'string') {
            const tagIds = tags.split(',').map(Number);

            posts = await prisma.post.findMany({
                where: {
                    tags: {
                        some: {
                            tag_id: { in: tagIds },
                        },
                    },
                },
                include: {
                    user: true,
                    instructor: true,
                    tags: {
                        include: {
                            tag: true,
                        },
                    },
                },
            });
        } else {
            posts = await prisma.post.findMany({
                include: {
                    user: true,
                    instructor: true,
                    tags: {
                        include: {
                            tag: true,
                        },
                    },
                },
            });
        }

        res.status(200).json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
});


router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { title, video_url, description, instructor_name, user_id } = req.body;

    if (!user_id) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    const instructorNameUpperCase = instructor_name ? instructor_name.toUpperCase() : null;

    let instructor = null;
    if (instructorNameUpperCase) {
        instructor = await prisma.instructor.findUnique({
            where: { name: instructorNameUpperCase },
        });

        if (!instructor) {
            instructor = await prisma.instructor.create({
                data: { name: instructorNameUpperCase },
            });
        }
    }

    try {
        const postUpdate = await prisma.post.update({
            where: { id: Number(id) },
            data: {
                title,
                video_url,
                description,
                instructor: instructor ? { connect: { id: instructor.id } } : undefined,
                user: { connect: { id: user_id } },
            },
        });

        res.status(200).json(postUpdate);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update post' });
    }
});


router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        console.log(`Received DELETE request for post ID: ${id}`);

        if (!id || isNaN(Number(id))) {
            console.error('Invalid post ID');
            return res.status(400).json({ error: 'Invalid post ID' });
        }

        const postId = Number(id);

        await prisma.post.delete({
            where: { id: postId },
        });

        console.log(`Post with ID ${postId} and related records deleted successfully`);
        res.status(204).send();
    } catch (error) {
        console.error('Error while deleting post:', error);
        res.status(500).json({ error: 'Failed to delete post' });
    }
});





export default router;
