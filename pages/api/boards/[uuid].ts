// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../utils/db';
import { validate } from 'uuid';
import { Column } from '../../../types';
import { v4 as uuidv4 } from 'uuid';
import { Session, getServerSession } from 'next-auth';
import { randomHexColor } from '../../../utils/utils';
import { options } from '../auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, options);
    if (!session) {
        res.status(401).end('Unauthorized');
        return;
    }
    if (!req.query.uuid || !validate(req.query.uuid.toString())) {
        res.status(400).end('Invalid board UUID');
        return;
    }
    switch (req.method) {
        case 'DELETE': {
            await deleteBoard(req, res, session);
            break;
        }
        case 'GET': {
            await getBoard(req, res, session);
            break;
        }
        case 'PUT': {
            await updateBoard(req, res, session);
            break;
        }
        default:
            res.status(405).end('Method not allowed');
    }
}

const deleteBoard = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
    const boardUUID = req.query.uuid?.toString();
    if (!boardUUID) {
        return res.status(400).end('Board uuid is required');
    }
    const result = await prisma.board.deleteMany({
        where: {
            uuid: boardUUID,
            userId: session.user.id,
        },
    });
    if (result.count === 0) return res.status(404).end('Board not found');
    return res.status(200).end();
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
                                subtasks: {
                                    orderBy: {
                                        id: 'asc',
                                    },
                                },
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

    if (columns) {
        const set = new Set();
        if (columns.some((col) => set.size === (set.add(col.name), set.size))) {
            return res.status(400).json({ error: 'Column names must be unique' });
        }
    }

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
                    color: column.color || randomHexColor(),
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
