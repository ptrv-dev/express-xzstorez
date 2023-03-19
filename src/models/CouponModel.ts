import mongoose from 'mongoose';

const CouponSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    coupon: { type: String, required: true },
    percent: { type: mongoose.Types.Decimal128, required: true },
    uses: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const CouponModel = mongoose.model('Coupon', CouponSchema);

export default CouponModel;
