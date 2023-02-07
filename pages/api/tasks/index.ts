// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4, validate } from 'uuid';
import { NewTask } from '../../../types';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case 'POST': {
            return await createTask(req, res);
        }
        case 'GET': {
            return await getTasks(res);
        }
        default:
            res.status(405).end('Method not allowed');
            break;
    }
}

const isNewTask = (data: unknown): data is NewTask => {
    return (
        typeof data === 'object' &&
        data !== null &&
        'column_uuid' in data &&
        typeof data.column_uuid === 'string' &&
        'name' in data &&
        typeof data.name === 'string' &&
        (!('description' in data) || typeof data.description === 'string') &&
        (!('subtasks' in data) || data.subtasks instanceof Array)
    );
};

const getTasks = async (res: NextApiResponse) => {
    try {
        const tasks = await prisma.task.findMany();
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error });
    }
};

const createTask = async (req: NextApiRequest, res: NextApiResponse) => {
    const taskData: unknown = req.body;
    if (!isNewTask(taskData)) {
        return res.status(400).json({ error: 'Invalid task data' });
    }
    if (taskData.name.length < 1 || taskData.name.length > 120) {
        return res.status(400).json({ error: 'Task name must be between 1 and 120 characters' });
    }
    if (!validate(taskData.column_uuid)) {
        return res.status(400).json({ error: 'Invalid column UUID' });
    }
    for (const subtask of taskData.subtasks ?? []) {
        if (typeof subtask !== 'string') {
            return res.status(400).json({ error: 'Invalid subtask data' });
        }
    }
    const task: NewTask & { uuid: string } = {
        name: taskData.name,
        description: taskData.description,
        column_uuid: taskData.column_uuid,
        subtasks: taskData.subtasks ?? [],
        uuid: uuidv4(),
    };
    const columnData = await prisma.column.findUnique({
        where: {
            uuid: task.column_uuid,
        },
    });
    if (!columnData) {
        return res.status(404).json({ error: 'Column not found' });
    }

    const existingColumnTasks = await prisma.task.findMany({
        where: {
            column_uuid: task.column_uuid,
        },
        orderBy: {
            position: 'desc',
        },
    });

    const nextPosition = existingColumnTasks.length ? existingColumnTasks[0].position + 1 : 0;

    const payload = {
        data: {
            name: task.name,
            uuid: task.uuid,
            subtasks: {},
            description: task.description,
            position: nextPosition,
            column: {
                connect: {
                    uuid: task.column_uuid,
                },
            },
        },
    };
    if (task.subtasks) {
        payload.data.subtasks = {
            createMany: {
                data: task.subtasks.map((subtask) => {
                    return {
                        name: subtask,
                        uuid: uuidv4(),
                        completed: false,
                    };
                }),
            },
        };
    }
    try {
        const newTask = await prisma.task.create(payload);
        res.status(201).json(newTask);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
};
