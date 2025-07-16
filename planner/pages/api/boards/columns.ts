import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { db } from '@/lib/db';
import { boardColumns } from '@/lib/db/schema';
import { nanoid } from 'nanoid';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.id) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    if (req.method === 'POST') {
        const { name, boardId, order } = req.body;
        if (!name || !boardId || order === undefined) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        try {
            const newColumn = await db.insert(boardColumns).values({
                id: `col_${nanoid()}`,
                name,
                boardId,
                order,
            }).returning();
            return res.status(201).json(newColumn[0]);
        } catch (error) {
            console.error('Failed to create column:', error);
            return res.status(500).json({ error: 'Failed to create column' });
        }
    }

    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}