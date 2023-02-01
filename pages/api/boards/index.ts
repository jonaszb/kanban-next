// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

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
    switch (req.method) {
        case 'POST': {
            return await createBoard(req, res);
        }
        case 'GET': {
            return await getBoards(res);
        }
        default:
            return res.status(405).end('Method not allowed');
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

const getBoards = async (res: NextApiResponse) => {
    try {
        const boards = await prisma.board.findMany({
            include: {
                columns: true,
            },
        });
        res.status(200).json(boards);
    } catch (error) {
        res.status(500).json({ error });
    }
};

const createBoard = async (req: NextApiRequest, res: NextApiResponse) => {
    const boardData: { name: string; columns: { name: string; color: string }[] } = req.body;
    const board: Board = {
        name: boardData.name,
        uuid: uuidv4(),
        user: 'd5d375f9-5fa3-4d3d-ba9c-7bf942a58e09',
    };
    if (boardData.columns) {
        board.columns = boardData.columns.map((column, i) => {
            return {
                name: column.name,
                color: column.color,
                position: i,
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
                    uuid: board.user,
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
