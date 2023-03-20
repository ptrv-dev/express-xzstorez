import mongoose from 'mongoose';

const SellixOrderSchema = new mongoose.Schema(
  {
    track: {
      type: String,
      default: null,
    },
    uniqueId: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
    },
    status: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const SellixOrderModel = mongoose.model('SellixOrder', SellixOrderSchema);

export default SellixOrderModel;
