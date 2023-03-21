import mongoose from 'mongoose';

const SettingsSchema = new mongoose.Schema({
  cryptoDiscount: {
    type: mongoose.Types.Decimal128,
    default: 0,
  },
});

const SettingsModel = mongoose.model('Settings', SettingsSchema);

export default SettingsModel;
