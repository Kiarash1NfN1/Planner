// pages/api/boards/tasks/[taskId].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { db } from '@/lib/db';
import { boardTasks } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.id) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const { taskId } = req.query;
    if (typeof taskId !== 'string') {
        return res.status(400).json({ error: 'Invalid task ID' });
    }

    // --- UPDATE Task Content ---
    if (req.method === 'PUT') {
        const { content } = req.body;
        if (!content) {
            return res.status(400).json({ error: 'Content is required' });
        }
        try {
            await db.update(boardTasks)
                .set({ content })
                .where(eq(boardTasks.id, taskId));
            return res.status(200).json({ success: true });
        } catch (error) {
            return res.status(500).json({ error: 'Failed to update task' });
        }
    }

    // --- DELETE Task ---
    if (req.method === 'DELETE') {
        try {
            await db.delete(boardTasks).where(eq(boardTasks.id, taskId));
            return res.status(200).json({ success: true });
        } catch (error) {
            return res.status(500).json({ error: 'Failed to delete task' });
        }
    }

    res.setHeader('Allow', ['PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}