// pages/api/boards/tasks/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { db } from '@/lib/db';
import { boardTasks } from '@/lib/db/schema';
import { nanoid } from 'nanoid';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.id) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    if (req.method === 'POST') {
        const { content, columnId, order } = req.body;
        if (!content || !columnId || order === undefined) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        try {
            const newTask = await db.insert(boardTasks).values({
                id: `task_${nanoid()}`,
                content,
                columnId,
                order,
            }).returning();
            return res.status(201).json(newTask[0]);
        } catch (error) {
            console.error('Failed to create task:', error);
            return res.status(500).json({ error: 'Failed to create task' });
        }
    }

    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}