const Order = require('../models/Order');
const Product = require('../models/Product');
const { logActivity } = require('../utils/activityLogger');

// @route  POST /api/orders
// @desc   Logged-in customer places an order
const createOrder = async (req, res) => {
  const { items, shippingAddress } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'No order items' });
  }

  // Validate stock & compute total server-side (never trust client prices)
  let totalAmount = 0;
  const validatedItems = [];

  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product) return res.status(404).json({ message: `Product not found: ${item.product}` });
    if (product.soldOut || product.stock < item.qty) {
      return res.status(400).json({ message: `${product.name} is sold out or has insufficient stock` });
    }
    totalAmount += product.price * item.qty;
    validatedItems.push({
      product: product._id,
      name: product.name,
      image: product.image,
      price: product.price,
      size: item.size,
      qty: item.qty,
    });

    product.stock -= item.qty;
    if (product.stock <= 0) product.soldOut = true;
    await product.save();
  }

  const order = await Order.create({
    user: req.user._id,
    items: validatedItems,
    shippingAddress,
    totalAmount,
  });

  res.status(201).json(order);
};

// @route  GET /api/orders/myorders
// @desc   Logged-in customer sees their own order history
const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
};

// @route  GET /api/orders
// @desc   Admin only - see ALL orders from every customer
const getAllOrders = async (req, res) => {
  const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 });
  res.json(orders);
};

// @route  PUT /api/orders/:id/status
// @desc   Admin only - update order status
const updateOrderStatus = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });

  const oldStatus = order.status;
  order.status = req.body.status || order.status;
  await order.save();

  if (order.status !== oldStatus) {
    await logActivity(req, {
      action: 'Updated order status',
      module: 'Orders',
      entityId: order._id,
      details: `Order #${order._id.toString().slice(-6)} moved from "${oldStatus}" to "${order.status}"`,
    });
  }

  res.json(order);
};

module.exports = { createOrder, getMyOrders, getAllOrders, updateOrderStatus };
