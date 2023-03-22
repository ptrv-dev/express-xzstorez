import mongoose from 'mongoose';

const InviteSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    invites: {
      type: Array,
      required: true,
    },
  },
  { timestamps: true }
);

const InviteModel = mongoose.model('Invite', InviteSchema);

export default InviteModel;
