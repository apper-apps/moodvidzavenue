// Authentication service with email/password support
class AuthService {
  constructor() {
    this.users = [
      {
        Id: 1,
        email: 'demo@example.com',
        password: 'password123',
        name: 'Demo User',
        avatar: null,
        createdAt: new Date('2024-01-01').toISOString(),
        lastLogin: null
      }
    ];
    this.currentUser = null;
    this.nextId = 2;
  }

  // Simulate API delay
  delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Login with email and password
  async login(email, password) {
    await this.delay();
    
    const user = this.users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Update last login
    user.lastLogin = new Date().toISOString();
    
    // Remove password from returned user object
    const { password: _, ...userWithoutPassword } = user;
    this.currentUser = userWithoutPassword;
    
    // Store in localStorage for persistence
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    localStorage.setItem('token', `token-${user.Id}-${Date.now()}`);
    
    return userWithoutPassword;
  }

  // Register new user
  async register(userData) {
    await this.delay();
    
    const { email, password, name } = userData;
    
    // Check if user already exists
    if (this.users.find(u => u.email === email)) {
      throw new Error('User with this email already exists');
    }

    // Create new user
    const newUser = {
      Id: this.nextId++,
      email,
      password,
      name,
      avatar: null,
      createdAt: new Date().toISOString(),
      lastLogin: null
    };

    this.users.push(newUser);

    // Auto-login after registration
    return this.login(email, password);
  }

  // Logout
  async logout() {
    await this.delay(100);
    
    this.currentUser = null;
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  // Get current user from localStorage
  getCurrentUser() {
    try {
      const user = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      if (user && token) {
        this.currentUser = JSON.parse(user);
        return this.currentUser;
      }
    } catch (error) {
      console.error('Error getting current user:', error);
    }
    
    return null;
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.getCurrentUser();
  }

  // Update user profile
  async updateProfile(userId, updateData) {
    await this.delay();
    
    const userIndex = this.users.findIndex(u => u.Id === userId);
    
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    // Update user data (excluding password change for now)
    const { password, ...allowedUpdates } = updateData;
    this.users[userIndex] = { ...this.users[userIndex], ...allowedUpdates };
    
    // Update current user if it's the same user
    if (this.currentUser && this.currentUser.Id === userId) {
      const { password: _, ...userWithoutPassword } = this.users[userIndex];
      this.currentUser = userWithoutPassword;
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    }

    const { password: _, ...userWithoutPassword } = this.users[userIndex];
    return userWithoutPassword;
  }

  // Change password
  async changePassword(userId, currentPassword, newPassword) {
    await this.delay();
    
    const user = this.users.find(u => u.Id === userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    if (user.password !== currentPassword) {
      throw new Error('Current password is incorrect');
    }

    user.password = newPassword;
    return { success: true };
  }
}

// Export singleton instance
const authService = new AuthService();
export default authService;