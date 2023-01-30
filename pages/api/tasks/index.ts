// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

type Task = {
    title: string;
    description: string;
    uuid: string;
    column: string;
    subtasks?: string[];
};

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

// const validateTask = (task: Task) => {
// TODO: validate task
// };

const getTasks = async (res: NextApiResponse) => {
    try {
        const tasks = await prisma.task.findMany();
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error });
    }
};

const createTask = async (req: NextApiRequest, res: NextApiResponse) => {
    const taskData: { title: string; description: string; subtasks?: { value: string; id: number }[]; column: string } =
        req.body;
    const task: Task = {
        title: taskData.title,
        description: taskData.description,
        column: taskData.column,
        subtasks: taskData.subtasks?.map((subtask) => subtask.value),
        uuid: uuidv4(),
    };

    try {
        // validateTask(task);
    } catch (error: any) {
        return res.status(400).json({ error: error.message });
    }
    const payload = {
        data: {
            name: task.title,
            uuid: task.uuid,
            subtasks: {},
            description: task.description,
            position: 1,
            column: {
                connect: {
                    uuid: task.column,
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
