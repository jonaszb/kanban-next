// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import ApiUtils from '../../../utils/apiUtils';
const apiUtils = new ApiUtils();
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (!req.query.uuid) {
        return res.status(400).end('Board uuid is required');
    }
    switch (req.method) {
        case 'DELETE': {
            return await deleteBoard(req, res);
        }
        case 'GET': {
            try {
                const board = await prisma.board.findFirst({
                    where: {
                        uuid: req.query.uuid.toString(),
                    },
                    include: {
                        columns: {
                            include: {
                                tasks: true,
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
            break;
        }
        default:
            res.status(405).end('Method not allowed');
            break;
    }
}

const deleteBoard = async (req: NextApiRequest, res: NextApiResponse) => {
    const boardUUID = req.query.uuid?.toString();
    if (!boardUUID) {
        return res.status(400).end('Board uuid is required');
    }
    try {
        await prisma.board.delete({
            where: {
                uuid: boardUUID,
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
