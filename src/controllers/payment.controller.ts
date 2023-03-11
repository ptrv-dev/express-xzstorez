import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Stripe from 'stripe';
import { orderCreateBody, paymentCreateBody } from '../@types/requestBody';
import OrderModel from '../models/OrderModel';

const stripe = new Stripe(
  'sk_test_51MQqzAGLf8CEUHkqkYcPL0KHoCaaWmbpCbIrZMjJK58a3oaNac3Qy6ZKkod8DIqWiQLOj6PUFu3X49rKADpmKybk00rWJiZg6g',
  { apiVersion: '2022-11-15' }
);

const domain = 'http://localhost:3000';

export async function create(
  req: Request<{}, {}, paymentCreateBody>,
  res: Response
) {
  try {
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    for (const item of req.body) {
      const product = await stripe.products.create({
        type: 'good',
        shippable: true,
        name: item.name,
        description: item.description,
      });
      line_items.push({
        price_data: {
          product: product.id,
          currency: 'USD',
          unit_amount_decimal: Number(item.price).toFixed(2).replace('.', ''),
        },
        quantity: item.quantity,
      });
    }

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: 'payment',
      success_url: `${domain}/order-complete?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${domain}/cart`,
      billing_address_collection: 'required',
      phone_number_collection: {
        enabled: true,
      },
    });

    if (!session.url) return res.sendStatus(500);

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.log(`[Error] Payment create error!\n${error}\n\n`);
    return res.sendStatus(500);
  }
}

export async function get(
  req: Request<{}, {}, {}, { session_id: string }>,
  res: Response
) {
  try {
    // cs_test_a1NWWHsLiDhWEdlZqyxtfnR4ZN1JbDkTASMbcjZxKdX5aQDpYv53CbKke5
    const session = await stripe.checkout.sessions.retrieve(
      req.query.session_id
    );

    return res.status(200).json(session);
  } catch (error) {
    console.log(`[Error] Payment info error!\n${error}\n\n`);
    return res.sendStatus(500);
  }
}

export async function createOrder(
  req: Request<{}, {}, orderCreateBody>,
  res: Response
) {
  try {
    const validation = validationResult(req);
    if (!validation.isEmpty()) return res.status(400).json(validation);

    const { session_id } = req.body;

    const exists = await OrderModel.findOne({ session_id });

    if (exists) {
      return res.status(200).json({ track: exists.track });
    }

    const track = (Math.random() * 1000000000).toFixed(0);

    try {
      await stripe.checkout.sessions.retrieve(session_id);
    } catch (error) {
      return res.status(400).json({ msg: 'Incorrect session_id!' });
    }

    const order = await OrderModel.create({ track, session_id });

    return res.status(200).json({ track: order.track });
  } catch (error) {
    console.log(`[Error] Order create error!\n${error}\n\n`);
    return res.sendStatus(500);
  }
}

export async function track(req: Request<{id:string}>,res:Response) {
  try {
    const { id } = req.params;

    const order = await OrderModel.findOne({track: id});

    if(!order) return res.sendStatus(404);
    
    const session = await stripe.checkout.sessions.retrieve(
      order.session_id
    );

    return res.status(200).json(session);
  } catch (error) {
    console.log(`[Error] Order create error!\n${error}\n\n`);
    return res.sendStatus(500);
  }
}