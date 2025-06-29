import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with placeholder publishable key
const stripePromise = loadStripe('pk_test_PLACEHOLDER_PUBLISHABLE_KEY');

class VipService {
  constructor() {
    // Mock subscription data following integer ID convention
    this.subscriptions = [
      {
        Id: 1,
        userId: 1,
        tier: 'Pro',
        status: 'active',
        stripeSubscriptionId: 'sub_placeholder_123',
        stripeCustomerId: 'cus_placeholder_123',
        startDate: new Date('2024-01-01').toISOString(),
        expiresAt: new Date('2024-12-31').toISOString(),
        createdAt: new Date('2024-01-01').toISOString()
      }
    ];
    
    // Subscription tiers with placeholder Stripe product IDs
    this.tiers = {
      Free: {
        name: 'Free',
        price: 0,
        currency: 'usd',
        interval: null,
        features: [
          'Basic video creation',
          '5 videos per month',
          'Standard quality',
          'Basic moods'
        ],
        limits: {
          videosPerMonth: 5,
          maxDuration: 30,
          quality: 'standard'
        }
      },
      Pro: {
        name: 'Pro',
        price: 999, // $9.99 in cents
        currency: 'usd',
        interval: 'month',
        stripePriceId: 'price_PLACEHOLDER_PRO_MONTHLY',
        features: [
          'Unlimited video creation',
          'HD quality exports',
          'All mood templates',
          'Priority processing',
          'Remove watermark'
        ],
        limits: {
          videosPerMonth: -1, // unlimited
          maxDuration: 120,
          quality: 'hd'
        }
      },
      Premium: {
        name: 'Premium',
        price: 1999, // $19.99 in cents
        currency: 'usd',
        interval: 'month',
        stripePriceId: 'price_PLACEHOLDER_PREMIUM_MONTHLY',
        features: [
          'Everything in Pro',
          '4K quality exports',
          'Advanced AI features',
          'Custom branding',
          'API access',
          'Priority support'
        ],
        limits: {
          videosPerMonth: -1, // unlimited
          maxDuration: 300,
          quality: '4k'
        }
      }
    };
    
    this.nextId = 2;
  }

  // Simulate API delay
  delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Get all subscription tiers
  async getTiers() {
    await this.delay();
    return { ...this.tiers };
  }

  // Get user's VIP status
  async getVipStatus(userId = 1) {
    await this.delay();
    
    const subscription = this.subscriptions.find(s => s.userId === userId && s.status === 'active');
    
    if (!subscription) {
      return {
        tier: 'Free',
        status: 'free',
        features: this.tiers.Free.features,
        limits: this.tiers.Free.limits
      };
    }

    return {
      Id: subscription.Id,
      tier: subscription.tier,
      status: subscription.status,
      expiresAt: subscription.expiresAt,
      features: this.tiers[subscription.tier].features,
      limits: this.tiers[subscription.tier].limits,
      stripeSubscriptionId: subscription.stripeSubscriptionId
    };
  }

  // Create Stripe checkout session
  async createCheckoutSession(tierName, userId = 1) {
    await this.delay();
    
    const tier = this.tiers[tierName];
    if (!tier || !tier.stripePriceId) {
      throw new Error('Invalid subscription tier');
    }

    try {
      const stripe = await stripePromise;
      
      // In a real implementation, this would make an API call to your backend
      // which would create the Stripe checkout session
      const mockCheckoutSession = {
        id: `cs_placeholder_${Date.now()}`,
        url: `https://checkout.stripe.com/c/pay/cs_placeholder_${Date.now()}#placeholder`,
        // Placeholder session data
        client_reference_id: userId.toString(),
        metadata: {
          tier: tierName,
          userId: userId.toString()
        }
      };

      // Simulate Stripe checkout redirect
      // In production, you would redirect to session.url
      console.log('Redirecting to Stripe Checkout:', mockCheckoutSession.url);
      
      // Mock successful subscription creation after delay
      setTimeout(() => {
        this.handleSuccessfulPayment(userId, tierName, mockCheckoutSession.id);
      }, 2000);

      return mockCheckoutSession;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw new Error('Failed to create checkout session');
    }
  }

  // Handle successful payment (webhook simulation)
  async handleSuccessfulPayment(userId, tierName, sessionId) {
    await this.delay();
    
    // Check if user already has an active subscription
    const existingIndex = this.subscriptions.findIndex(
      s => s.userId === userId && s.status === 'active'
    );
    
    const newSubscription = {
      Id: this.nextId++,
      userId: parseInt(userId),
      tier: tierName,
      status: 'active',
      stripeSubscriptionId: `sub_${sessionId}_${Date.now()}`,
      stripeCustomerId: `cus_${userId}_${Date.now()}`,
      startDate: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      createdAt: new Date().toISOString()
    };

    if (existingIndex !== -1) {
      // Cancel existing subscription
      this.subscriptions[existingIndex].status = 'cancelled';
    }

    this.subscriptions.push(newSubscription);
    return newSubscription;
  }

  // Cancel subscription
  async cancelSubscription(subscriptionId) {
    await this.delay();
    
    const subscription = this.subscriptions.find(s => s.Id === parseInt(subscriptionId));
    if (!subscription) {
      throw new Error('Subscription not found');
    }

    // In production, this would call Stripe API to cancel subscription
    subscription.status = 'cancelled';
    subscription.cancelledAt = new Date().toISOString();
    
    return { success: true, subscription: { ...subscription } };
  }

  // Update subscription
  async updateSubscription(subscriptionId, newTierName) {
    await this.delay();
    
    const subscription = this.subscriptions.find(s => s.Id === parseInt(subscriptionId));
    if (!subscription) {
      throw new Error('Subscription not found');
    }

    const newTier = this.tiers[newTierName];
    if (!newTier) {
      throw new Error('Invalid tier');
    }

    // In production, this would call Stripe API to update subscription
    subscription.tier = newTierName;
    subscription.updatedAt = new Date().toISOString();
    
    return { ...subscription };
  }

  // Get subscription history
  async getSubscriptionHistory(userId) {
    await this.delay();
    
    const userSubscriptions = this.subscriptions.filter(s => s.userId === userId);
    return [...userSubscriptions];
  }

  // Check if user has access to feature
  async hasFeatureAccess(featureName, userId = 1) {
    const status = await this.getVipStatus(userId);
    
    const featureRequirements = {
      'unlimited_videos': ['Pro', 'Premium'],
      'hd_export': ['Pro', 'Premium'],
      '4k_export': ['Premium'],
      'remove_watermark': ['Pro', 'Premium'],
      'priority_processing': ['Pro', 'Premium'],
      'api_access': ['Premium'],
      'custom_branding': ['Premium']
    };

    const requiredTiers = featureRequirements[featureName];
    return requiredTiers ? requiredTiers.includes(status.tier) : true;
  }

  // Get usage limits for user
  async getUsageLimits(userId = 1) {
    const status = await this.getVipStatus(userId);
    return status.limits;
  }
}

// Export singleton instance
const vipService = new VipService();
export default vipService;