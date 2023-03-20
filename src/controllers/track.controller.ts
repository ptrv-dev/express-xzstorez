import { Request, Response } from 'express';

import { stripe } from './payment.stripe.controller';

import OrderModel from '../models/OrderModel';
import SellixOrderModel from '../models/SellixOrderModel';

interface trackResult {
  fullName: string;
  email: string;
  phone: string;
  address: string;
}

export async function track(req: Request, res: Response) {
  try {
    const { id } = req.params;
    if (!id) return res.sendStatus(400);

    const result = {} as trackResult;

    const stripeOrder = await OrderModel.findOne({ track: id });
    const sellixOrder = await SellixOrderModel.findOne({ track: id });
    if (stripeOrder) {
      const session = await stripe.checkout.sessions.retrieve(
        stripeOrder.session_id
      );
      result['fullName'] = session.customer_details?.name || 'Not specified';
      result['email'] = session.customer_details?.email || 'Not specified';
      result['phone'] = session.customer_details?.phone || 'Not specified';
      result['address'] = [
        session.customer_details?.address?.country,
        session.customer_details?.address?.state,
        session.customer_details?.address?.city,
        session.customer_details?.address?.line1,
      ].join(', ');
    } else if (sellixOrder) {
      result['fullName'] = sellixOrder.fullName;
      result['email'] = sellixOrder.email;
      result['phone'] = sellixOrder.phoneNumber;
      result['address'] = [
        sellixOrder.country,
        sellixOrder.state,
        sellixOrder.city,
        sellixOrder.address,
      ].join(', ');
    }

    if (!result.address)
      return res.status(404).json({ msg: 'Incorrect track number!' });

    return res.status(200).json(result);
  } catch (error) {}
}
