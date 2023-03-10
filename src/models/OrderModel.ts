import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema(
  {
    track: {
      type: String,
      required: true,
    },
    session_id: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const OrderModel = mongoose.model('Order', OrderSchema);

export default OrderModel;
