const Promotion = require('../models/Promotion');
const { logActivity } = require('../utils/activityLogger');

// @route  GET /api/promotions
// @desc   Public - only promotions that are active AND currently within
//         their scheduled date window (if one is set). This is what the
//         storefront's hero carousel and promo banner read from.
const getActivePromotions = async (req, res) => {
  const now = new Date();
  const promotions = await Promotion.find({
    active: true,
    $and: [
      { $or: [{ startDate: { $exists: false } }, { startDate: null }, { startDate: { $lte: now } }] },
      { $or: [{ endDate: { $exists: false } }, { endDate: null }, { endDate: { $gte: now } }] },
    ],
  }).sort({ order: 1, createdAt: -1 });

  res.json(promotions);
};

// @route  GET /api/promotions/all
// @desc   Admin only - every promotion regardless of active state or
//         schedule, so the admin can manage upcoming/expired ones too.
const getAllPromotions = async (req, res) => {
  const promotions = await Promotion.find({}).sort({ createdAt: -1 });
  res.json(promotions);
};

// @route  POST /api/promotions
// @desc   Admin only
const createPromotion = async (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ message: 'Title is required' });

  const promotion = await Promotion.create(req.body);

  await logActivity(req, {
    action: 'Created promotion',
    module: 'Promotions',
    entityId: promotion._id,
    details: `Added "${promotion.title}" (${promotion.placement || 'hero'})`,
  });

  res.status(201).json(promotion);
};

// @route  PUT /api/promotions/:id
// @desc   Admin only
const updatePromotion = async (req, res) => {
  const promotion = await Promotion.findById(req.params.id);
  if (!promotion) return res.status(404).json({ message: 'Promotion not found' });

  const fields = ['title', 'eyebrow', 'description', 'ctaText', 'ctaLink', 'placement', 'active', 'startDate', 'endDate', 'order', 'theme', 'backgroundImage'];
  fields.forEach((field) => {
    if (req.body[field] !== undefined) promotion[field] = req.body[field];
  });

  const updated = await promotion.save();

  await logActivity(req, {
    action: 'Updated promotion',
    module: 'Promotions',
    entityId: updated._id,
    details: `Edited "${updated.title}"`,
  });

  res.json(updated);
};

// @route  PATCH /api/promotions/:id/toggle
// @desc   Admin only - quick on/off switch without opening the full form
const toggleActive = async (req, res) => {
  const promotion = await Promotion.findById(req.params.id);
  if (!promotion) return res.status(404).json({ message: 'Promotion not found' });

  promotion.active = !promotion.active;
  await promotion.save();

  await logActivity(req, {
    action: promotion.active ? 'Activated promotion' : 'Deactivated promotion',
    module: 'Promotions',
    entityId: promotion._id,
    details: `"${promotion.title}" turned ${promotion.active ? 'on' : 'off'}`,
  });

  res.json(promotion);
};

// @route  DELETE /api/promotions/:id
// @desc   Admin only
const deletePromotion = async (req, res) => {
  const promotion = await Promotion.findById(req.params.id);
  if (!promotion) return res.status(404).json({ message: 'Promotion not found' });
  await promotion.deleteOne();

  await logActivity(req, {
    action: 'Deleted promotion',
    module: 'Promotions',
    entityId: promotion._id,
    details: `Removed "${promotion.title}"`,
  });

  res.json({ message: 'Promotion removed' });
};

module.exports = {
  getActivePromotions,
  getAllPromotions,
  createPromotion,
  updatePromotion,
  toggleActive,
  deletePromotion,
};
