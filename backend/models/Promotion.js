const mongoose = require('mongoose');

const promotionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true }, // e.g. "Independence Day Sale"
    eyebrow: { type: String, trim: true, default: '' },  // e.g. "Limited Time" / "14th August"
    description: { type: String, trim: true, default: '' },
    ctaText: { type: String, trim: true, default: 'Shop Now' },
    ctaLink: { type: String, trim: true, default: '/shop' },
    // "hero" = rotates in the homepage hero carousel
    // "banner" = the single full-width promo strip further down the page
    placement: { type: String, enum: ['hero', 'banner'], default: 'hero' },
    active: { type: Boolean, default: true },
    // Optional scheduling window - e.g. an Independence Day sale that should
    // only show itself between two dates without the admin needing to
    // remember to switch it off manually.
    startDate: { type: Date },
    endDate: { type: Date },
    order: { type: Number, default: 0 }, // lower shows first among hero slides
    // Visual style for this specific banner/slide - lets e.g. an
    // Independence Day sale look different from a regular season sale.
    theme: {
      type: String,
      enum: ['classic', 'ivory', 'emerald', 'burgundy', 'gold'],
      default: 'classic',
    },
    backgroundImage: { type: String, default: '' }, // optional, overrides the theme color when set
  },
  { timestamps: true }
);

module.exports = mongoose.model('Promotion', promotionSchema);
