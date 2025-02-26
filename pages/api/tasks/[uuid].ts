// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../utils/db';
import { validate, v4 as uuidv4 } from 'uuid';
import { Subtask } from '../../../types';
import { getServerSession, Session } from 'next-auth';
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
            await deleteTask(req, res, session);
            break;
        }
        case 'GET': {
            await getTask(req, res, session);
            break;
        }
        case 'PUT': {
            await updateTask(req, res, session);
            break;
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

const updateTaskData = (taskUUID: string, taskData: OptionalTaskData, subtasksToDelete: string[], session: Session) => {
    const { subtasks, ...data } = taskData;
    return prisma.$transaction(async () => {
        if (subtasksToDelete.length > 0) {
            await prisma.subtask.deleteMany({
                where: {
                    uuid: {
                        in: subtasksToDelete,
                    },
                },
            });
        }
        if (subtasks) {
            for (const subtask of subtasks) {
                await prisma.subtask.upsert({
                    where: {
                        uuid: subtask.uuid,
                    },
                    update: {
                        name: subtask.name,
                    },
                    create: {
                        uuid: subtask.uuid,
                        name: subtask.name,
                        userId: session.user.id,
                        task: {
                            connect: {
                                uuid: taskUUID,
                            },
                        },
                    },
                });
            }
        }
        await prisma.task.update({
            where: {
                uuid: taskUUID,
            },
            data,
        });
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

const validateColumns = async (columnUUIDs: string[]) => {
    let columnsAreValid = true;
    for (const columnUUID of columnUUIDs) {
        const tasks = await prisma.task.findMany({
            where: {
                column_uuid: columnUUID,
            },
            orderBy: {
                position: 'asc',
            },
        });
        let position = 0;
        for (const task of tasks) {
            if (task.position !== position) {
                columnsAreValid = false;
                break;
            }
            position++;
        }
    }
    return columnsAreValid;
};

const getTask = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
    const taskUUID = req.query.uuid?.toString();
    if (!taskUUID) {
        return res.status(400).end('Task uuid is required');
    }
    try {
        const task = await prisma.task.findFirst({
            where: {
                uuid: taskUUID,
                userId: session.user.id,
            },
            include: {
                subtasks: {
                    orderBy: {
                        id: 'asc',
                    },
                },
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

const deleteTask = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
    const taskUUID = req.query.uuid?.toString();
    if (!taskUUID) {
        return res.status(400).end('Task uuid is required');
    }
    const taskData = await prisma.task.findFirst({
        where: {
            uuid: taskUUID,
            userId: session.user.id,
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

const updateTask = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
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
            userId: session.user.id,
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

    // Check which subtasks are being deleted
    const subtasksToDelete: string[] = [];
    if (Array.isArray(subtasks)) {
        for (const subtask of currentTaskData.subtasks) {
            const found = subtasks.find((s: Subtask) => s.uuid === subtask.uuid);
            if (!found) {
                subtasksToDelete.push(subtask.uuid);
            }
        }
    }
    // Create a new array of columns
    for (const subtask of subtasks ?? []) {
        if (!subtask.uuid) {
            subtask.uuid = uuidv4();
        }
    }

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
    const newTaskData: OptionalTaskData = {
        name: name || currentTaskData.name,
        description: typeof description === undefined ? currentTaskData.description : description,
        column_uuid: column_uuid || currentTaskData.column_uuid,
        subtasks: subtasks || currentTaskData.subtasks,
        position: position !== undefined ? position : currentTaskData.position,
    };

    await prisma.$transaction(async () => {
        if (!columnChanged && !positionChanged) {
            await updateTaskData(taskUUID, newTaskData, subtasksToDelete, session);
            return res.status(200).end('Task updated');
        }
        if (columnChanged && !column) {
            return res.status(404).end('Column not found');
        }
        if (columnChanged && !positionChanged) newTaskData.position = column!.tasks.length; // If position is not set, move to end of column
        await decrementHigherPositions(currentTaskData.column_uuid, currentTaskData.position);
        if (positionChanged && !movingToEndOfColumn) {
            await incrementFromPosition(columnChanged ? column_uuid : currentTaskData.column_uuid, position);
        }
        await updateTaskData(taskUUID, newTaskData, subtasksToDelete, session);
        const dataAfterUpdateIsValid = await validateColumns(
            columnChanged ? [column_uuid, currentTaskData.column_uuid] : [currentTaskData.column_uuid]
        );
        if (!dataAfterUpdateIsValid) {
            throw new Error('Invalid position of tasks after update');
        }
        return res.status(200).end('Task updated');
    });
};

type OptionalTaskData = {
    name?: string;
    description?: string;
    column_uuid?: string;
    subtasks?: Subtask[];
    position?: number;
};
