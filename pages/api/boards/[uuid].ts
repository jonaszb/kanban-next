// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import ApiUtils from '../../../utils/apiUtils';
const apiUtils = new ApiUtils();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case 'DELETE': {
            return await deleteBoard(req, res);
        }
        case 'GET': {
            const sql = `SELECT uuid, name FROM Boards WHERE uuid = '${req.query.uuid}'`;
            try {
                const response: any[] = await apiUtils.sendQuery(sql);
                if (response[0].length === 0) {
                    res.status(404).end('Board not found');
                } else {
                    res.status(200).json(response[0]);
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
    const sql = `DELETE FROM Boards WHERE uuid = '${req.query.uuid}'`;
    try {
        const response: any = await apiUtils.sendQuery(sql); // TODO - fix type
        if (response[0].affectedRows === 0) {
            res.status(404).end('Board not found');
        } else {
            res.status(200).end();
        }
    } catch (error) {
        res.status(500).json({ error });
    }
};
