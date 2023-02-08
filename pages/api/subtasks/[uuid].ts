// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { validate } from 'uuid';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (!req.query.uuid || !validate(req.query.uuid.toString())) {
        return res.status(400).end('Invalid subtask UUID');
    }
    switch (req.method) {
        case 'PUT': {
            return await updateSubtask(req, res);
        }
        default:
            res.status(405).end('Method not allowed');
            break;
    }
}

const updateSubtask = async (req: NextApiRequest, res: NextApiResponse) => {
    const subtaskUUID = req.query.uuid!.toString();
    const currentSubtaskData = await prisma.subtask.findFirst({
        where: {
            uuid: subtaskUUID,
        },
    });
    const { name, completed } = req.body;
    if (typeof name === 'undefined' && typeof completed === 'undefined') {
        return res.status(400).end('No data to update');
    }

    if (!currentSubtaskData) {
        return res.status(404).end('Subtask not found');
    }

    const newSubtaskData = {
        name: typeof name === 'string' ? name : currentSubtaskData.name,
        completed: typeof completed === 'boolean' ? completed : currentSubtaskData.completed,
    };
    const response = await prisma.subtask.update({
        where: {
            uuid: subtaskUUID,
        },
        data: newSubtaskData,
    });
    return res.status(200).json(response);
};
