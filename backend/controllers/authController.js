const jwt = require('jsonwebtoken');

const ADMIN = { email: 'admin@crm.com', password: 'Admin@123', name: 'Admin', role: 'admin' };

exports.login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ success: false, message: 'Email and password required' });
  if (email !== ADMIN.email || password !== ADMIN.password)
    return res.status(401).json({ success: false, message: 'Invalid credentials' });

  const token = jwt.sign(
    { email: ADMIN.email, role: ADMIN.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  res.json({ success: true, token, user: { email: ADMIN.email, name: ADMIN.name, role: ADMIN.role } });
};

exports.verify = (req, res) => {
  res.json({ success: true, user: req.user });
};
