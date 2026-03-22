const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  text:      { type: String, required: true },
  createdAt: { type: Date,   default: Date.now },
});

const leadSchema = new mongoose.Schema(
  {
    name:        { type: String, required: [true, 'Name is required'], trim: true },
    email:       { type: String, required: [true, 'Email is required'], trim: true, lowercase: true },
    phone:       { type: String, trim: true, default: '' },
    company:     { type: String, trim: true, default: '' },
    source: {
      type: String,
      enum: ['Website', 'Referral', 'Social Media', 'Email', 'Cold Call', 'Other'],
      default: 'Website',
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Qualified', 'Converted', 'Lost'],
      default: 'New',
    },
    notes:       [noteSchema],
    followUpDate: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Lead', leadSchema);
