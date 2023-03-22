import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

import { inviteSendBody } from '../@types/requestBody';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

console.log(process.env.PORT);

export async function sendInvite(
  req: Request<{}, {}, inviteSendBody>,
  res: Response
) {
  try {
    const validation = validationResult(req);
    if (!validation.isEmpty()) return res.status(400).json(validation);

    const { name, email, invites } = req.body;
    const text = `
      Your friend ${name} (${email}) has invited you to make a purchase at our online brand clothing store.
      Use the Invitee's Email (${email}) to get bonuses and discounts on your next purchase.
      `;

    for (const invite of invites) {
      transporter.sendMail({
        to: invite,
        subject: 'XZstore - Online store brand clothing',
        text,
      });
    }

    return res.status(200).json({ msg: 'Success' });
  } catch (error) {
    console.log(`[Error] Send invite error!\n${error}\n\n`);
    return res.sendStatus(500);
  }
}
