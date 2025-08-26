export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Demo user profile
  const demoProfile = {
    id: 1,
    email: 'demo@finance-app.com',
    firstName: 'Demo',
    lastName: 'User',
    avatar: null,
    timezone: 'America/New_York',
    currency: 'USD',
    language: 'en',
    theme: 'light',
    notifications: {
      email: true,
      push: true,
      sms: false,
      priceAlerts: true,
      weeklyReports: true
    },
    preferences: {
      defaultDashboardView: 'overview',
      chartPeriod: '1M',
      showPortfolioBalance: true,
      riskTolerance: 'moderate'
    },
    createdAt: '2024-01-15T10:30:00Z',
    lastLogin: new Date().toISOString(),
    accountStatus: 'active',
    subscription: {
      plan: 'premium',
      status: 'active',
      renewDate: '2024-12-15T00:00:00Z',
      features: [
        'unlimited_transactions',
        'advanced_analytics',
        'portfolio_insights',
        'price_alerts',
        'export_data'
      ]
    }
  };

  try {
    if (req.method === 'GET') {
      // Get user profile
      res.json({
        profile: demoProfile,
        lastUpdated: new Date().toISOString()
      });
    }

    if (req.method === 'PUT' || req.method === 'PATCH') {
      // Update user profile
      const updates = req.body;
      
      // Merge updates with existing profile (demo)
      const updatedProfile = {
        ...demoProfile,
        ...updates,
        id: demoProfile.id, // Preserve ID
        email: demoProfile.email, // Preserve email
        lastUpdated: new Date().toISOString()
      };

      res.json({
        message: 'Profile updated successfully',
        profile: updatedProfile
      });
    }

    if (req.method === 'DELETE') {
      // Delete account (demo - just return success)
      res.json({
        message: 'Account deletion requested',
        status: 'pending',
        deletionDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
      });
    }

  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({
      error: 'Failed to process profile request',
      message: error.message
    });
  }
}
