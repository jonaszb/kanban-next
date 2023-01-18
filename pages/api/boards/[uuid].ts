// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import ApiUtils from '../../../utils/apiUtils';
const apiUtils = new ApiUtils();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (!req.query.uuid) {
        return res.status(400).end('Board uuid is required');
    }
    const queryParams = [req.query.uuid.toString()];
    switch (req.method) {
        case 'DELETE': {
            return await deleteBoard(req, res);
        }
        case 'GET': {
            const sql = `SELECT uuid, name FROM Boards WHERE uuid = ?`;
            try {
                const response: any = await apiUtils.sendQuery(sql, queryParams);
                if (response[0].length === 0) {
                    res.status(404).end('Board not found');
                } else if (response[0].length > 1) {
                    console.error('Multiple boards found with the same uuid: ' + req.query.uuid);
                    res.status(500).json({ error: 'Something went wrong' });
                } else {
                    res.status(200).json(response[0][0]);
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
    if (!req.query.uuid) {
        return res.status(400).end('Board uuid is required');
    }
    const queryParams = [req.query.uuid.toString()];
    try {
        const response: any = await apiUtils.sendQuery(sql, queryParams); // TODO - fix type
        if (response[0].affectedRows === 0) {
            res.status(404).end('Board not found');
        } else {
            res.status(200).end();
        }
    } catch (error) {
        res.status(500).json({ error });
    }
};
