// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../utils/db';
import { validate } from 'uuid';
import { getServerSession, Session } from 'next-auth';
import { options } from '../auth/[...nextauth]';

type UpdatedColumnData = {
    name?: string;
    color?: string;
    position?: number;
};

const decrementHigherPositions = (boardUUID: string, position: number) => {
    return prisma.column.updateMany({
        where: {
            board_uuid: boardUUID,
            position: {
                gt: position,
            },
        },
        data: {
            position: { decrement: 1 },
        },
    });
};

const incrementFromPosition = (boardUUID: string, position: number) => {
    return prisma.column.updateMany({
        where: {
            board_uuid: boardUUID,
            position: {
                gte: position,
            },
        },
        data: {
            position: { increment: 1 },
        },
    });
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, options);
    if (!session) {
        res.status(401).end('Unauthorized');
        return;
    }

    if (!req.query.uuid || !validate(req.query.uuid.toString())) {
        res.status(400).end('Invalid column UUID');
        return;
    }
    switch (req.method) {
        case 'DELETE': {
            await deleteColumn(req, res, session);
            break;
        }
        case 'GET': {
            await getColumn(req, res, session);
            break;
        }
        case 'PUT': {
            await updateColumn(req, res, session);
            break;
        }
        default:
            res.status(405).end('Method not allowed');
    }
}

const deleteColumn = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
    const columnUUID = req.query.uuid?.toString();
    const columnData = await prisma.column.findFirst({
        where: {
            uuid: columnUUID,
            userId: session.user.id,
        },
    });
    if (!columnData) {
        return res.status(404).end('Column not found');
    }
    try {
        await prisma.$transaction([
            prisma.column.delete({
                where: {
                    uuid: columnUUID,
                },
            }),
            decrementHigherPositions(columnData.board_uuid, columnData.position),
        ]);
        res.status(200).end();
    } catch (error: any) {
        console.error(error);
        return res.status(500).end('Something went wrong');
    }
};

const getColumn = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
    const columnUUID = req.query.uuid?.toString();
    try {
        const column = await prisma.column.findFirst({
            where: {
                uuid: columnUUID,
                userId: session.user.id,
            },
            include: {
                tasks: true,
            },
        });
        if (!column) {
            return res.status(404).end('Column not found');
        }
        res.status(200).json(column);
    } catch (error: any) {
        console.error(error);
        return res.status(500).end('Something went wrong');
    }
};

const updateColumn = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
    const columnUUID = req.query.uuid?.toString();
    const columnData: UpdatedColumnData = req.body;
    const currentColumnData = await prisma.column.findFirst({
        where: {
            uuid: columnUUID,
            userId: session.user.id,
        },
    });
    if (!currentColumnData) {
        return res.status(404).end('Column not found');
    }
    const { name, color, position } = columnData;
    const payload = {
        name: name ?? currentColumnData.name,
        color: color ?? currentColumnData.color,
        position: position ?? currentColumnData.position,
    };

    try {
        const response = await prisma.$transaction(async (tx) => {
            if (position !== undefined && position !== currentColumnData.position) {
                await decrementHigherPositions(currentColumnData.board_uuid, currentColumnData.position);
                await incrementFromPosition(currentColumnData.board_uuid, position);
            }
            return await tx.column.update({
                where: {
                    uuid: columnUUID,
                },
                data: payload,
            });
        });
        res.status(200).json(response);
    } catch (error: any) {
        console.error(error);
        return res.status(500).end('Something went wrong');
    }
};
