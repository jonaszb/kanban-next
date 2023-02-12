// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4, validate } from 'uuid';
import { NewColumn } from '../../../types';

const prisma = new PrismaClient();

const isNewColumn = (column: unknown): column is NewColumn => {
    return (
        typeof column === 'object' && column !== null && 'board_uuid' in column && 'name' in column && 'color' in column
    );
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case 'POST': {
            return await createColumn(req, res);
        }
        case 'GET': {
            return await getColumns(res);
        }
        default:
            res.status(405).end('Method not allowed');
            break;
    }
}

const getColumns = async (res: NextApiResponse) => {
    try {
        const tasks = await prisma.column.findMany();
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error });
    }
};

const createColumn = async (req: NextApiRequest, res: NextApiResponse) => {
    const columnData: unknown = req.body;
    if (!isNewColumn(columnData)) {
        return res.status(400).json({ error: 'Invalid column data' });
    }
    if (!columnData.board_uuid || !validate(columnData.board_uuid)) {
        return res.status(400).json({ error: 'Invalid board UUID' });
    }
    if (columnData.name.length < 1 || columnData.name.length > 20) {
        return res.status(400).json({ error: 'Column name must be between 1 and 20 characters' });
    }
    const boardData = await prisma.board.findUnique({
        where: {
            uuid: columnData.board_uuid,
        },
        include: {
            columns: true,
        },
    });
    if (!boardData) {
        return res.status(404).json({ error: 'Board not found' });
    }
    if (boardData.columns.find((column) => column.name.toLowerCase() === columnData.name.toLowerCase())) {
        return res.status(400).json({ error: 'Column with this name already exists on this board' });
    }
    const positionSet = columnData.position !== undefined;
    columnData.position = columnData.position ?? boardData.columns.length;
    try {
        const response = await prisma.$transaction(async (tx) => {
            if (positionSet) {
                await tx.column.updateMany({
                    where: {
                        board_uuid: columnData.board_uuid,
                        position: {
                            gte: columnData.position,
                        },
                    },
                    data: {
                        position: {
                            increment: 1,
                        },
                    },
                });
            }
            return await tx.column.create({
                data: {
                    name: columnData.name,
                    color: columnData.color,
                    position: columnData.position as number,
                    uuid: uuidv4(),
                    board: {
                        connect: {
                            uuid: columnData.board_uuid,
                        },
                    },
                },
            });
        });
        return res.status(200).json(response);
    } catch (err) {
        return res.status(500).json('Error creating column');
    }
};
