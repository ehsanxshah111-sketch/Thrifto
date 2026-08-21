const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { logActivity } = require('../utils/activityLogger');

const generateToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

// @route  POST /api/auth/register
// @desc   Register a normal customer account. The public endpoint can NEVER
//         create an admin - role is always forced to 'user' here. Admin
//         accounts are only created via the seed script (npm run seed).
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please fill in all fields' });
  }

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(400).json({ message: 'An account with this email already exists' });
  }

  const user = await User.create({ name, email, password, role: 'user' });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id, user.role),
  });
};

// @route  POST /api/auth/login
// @desc   Shared login for both customers and admins - the role that comes
//         back in the token/response is what the frontend uses to route
//         the person to the customer site or the admin dashboard.
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    if (user.role === 'admin') {
      await logActivity(req, {
        action: 'Logged in',
        module: 'Auth',
        entityId: user._id,
        details: `${user.name} (${user.email}) logged into the admin panel`,
        actor: user,
      });
    }
    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  }

  res.status(401).json({ message: 'Invalid email or password' });
};

// @route  GET /api/auth/me
const getMe = async (req, res) => {
  res.json(req.user);
};

module.exports = { registerUser, loginUser, getMe };
