import { PrismaClient } from '@prisma/client';
import express from 'express';

const prisma = new PrismaClient();
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const tags = await prisma.tag.findMany({
            orderBy: { name: 'asc' },
        });
        res.json(tags);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch tags' });
    }
});

router.get('/test', (req, res) => {
    res.json({ message: "Tags router is working!" });
});

export default router;
