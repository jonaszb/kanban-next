// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../utils/db';
import { v4 as uuidv4 } from 'uuid';
import { Session, getServerSession } from 'next-auth';
import { options } from '../auth/[...nextauth]';

type Board = {
    name: string;
    columns?: Column[];
    uuid: string;
    user: string;
};

type Column = {
    name: string;
    color: string;
    position: number;
    uuid: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, options);
    if (!session) {
        res.status(401).end('Unauthorized');
        return;
    }

    switch (req.method) {
        case 'POST': {
            await createBoard(req, res, session);
            break;
        }
        case 'GET': {
            await getBoards(res, session);
            break;
        }
        default:
            res.status(405).end('Method not allowed');
    }
}

const validateBoard = (board: Board) => {
    if (!board.name) {
        throw new Error('Board name is required');
    } else if (board.name.trim().length < 1) {
        throw new Error('Board name cannot be empty');
    } else if (board.name.trim().length > 30) {
        throw new Error('Board name cannot be longer than 30 characters');
    }
};

const getBoards = async (res: NextApiResponse, session: Session) => {
    try {
        const boards = await prisma.board.findMany({
            where: {
                userId: session.user.id,
            },
            include: {
                columns: true,
            },
        });
        res.status(200).json(boards);
    } catch (error) {
        res.status(500).json({ error });
    }
};

const createBoard = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
    const boardData: { name: string; columns: { name: string; color: string }[] } = req.body;
    const board: Board = {
        name: boardData.name,
        uuid: uuidv4(),
        user: session.user.id,
    };
    if (boardData.columns) {
        const set = new Set();
        if (boardData.columns.some((col) => set.size === (set.add(col.name), set.size))) {
            return res.status(400).json({ error: 'Column names must be unique' });
        }
        board.columns = boardData.columns.map((column, i) => {
            return {
                name: column.name,
                color: column.color,
                position: i,
                userId: session.user.id,
                uuid: uuidv4(),
            };
        });
    }

    try {
        validateBoard(board);
    } catch (error: any) {
        return res.status(400).json({ error: error.message });
    }
    const payload = {
        data: {
            name: board.name,
            uuid: board.uuid,
            user: {
                connect: {
                    id: board.user,
                },
            },
            columns: {},
        },
    };
    if (board.columns) {
        payload.data.columns = {
            createMany: {
                data: board.columns,
            },
        };
    }
    try {
        const newBoard = await prisma.board.create(payload);
        res.status(201).json(newBoard);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
};
