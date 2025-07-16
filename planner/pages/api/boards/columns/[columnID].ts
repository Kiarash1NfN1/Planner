// pages/api/boards/columns/[columnId].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';
import { db } from '@/lib/db';
import { boardColumns } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.id) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const { columnId } = req.query;
    if (typeof columnId !== 'string') {
        return res.status(400).json({ error: 'Invalid column ID' });
    }

    // --- UPDATE Column Name ---
    if (req.method === 'PUT') {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ error: 'Name is required' });
        }
        try {
            await db.update(boardColumns)
                .set({ name })
                .where(eq(boardColumns.id, columnId));
            return res.status(200).json({ success: true });
        } catch (error) {
            return res.status(500).json({ error: 'Failed to update column' });
        }
    }

    // --- DELETE Column ---
    if (req.method === 'DELETE') {
        try {
            await db.delete(boardColumns).where(eq(boardColumns.id, columnId));
            return res.status(200).json({ success: true });
        } catch (error) {
            return res.status(500).json({ error: 'Failed to delete column' });
        }
    }

    res.setHeader('Allow', ['PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}