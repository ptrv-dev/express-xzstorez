import { Request, Response } from 'express';

export async function uploadOne(req: Request, res: Response) {
  try {
    return res.json(req.file);
  } catch (error) {
    console.log(`[Error] Upload one error!\n${error}\n\n`);
    return res.sendStatus(500);
  }
}
