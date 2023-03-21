import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import SettingsModel from '../models/SettingsMode';

async function getSettingsObject() {
  let settings = await SettingsModel.findOne();
  if (!settings) {
    settings = await SettingsModel.create({});
  }
  return settings;
}

interface setSettingsBody {
  cryptoDiscount?: number;
}

export async function setSettings(
  req: Request<{}, {}, setSettingsBody>,
  res: Response
) {
  try {
    const validation = validationResult(req);
    if (!validation.isEmpty()) return res.status(400).json(validation);

    const settings = await getSettingsObject();

    await settings.updateOne({ cryptoDiscount: req.body.cryptoDiscount });

    return res.sendStatus(200);
  } catch (error) {
    console.log(`[Error] Settings | Crypto discount set error!\n${error}\n\n`);
    return res.sendStatus(500);
  }
}

export async function getSettings(req: Request, res: Response) {
  try {
    const settings = await getSettingsObject();

    return res.status(200).json(settings);
  } catch (error) {
    console.log(`[Error] Settings | Get all error!\n${error}\n\n`);
    return res.sendStatus(500);
  }
}
