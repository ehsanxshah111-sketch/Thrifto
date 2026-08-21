const Product = require('../models/Product');
const { logActivity } = require('../utils/activityLogger');

// @route  GET /api/products
// @desc   Public - list all products, with optional ?category= & ?search=
//         & ?featured=true & ?onSale=true
const getProducts = async (req, res) => {
  const { category, search, featured, onSale } = req.query;
  const filter = {};
  if (category) filter.category = category;
  if (search) filter.name = { $regex: search, $options: 'i' };
  if (featured === 'true') filter.featured = true;
  if (onSale === 'true') filter.$expr = { $gt: ['$compareAtPrice', '$price'] };

  const products = await Product.find(filter).sort({ createdAt: -1 });
  res.json(products);
};

// @route  GET /api/products/:id
const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
};

// @route  POST /api/products
// @desc   Admin only - add a new shoe to the store
const createProduct = async (req, res) => {
  const { name, description, price, compareAtPrice, category, image, sizes, stock } = req.body;

  if (!name || !description || price === undefined || !image) {
    return res.status(400).json({ message: 'Missing required product fields' });
  }

  const product = await Product.create({
    name,
    description,
    price,
    compareAtPrice: compareAtPrice || undefined,
    category,
    image,
    sizes: sizes || [],
    stock: stock ?? 0,
    soldOut: (stock ?? 0) <= 0,
  });

  await logActivity(req, {
    action: 'Created product',
    module: 'Products',
    entityId: product._id,
    details: `Added "${product.name}" (PKR ${product.price})`,
  });

  res.status(201).json(product);
};

// @route  PUT /api/products/:id
// @desc   Admin only - edit any field, change stock, or toggle sold out
const updateProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  const fields = ['name', 'description', 'price', 'compareAtPrice', 'category', 'image', 'sizes', 'stock', 'soldOut', 'featured'];
  fields.forEach((field) => {
    if (req.body[field] !== undefined) product[field] = req.body[field];
  });

  // If admin sets stock to 0, force soldOut true. If admin raises stock above 0
  // and didn't explicitly say soldOut in this request, bring it back in stock.
  if (req.body.stock !== undefined) {
    if (product.stock <= 0) product.soldOut = true;
    else if (req.body.soldOut === undefined) product.soldOut = false;
  }

  const updated = await product.save();

  await logActivity(req, {
    action: 'Updated product',
    module: 'Products',
    entityId: updated._id,
    details: `Edited "${updated.name}"`,
  });

  res.json(updated);
};

// @route  PATCH /api/products/:id/sold-out
// @desc   Admin only - quick toggle for marking a product sold out / back in stock
const toggleSoldOut = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  product.soldOut = !product.soldOut;
  await product.save();

  await logActivity(req, {
    action: product.soldOut ? 'Marked sold out' : 'Marked back in stock',
    module: 'Products',
    entityId: product._id,
    details: `"${product.name}" marked ${product.soldOut ? 'sold out' : 'back in stock'}`,
  });

  res.json(product);
};

// @route  DELETE /api/products/:id
// @desc   Admin only
const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  await product.deleteOne();

  await logActivity(req, {
    action: 'Deleted product',
    module: 'Products',
    entityId: product._id,
    details: `Removed "${product.name}"`,
  });

  res.json({ message: 'Product removed' });
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  toggleSoldOut,
  deleteProduct,
};
