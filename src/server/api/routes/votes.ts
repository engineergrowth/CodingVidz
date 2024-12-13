import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

// Create or update a vote
router.post('/', async (req, res) => {
    const { postId, userId, value } = req.body;

    if (![1, -1].includes(value)) {
        return res.status(400).json({ error: 'Invalid vote value. Must be 1 or -1.' });
    }

    try {
        const vote = await prisma.vote.upsert({
            where: {
                user_id_post_id: {
                    user_id: parseInt(userId, 10),
                    post_id: parseInt(postId, 10),
                },
            },
            update: { value }, // Update the vote value if it already exists
            create: {
                user_id: parseInt(userId, 10),
                post_id: parseInt(postId, 10),
                value,
            },
        });

        res.status(200).json({ message: 'Vote recorded successfully.', vote });
    } catch (error) {
        console.error('Error recording vote:', error);
        res.status(500).json({ error: 'Failed to record vote.' });
    }
});


// Get all votes for a user
router.get('/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const votes = await prisma.vote.findMany({
            where: { user_id: parseInt(userId, 10) },
            select: { post_id: true, value: true },
        });

        res.status(200).json(votes.map((vote) => ({ postId: vote.post_id, value: vote.value })));
    } catch (err) {
        console.error('Error fetching user votes:', err);
        res.status(500).json({ error: 'Failed to fetch user votes.' });
    }
});

// Get total votes for a post
router.get('/post/:postId', async (req, res) => {
    const { postId } = req.params;

    try {
        const voteCount = await prisma.vote.aggregate({
            where: { post_id: parseInt(postId, 10) },
            _sum: { value: true },
        });

        res.status(200).json({ score: voteCount._sum.value || 0 });
    } catch (error) {
        console.error('Error fetching vote count:', error);
        res.status(500).json({ error: 'Failed to fetch vote count.' });
    }
});

// Delete a vote
router.delete('/', async (req, res) => {
    const { postId, userId } = req.body;

    try {
        await prisma.vote.delete({
            where: {
                user_id_post_id: {
                    user_id: parseInt(userId, 10),
                    post_id: parseInt(postId, 10),
                },
            },
        });

        res.status(200).json({ message: 'Vote removed successfully.' });
    } catch (error) {
        console.error('Error removing vote:', error);
        res.status(500).json({ error: 'Failed to remove vote.' });
    }
});

export default router;
