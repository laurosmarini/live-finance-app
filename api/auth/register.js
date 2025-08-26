export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password, name } = req.body;

  // Basic validation
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Email, password, and name are required' });
  }

  // Simple email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  // Password strength validation
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }

  // In a real app, you would:
  // 1. Check if user already exists in database
  // 2. Hash the password
  // 3. Save user to database
  // 4. Generate JWT token

  // For demo purposes, simulate successful registration
  const user = {
    id: Date.now().toString(),
    email,
    name,
    createdAt: new Date().toISOString()
  };

  // Generate a simple JWT token (in production, use proper JWT library)
  const token = Buffer.from(JSON.stringify({ userId: user.id, email })).toString('base64');

  res.status(201).json({
    message: 'User registered successfully',
    user: {
      id: user.id,
      email: user.email,
      name: user.name
    },
    token
  });
}
