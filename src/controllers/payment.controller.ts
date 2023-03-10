import { Request, Response } from 'express';
import Stripe from 'stripe';
import { paymentCreateBody } from '../@types/requestBody';

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
          unit_amount_decimal: item.price.toFixed(2).replace('.', ''),
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

    return res.status(200).json(session.url);
  } catch (error) {
    console.log(`[Error] Payment create error!\n${error}\n\n`);
    return res.sendStatus(500);
  }
}
