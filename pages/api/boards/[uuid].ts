// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { validate } from 'uuid';
import { Column } from '../../../types';
import { v4 as uuidv4 } from 'uuid';
import { getSession } from 'next-auth/react';
import { Session } from 'next-auth';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getSession({ req });
    if (!session) {
        return res.status(401).end('Unauthorized');
    }
    if (!req.query.uuid || !validate(req.query.uuid.toString())) {
        return res.status(400).end('Invalid board UUID');
    }
    switch (req.method) {
        case 'DELETE': {
            return await deleteBoard(req, res, session);
        }
        case 'GET': {
            return await getBoard(req, res, session);
        }
        case 'PUT': {
            return await updateBoard(req, res, session);
        }
        default:
            return res.status(405).end('Method not allowed');
    }
}

const deleteBoard = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
    const boardUUID = req.query.uuid?.toString();
    if (!boardUUID) {
        return res.status(400).end('Board uuid is required');
    }
    try {
        await prisma.board.deleteMany({
            where: {
                uuid: boardUUID,
                userId: session.user.id,
            },
        });
        res.status(200).end();
    } catch (error: any) {
        if (error.code === 'P2025') {
            return res.status(404).end('Board not found');
        } else {
            console.error(error);
            return res.status(500).end('Something went wrong');
        }
    }
};

const getBoard = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
    try {
        const board = await prisma.board.findFirst({
            where: {
                uuid: req.query.uuid?.toString(),
                userId: session.user.id,
            },
            include: {
                columns: {
                    include: {
                        tasks: {
                            include: {
                                subtasks: true,
                            },
                            orderBy: {
                                position: 'asc',
                            },
                        },
                    },
                    orderBy: {
                        position: 'asc',
                    },
                },
            },
        });
        if (!board) {
            res.status(404).end('Board not found');
        } else {
            res.status(200).json(board);
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

const updateBoard = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
    const boardUUID = req.query.uuid?.toString();
    const currentBoardData = await prisma.board.findFirst({
        where: {
            uuid: boardUUID,
            userId: session.user.id,
        },
        include: {
            columns: true,
        },
    });
    if (!currentBoardData) {
        return res.status(404).end('Board not found');
    }
    const columns: Column[] = req.body.columns;
    const columnsToDelete: string[] = [];

    // Find out which columns were removed and delete them
    for (const column of currentBoardData.columns) {
        const found = columns.find((c) => c.uuid === column.uuid);
        if (!found) {
            columnsToDelete.push(column.uuid);
        }
    }
    // Create a new array of columns
    for (const column of columns) {
        if (!column.uuid) {
            column.uuid = uuidv4();
        }
    }

    await prisma.$transaction(async () => {
        if (req.body.name !== currentBoardData.name) {
            await prisma.board.updateMany({
                where: { uuid: boardUUID, userId: session.user.id },
                data: { name: req.body.name },
            });
        }
        if (columnsToDelete.length) {
            await prisma.column.deleteMany({
                where: {
                    uuid: {
                        in: columnsToDelete,
                    },
                },
            });
        }
        for (const column of columns) {
            await prisma.column.upsert({
                where: {
                    uuid: column.uuid,
                },
                create: {
                    uuid: column.uuid,
                    name: column.name,
                    position: column.position,
                    userId: session.user.id,
                    color: column.color || `#${Math.floor(Math.random() * 16777215).toString(16)}`,
                    board: {
                        connect: {
                            uuid: boardUUID,
                        },
                    },
                },
                update: {
                    name: column.name,
                    position: column.position,
                },
            });
        }
        return res.status(200).json('Board updated');
    });
};
