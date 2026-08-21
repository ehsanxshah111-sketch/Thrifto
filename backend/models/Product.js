const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, min: 0 }, // optional "was" price, shown struck-through when higher than price
    category: {
      type: String,
      enum: ['Sneakers', 'Running', 'Boots', 'Formal', 'Sandals'],
      default: 'Sneakers',
    },
    image: { type: String, required: true }, // e.g. /images/shoe1.svg
    sizes: [{ type: Number }], // e.g. [7,8,9,10]
    stock: { type: Number, required: true, default: 0, min: 0 },
    soldOut: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Keep soldOut in sync with stock automatically whenever stock is set to 0
productSchema.pre('save', function (next) {
  if (this.stock <= 0) this.soldOut = true;
  next();
});

module.exports = mongoose.model('Product', productSchema);
