const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  consumerNumber: {
    type: String,
    maxlength: 12,
    minlength: 12,
    default: null,
    validate: {
      validator: function (v) {
        return v === null || /^\d{12}$/.test(v); 
      },
      message: 'Consumer number must be a 12-digit number',
    },
  },
});

module.exports = mongoose.model('User', userSchema);
