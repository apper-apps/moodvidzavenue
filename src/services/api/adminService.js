import vipService from './vipService';

class AdminService {
  constructor() {
    // Mock admin users - in production, this would be managed by backend
    this.adminUsers = [
      { Id: 1, email: 'admin@moodify.com', role: 'admin' }
    ];

    // Mock user data following integer ID convention
    this.users = [
      {
        Id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        subscriptionTier: 'Pro',
        status: 'active',
        videoCount: 15,
        createdAt: new Date('2024-01-15').toISOString(),
        lastLogin: new Date('2024-01-20').toISOString()
      },
      {
        Id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        subscriptionTier: 'Free',
        status: 'active',
        videoCount: 3,
        createdAt: new Date('2024-01-10').toISOString(),
        lastLogin: new Date('2024-01-19').toISOString()
      },
      {
        Id: 3,
        name: 'Mike Johnson',
        email: 'mike@example.com',
        subscriptionTier: 'Premium',
        status: 'active',
        videoCount: 28,
        createdAt: new Date('2023-12-20').toISOString(),
        lastLogin: new Date('2024-01-21').toISOString()
      },
      {
        Id: 4,
        name: 'Sarah Wilson',
        email: 'sarah@example.com',
        subscriptionTier: 'Pro',
        status: 'suspended',
        videoCount: 8,
        createdAt: new Date('2024-01-05').toISOString(),
        lastLogin: new Date('2024-01-18').toISOString()
      },
      {
        Id: 5,
        name: 'David Brown',
        email: 'david@example.com',
        subscriptionTier: 'Free',
        status: 'active',
        videoCount: 1,
        createdAt: new Date('2024-01-18').toISOString(),
        lastLogin: new Date('2024-01-21').toISOString()
      }
    ];

    this.nextUserId = 6;
  }

  delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Check if current user has admin access
  async checkAdminAccess(userId = 1) {
    await this.delay();
    
    // In production, this would verify JWT token and check user role
    const isAdmin = this.adminUsers.some(admin => admin.Id === userId);
    
    return { isAdmin };
  }

  // Get dashboard data
  async getDashboardData() {
    await this.delay();
    
    const totalUsers = this.users.length;
    const activeUsers = this.users.filter(u => u.status === 'active').length;
    const proUsers = this.users.filter(u => u.subscriptionTier === 'Pro').length;
    const premiumUsers = this.users.filter(u => u.subscriptionTier === 'Premium').length;
    const freeUsers = this.users.filter(u => u.subscriptionTier === 'Free').length;
    
    // Calculate metrics
    const activeSubscriptions = proUsers + premiumUsers;
    const monthlyRevenue = (proUsers * 9.99) + (premiumUsers * 19.99);
    const totalVideos = this.users.reduce((sum, user) => sum + user.videoCount, 0);
    
    // Recent activity
    const recentActivity = [
      {
        Id: 1,
        icon: 'UserPlus',
        description: 'New user registered',
        timestamp: '2 hours ago'
      },
      {
        Id: 2,
        icon: 'Crown',
        description: 'User upgraded to Pro',
        timestamp: '4 hours ago'
      },
      {
        Id: 3,
        icon: 'Video',
        description: 'Video created',
        timestamp: '6 hours ago'
      },
      {
        Id: 4,
        icon: 'DollarSign',
        description: 'Payment received',
        timestamp: '8 hours ago'
      }
    ];

    // Subscription breakdown
    const subscriptionBreakdown = [
      {
        name: 'Free',
        count: freeUsers,
        percentage: totalUsers > 0 ? Math.round((freeUsers / totalUsers) * 100) : 0
      },
      {
        name: 'Pro',
        count: proUsers,
        percentage: totalUsers > 0 ? Math.round((proUsers / totalUsers) * 100) : 0
      },
      {
        name: 'Premium',
        count: premiumUsers,
        percentage: totalUsers > 0 ? Math.round((premiumUsers / totalUsers) * 100) : 0
      }
    ];

    return {
      metrics: {
        totalUsers,
        activeUsers,
        newUsersThisMonth: 12,
        activeSubscriptions,
        subscriptionGrowth: 15,
        monthlyRevenue: monthlyRevenue.toFixed(0),
        revenueGrowth: 23,
        totalVideos,
        videosThisMonth: 45
      },
      recentActivity,
      subscriptionBreakdown
    };
  }

  // Get all users
  async getAllUsers() {
    await this.delay();
    return [...this.users];
  }

  // Get user by ID
  async getUserById(id) {
    await this.delay();
    const user = this.users.find(u => u.Id === parseInt(id));
    if (!user) {
      throw new Error('User not found');
    }
    return { ...user };
  }

  // Create new user
  async createUser(userData) {
    await this.delay();
    
    const newUser = {
      Id: this.nextUserId++,
      name: userData.name,
      email: userData.email,
      subscriptionTier: userData.subscriptionTier || 'Free',
      status: 'active',
      videoCount: 0,
      createdAt: new Date().toISOString(),
      lastLogin: null
    };

    this.users.push(newUser);
    return { ...newUser };
  }

  // Update user
  async updateUser(id, userData) {
    await this.delay();
    
    const userIndex = this.users.findIndex(u => u.Id === parseInt(id));
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    const updatedUser = {
      ...this.users[userIndex],
      ...userData,
      Id: parseInt(id), // Preserve ID
      updatedAt: new Date().toISOString()
    };

    this.users[userIndex] = updatedUser;
    return { ...updatedUser };
  }

  // Delete user
  async deleteUser(id) {
    await this.delay();
    
    const userIndex = this.users.findIndex(u => u.Id === parseInt(id));
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    this.users.splice(userIndex, 1);
    return { success: true };
  }

  // Update user subscription
  async updateUserSubscription(id, newTier) {
    await this.delay();
    
    const userIndex = this.users.findIndex(u => u.Id === parseInt(id));
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    const validTiers = ['Free', 'Pro', 'Premium'];
    if (!validTiers.includes(newTier)) {
      throw new Error('Invalid subscription tier');
    }

    this.users[userIndex].subscriptionTier = newTier;
    this.users[userIndex].updatedAt = new Date().toISOString();

    return { ...this.users[userIndex] };
  }

  // Suspend user
  async suspendUser(id) {
    await this.delay();
    
    const userIndex = this.users.findIndex(u => u.Id === parseInt(id));
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    this.users[userIndex].status = 'suspended';
    this.users[userIndex].suspendedAt = new Date().toISOString();

    return { ...this.users[userIndex] };
  }

  // Activate user
  async activateUser(id) {
    await this.delay();
    
    const userIndex = this.users.findIndex(u => u.Id === parseInt(id));
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    this.users[userIndex].status = 'active';
    this.users[userIndex].activatedAt = new Date().toISOString();

    return { ...this.users[userIndex] };
  }

  // Export user data
  async exportData() {
    await this.delay(500);
    
    const exportData = {
      users: this.users,
      summary: {
        totalUsers: this.users.length,
        activeUsers: this.users.filter(u => u.status === 'active').length,
        suspendedUsers: this.users.filter(u => u.status === 'suspended').length,
        freeUsers: this.users.filter(u => u.subscriptionTier === 'Free').length,
        proUsers: this.users.filter(u => u.subscriptionTier === 'Pro').length,
        premiumUsers: this.users.filter(u => u.subscriptionTier === 'Premium').length,
        totalVideos: this.users.reduce((sum, user) => sum + user.videoCount, 0)
      },
      exportedAt: new Date().toISOString()
    };

    // In production, this would generate and download a file
    console.log('Export data:', exportData);
    
    return { success: true, data: exportData };
  }

  // Get analytics data
  async getAnalytics(timeframe = '30d') {
    await this.delay();
    
    // Mock analytics data
    const analytics = {
      userGrowth: [
        { date: '2024-01-01', users: 10 },
        { date: '2024-01-02', users: 12 },
        { date: '2024-01-03', users: 15 },
        { date: '2024-01-04', users: 18 },
        { date: '2024-01-05', users: 20 }
      ],
      subscriptionTrends: [
        { tier: 'Free', count: this.users.filter(u => u.subscriptionTier === 'Free').length },
        { tier: 'Pro', count: this.users.filter(u => u.subscriptionTier === 'Pro').length },
        { tier: 'Premium', count: this.users.filter(u => u.subscriptionTier === 'Premium').length }
      ],
      videoCreation: [
        { date: '2024-01-01', count: 5 },
        { date: '2024-01-02', count: 8 },
        { date: '2024-01-03', count: 12 },
        { date: '2024-01-04', count: 10 },
        { date: '2024-01-05', count: 15 }
      ]
    };

    return analytics;
  }

  // Get system health
  async getSystemHealth() {
    await this.delay();
    
    return {
      status: 'healthy',
      uptime: '99.9%',
      responseTime: '120ms',
      activeConnections: 245,
      memoryUsage: '68%',
      cpuUsage: '34%',
      diskUsage: '45%',
      lastChecked: new Date().toISOString()
    };
  }
}

// Export singleton instance
const adminService = new AdminService();
export default adminService;