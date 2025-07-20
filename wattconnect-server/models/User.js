const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['customer', 'admin', 'engineer'], default: 'customer' },

  isExistingCustomer: { type: Boolean, default: false },

  consumerNumber: {
    type: String,
    validate: {
      validator: function (v) {
        return !this.isExistingCustomer || /^\d{12}$/.test(v);
      },
      message: 'Consumer number must be 12 digits',
    },
  },

  usageType: {
    type: String,
    enum: ['domestic', 'commercial'],
    validate: {
      validator: function (v) {
        return !this.isExistingCustomer || !!v;
      },
      message: 'Usage type is required for existing customers',
    },
  },

  category: {
    type: String,
    validate: {
      validator: function (v) {
        return !this.isExistingCustomer || !!v;
      },
      message: 'Category is required for existing customers',
    },
  },

  fmeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FME",
  },
});

module.exports = mongoose.model('User', userSchema);
