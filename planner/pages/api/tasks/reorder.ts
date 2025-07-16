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

    if (req.method === 'POST') {
        const { movedTaskId, destColumnId, sourceTaskIds, destTaskIds } = req.body;

        try {
            await db.transaction(async (tx) => {
                // Update the moved task's columnId
                await tx.update(boardTasks)
                    .set({ columnId: destColumnId })
                    .where(eq(boardTasks.id, movedTaskId));

                // Update order for tasks in the source column
                for (let i = 0; i < sourceTaskIds.length; i++) {
                    await tx.update(boardTasks)
                        .set({ order: i })
                        .where(eq(boardTasks.id, sourceTaskIds[i]));
                }

                // Update order for tasks in the destination column
                for (let i = 0; i < destTaskIds.length; i++) {
                    await tx.update(boardTasks)
                        .set({ order: i })
                        .where(eq(boardTasks.id, destTaskIds[i]));
                }
            });
            return res.status(200).json({ success: true });
        } catch (error) {
            console.error('Failed to reorder tasks:', error);
            return res.status(500).json({ error: 'Failed to reorder tasks' });
        }
    }
    
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}