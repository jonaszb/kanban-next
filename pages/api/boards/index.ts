// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

type Board = {
    id: number;
    name: string;
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
            res.status(405).end('Method not allowed');
            break;
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
        const boards = await prisma.board.findMany();
        res.status(200).json(boards);
    } catch (error) {
        res.status(500).json({ error });
    }
};

const createBoard = async (req: NextApiRequest, res: NextApiResponse) => {
    const board = req.body;
    board.name = board.name.trim();
    try {
        validateBoard(board);
    } catch (error: any) {
        return res.status(400).json({ error: error.message });
    }
    board.uuid = uuidv4();
    try {
        const newBoard = await prisma.board.create({
            data: {
                uuid: board.uuid,
                name: board.name,
                user: {
                    connect: {
                        id: 1,
                    },
                },
            },
        });
        res.status(201).json(newBoard);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
};
