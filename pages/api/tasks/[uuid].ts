// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { Prisma, PrismaClient } from '@prisma/client';
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
        case 'PUT': {
            return await updateTask(req, res);
        }
        default:
            res.status(405).end('Method not allowed');
            break;
    }
}

const decrementHigherPositions = (columnUUID: string, position: number) => {
    return prisma.task.updateMany({
        where: {
            column_uuid: columnUUID,
            position: {
                gt: position,
            },
        },
        data: {
            position: { decrement: 1 },
        },
    });
};

const incrementFromPosition = (columnUUID: string, position: number) => {
    return prisma.task.updateMany({
        where: {
            column_uuid: columnUUID,
            position: {
                gte: position,
            },
        },
        data: {
            position: { increment: 1 },
        },
    });
};

const updateTaskData = (taskUUID: string, taskData: any) => {
    return prisma.task.update({
        where: {
            uuid: taskUUID,
        },
        data: taskData,
    });
};

const validateTaskUpdateData = (taskData: any) => {
    if (Object.keys(taskData).length === 0) {
        return 'No data to update';
    }
    if (taskData.column && !validate(taskData.column)) {
        return 'Invalid column UUID';
    }
    if (taskData.position && typeof taskData.position !== 'number') {
        return 'Invalid position';
    }
    if (taskData.name && typeof taskData.name !== 'string') {
        return 'Invalid name';
    }
    if (taskData.description && typeof taskData.description !== 'string') {
        return 'Invalid description';
    }
    return;
};

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
            decrementHigherPositions(taskData.column_uuid, taskData.position),
        ]);
        res.status(200).end('Task deleted');
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

const updateTask = async (req: NextApiRequest, res: NextApiResponse) => {
    const taskUUID = req.query.uuid?.toString();
    if (!taskUUID) {
        return res.status(400).end('Task uuid is required');
    }
    const err = validateTaskUpdateData(req.body);
    if (err) {
        return res.status(400).end(err);
    }
    const currentTaskData = await prisma.task.findFirst({
        where: {
            uuid: taskUUID,
        },
        include: {
            subtasks: true,
        },
    });
    if (!currentTaskData) {
        return res.status(404).end('Task not found');
    }
    let { name, description, column_uuid, subtasks, position } = req.body;
    const columnChanged = !!(column_uuid && column_uuid !== currentTaskData.column_uuid);
    const positionChanged = !!(position !== undefined && (position !== currentTaskData.position || columnChanged));
    const column =
        columnChanged || positionChanged
            ? await prisma.column.findFirst({
                  where: { uuid: column_uuid || currentTaskData.column_uuid },
                  include: { tasks: true },
              })
            : null;
    let movingToEndOfColumn = false; // No need to shift the position of other tasks if true;

    if (position) {
        if (!(typeof position === 'number' && Number.isInteger(position) && !isNaN(position))) {
            return res.status(400).end('Position must be an integer');
        }
        // Check if position is valid and within accepted range
        if (!column) {
            return res.status(404).end('Column not found');
        }
        if (position < 0) {
            return res.status(400).end('Position cannot be less than 0');
        }
        if (position > column.tasks.length || (!columnChanged && position > column.tasks.length - 1)) {
            position = columnChanged ? column.tasks.length : column.tasks.length - 1;
            movingToEndOfColumn = true;
        }
    }
    const newTaskData = {
        name: name || currentTaskData.name,
        description: description || currentTaskData.description,
        column_uuid: column_uuid || currentTaskData.column_uuid,
        position: position !== undefined ? position : currentTaskData.position,
    };

    if (columnChanged) {
        if (!column) {
            return res.status(404).end('Column not found');
        }
        if (positionChanged) {
            console.log(1);
            // Handle column and position change
            await prisma.$transaction([
                decrementHigherPositions(currentTaskData.column_uuid, currentTaskData.position),
                ...(movingToEndOfColumn ? [] : [incrementFromPosition(column_uuid, position)]),
                updateTaskData(taskUUID, newTaskData),
            ]);
            res.status(200).end('Task updated');
        } else {
            console.log(2);
            newTaskData.position = column.tasks.length;
            await prisma.$transaction([
                decrementHigherPositions(currentTaskData.column_uuid, currentTaskData.position),
                updateTaskData(taskUUID, newTaskData),
            ]);
            res.status(200).end('Task updated');
        }
    } else {
        if (positionChanged) {
            console.log(3);
            // Handle position change within the same column
            await prisma.$transaction([
                decrementHigherPositions(currentTaskData.column_uuid, currentTaskData.position),
                ...(movingToEndOfColumn ? [] : [incrementFromPosition(currentTaskData.column_uuid, position)]),
                updateTaskData(taskUUID, newTaskData),
            ]);
            res.status(200).end('Task updated');
        } else {
            console.log(4);
            // Handle no column or position change
            await updateTaskData(taskUUID, newTaskData);
            res.status(200).end('Task updated');
        }
    }
};
