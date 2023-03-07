import mongoose from 'mongoose';

const BrandSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const BrandModel = mongoose.model('Brand', BrandSchema);

export default BrandModel;
