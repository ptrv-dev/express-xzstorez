import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

import { inviteSendBody } from '../@types/requestBody';
import InviteModel from '../models/InviteModel';

const DOMAIN = 'https://xzstorez44.com';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export async function sendInvite(
  req: Request<{}, {}, inviteSendBody>,
  res: Response
) {
  try {
    const validation = validationResult(req);
    if (!validation.isEmpty()) return res.status(400).json(validation);

    const { name, email, invites } = req.body;

    for (const invite of invites) {
      transporter.sendMail({
        to: invite,
        subject: 'XZstore - Online store brand clothing',
        html: `
<!DOCTYPE html>
<head>
  <title>XZstorez</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500&display=swap"
    rel="stylesheet"
  />
  <style>
    * {
      box-sizing: border-box;
      padding: 0;
      margin: 0;
      font-family: 'Poppins';
    }
    body {
      padding: 18px 0;
      font-size: 18px;
      color: rgba(0, 0, 0, 0.8) !important;
    }
    hr {
      margin: 0.5rem 0;
    }
    .container {
      padding: 0 25px;
    }
    .logo {
      font-size: 26px;
      font-weight: 500;
      color: #000000;
      text-align: center;
    }
    strong {
      font-weight: 500;
      color: #000000;
    }
    .card {
      background-color: #f5f5f5;
      padding: 1rem;
      margin-top: 1rem;
      display: inline-block;
    }
    .button {
      font-size: 1rem;
      background-color: #000000;
      color: #ffffff !important;
      font-weight: 500;
      border-radius: 10px;
      text-decoration: none;
      padding: 10px 30px;
      display: inline-block;
      margin-top: 1rem;
    }
  </style>
</head>
<body>
  <div class="container"><h1 class="logo">XZstorez</h1></div>
  <hr />
  <div class="container">
    <p>
      Hey! Your friend <strong>${name}</strong> invited you to our online clothing
      store.
    </p>
    <p>
      When you make a purchase in our store, you can enter the Invitee's Email
      and you will be given a discount on your next purchases.
    </p>
    <p>
      Also, you can invite other people to buy clothes in our online store and
      get for that nice bonuses and discounts.
    </p>
    <div class="card">
      <p>Name of the invitee: <strong>${name}</strong></p>
      <p>Email of the inviter: <strong>${email}</strong></p>
      <a class="button" href="${DOMAIN}">Go to shop</a>
    </div>
  </div>
</body>`,
      });
    }

    const invite = await InviteModel.findOne({ email: email });
    if (!invite) {
      await InviteModel.create({
        name,
        email,
        invites,
      });
    } else {
      await invite.updateOne({ invites: [...invite.invites, ...invites] });
    }

    return res.status(200).json({ msg: 'Success' });
  } catch (error) {
    console.log(`[Error] Send invite error!\n${error}\n\n`);
    return res.sendStatus(500);
  }
}
