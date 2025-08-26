export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Demo user profile data
  const demoUserProfile = {
    id: '1',
    email: 'demo@finance-app.com',
    name: 'Demo User',
    firstName: 'Demo',
    lastName: 'User',
    phone: '+1-555-0123',
    avatar: 'https://ui-avatars.com/api/?name=Demo+User&background=4f46e5&color=fff',
    dateOfBirth: '1990-05-15',
    address: {
      street: '123 Finance Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    preferences: {
      currency: 'USD',
      language: 'en',
      timezone: 'America/New_York',
      notifications: {
        email: true,
        push: true,
        budgetAlerts: true,
        transactionAlerts: false,
        marketUpdates: true
      },
      privacy: {
        profileVisibility: 'private',
        shareAnalytics: false,
        twoFactorEnabled: false
      }
    },
    financial: {
      riskTolerance: 'moderate',
      investmentExperience: 'intermediate',
      annualIncome: 75000,
      netWorth: 125000
    },
    createdAt: '2023-01-15T10:30:00.000Z',
    lastLogin: new Date().toISOString(),
    accountStatus: 'active',
    verificationStatus: {
      email: true,
      phone: false,
      identity: false
    }
  };

  if (req.method === 'GET') {
    // Return user profile
    return res.status(200).json({
      success: true,
      user: demoUserProfile
    });
  }

  if (req.method === 'PUT') {
    // Update user profile
    const updates = req.body;
    const allowedFields = ['name', 'firstName', 'lastName', 'phone', 'dateOfBirth', 'address', 'preferences', 'financial'];
    
    const updatedProfile = { ...demoUserProfile };
    
    Object.keys(updates).forEach(key => {
      if (allowedFields.includes(key)) {
        if (typeof updates[key] === 'object' && !Array.isArray(updates[key])) {
          updatedProfile[key] = { ...updatedProfile[key], ...updates[key] };
        } else {
          updatedProfile[key] = updates[key];
        }
      }
    });

    updatedProfile.lastUpdated = new Date().toISOString();

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedProfile
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
