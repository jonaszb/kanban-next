// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { validate } from 'uuid';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (!req.query.uuid || !validate(req.query.uuid.toString())) {
        return res.status(400).end('Invalid board UUID');
    }
    switch (req.method) {
        case 'DELETE': {
            return await deleteTask(req, res);
        }
        case 'GET': {
            return await getTask(req, res);
        }
        default:
            res.status(405).end('Method not allowed');
            break;
    }
}

const getTask = async (req: NextApiRequest, res: NextApiResponse) => {
    const taskUUID = req.query.uuid?.toString();
    if (!taskUUID) {
        return res.status(400).end('Task uuid is required');
    }
    try {
        const task = await prisma.task.findFirst({
            where: {
                uuid: taskUUID,
            },
            include: {
                subtasks: true,
            },
        });
        if (!task) {
            res.status(404).end('Task not found');
        } else {
            res.status(200).json(task);
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

const deleteTask = async (req: NextApiRequest, res: NextApiResponse) => {
    const taskUUID = req.query.uuid?.toString();
    if (!taskUUID) {
        return res.status(400).end('Task uuid is required');
    }
    const taskData = await prisma.task.findFirst({
        where: {
            uuid: taskUUID,
        },
    });
    if (!taskData) {
        return res.status(404).end('Task not found');
    }
    try {
        await prisma.$transaction([
            prisma.task.delete({
                where: {
                    uuid: taskUUID,
                },
            }),
            prisma.task.updateMany({
                where: {
                    column_uuid: taskData.column_uuid,
                    position: {
                        gt: taskData.position,
                    },
                },
                data: {
                    position: { decrement: 1 },
                },
            }),
        ]);
        res.status(200).end('Task deleted');
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Something went wrong' });
    }
};
