import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    images: {
      type: [String],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: 'Category',
    },
    brand: {
      type: mongoose.Types.ObjectId,
      ref: 'Brand',
    },
    sizes: {
      type: [String],
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const ProductModel = mongoose.model('Product', ProductSchema);

export default ProductModel;
