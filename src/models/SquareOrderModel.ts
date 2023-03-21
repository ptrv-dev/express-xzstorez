import mongoose from 'mongoose';

const SquareOrderSchema = new mongoose.Schema(
  {
    track: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const SquareOrderModel = mongoose.model('SquareOrder', SquareOrderSchema);

export default SquareOrderModel;
