// // pages/api/boards/index.ts
// import type { NextApiRequest, NextApiResponse } from 'next';
// import { getServerSession } from 'next-auth/next';
// import { authOptions } from './auth/[...nextauth]';
// import { db } from '@/lib/db';
// import { boards } from '@/lib/db/schema';
// import { eq } from 'drizzle-orm';
// import { nanoid } from 'nanoid';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//     const session = await getServerSession(req, res, authOptions);
//     if (!session?.user?.id) {
//         return res.status(401).json({ error: 'Unauthorized' });
//     }
//     const userId = session.user.id;

//     if (req.method === 'GET') {
//         try {
//             const userBoards = await db.query.boards.findMany({
//                 where: eq(boards.userId, userId),
//                 with: {
//                     columns: {
//                         orderBy: (columns, { asc }) => [asc(columns.order)],
//                         with: {
//                             tasks: {
//                                 orderBy: (tasks, { asc }) => [asc(tasks.order)],
//                             },
//                         },
//                     },
//                 },
//             });
//             return res.status(200).json(userBoards);
//         } catch (error) {
//             console.error('Failed to fetch boards:', error);
//             return res.status(500).json({ error: 'Failed to fetch boards' });
//         }
//     }

//     if (req.method === 'POST') {
//         const { name } = req.body;
//         if (!name) {
//             return res.status(400).json({ error: 'Board name is required' });
//         }
//         try {
//             const newBoard = await db.insert(boards).values({
//                 id: `board_${nanoid()}`,
//                 userId: userId,
//                 name: name,
//             }).returning();
//             return res.status(201).json(newBoard[0]);
//         } catch (error) {
//             console.error('Failed to create board:', error);
//             return res.status(500).json({ error: 'Failed to create board' });
//         }
//     }

//     res.setHeader('Allow', ['GET', 'POST']);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
// }