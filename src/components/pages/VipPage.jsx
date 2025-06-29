import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import vipService from '@/services/api/vipService';
import authService from '@/services/api/authService';

const VipPage = () => {
  const [tiers, setTiers] = useState({});
  const [currentStatus, setCurrentStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingTier, setProcessingTier] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const currentUser = authService.getCurrentUser();
      setUser(currentUser);
      
      const [tiersData, statusData] = await Promise.all([
        vipService.getTiers(),
        currentUser ? vipService.getVipStatus(currentUser.Id) : Promise.resolve({ tier: 'Free' })
      ]);
      
      setTiers(tiersData);
      setCurrentStatus(statusData);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load VIP information');
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (tierName) => {
    if (!user) {
      toast.error('Please sign in to upgrade');
      return;
    }

    try {
      setProcessingTier(tierName);
      toast.info('Redirecting to secure checkout...');
      
      const session = await vipService.createCheckoutSession(tierName, user.Id);
      
      // In production, redirect to session.url
      // window.location.href = session.url;
      
      // For demo, simulate successful upgrade
      setTimeout(async () => {
        await loadData();
        toast.success(`Successfully upgraded to ${tierName}!`);
        setProcessingTier(null);
      }, 3000);
      
    } catch (err) {
      toast.error(err.message || 'Failed to start checkout process');
      setProcessingTier(null);
    }
  };

  const handleCancelSubscription = async () => {
    if (!currentStatus?.Id) return;

    if (!confirm('Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your billing period.')) {
      return;
    }

    try {
      await vipService.cancelSubscription(currentStatus.Id);
      toast.success('Subscription cancelled successfully');
      await loadData();
    } catch (err) {
      toast.error(err.message || 'Failed to cancel subscription');
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const tierOrder = ['Free', 'Pro', 'Premium'];
  const orderedTiers = tierOrder.map(name => ({ name, ...tiers[name] }));

  return (
    <div className="space-y-8 py-6 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        className="text-center space-y-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium">
          <ApperIcon name="Crown" size={16} />
          <span>VIP Membership</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-bold gradient-text">
          Unlock Premium Features
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Choose the perfect plan for your video creation needs. Upgrade anytime and cancel whenever you want.
        </p>
      </motion.div>

      {/* Current Status */}
      {user && currentStatus && (
        <motion.div
          className="card-premium p-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                currentStatus.tier === 'Free' 
                  ? 'bg-gray-100' 
                  : 'bg-gradient-to-r from-yellow-400 to-orange-500'
              }`}>
                <ApperIcon 
                  name={currentStatus.tier === 'Free' ? 'User' : 'Crown'} 
                  size={20} 
                  className={currentStatus.tier === 'Free' ? 'text-gray-600' : 'text-white'} 
                />
              </div>
              <div>
                <h3 className="text-xl font-display font-semibold text-gray-800">
                  Current Plan: {currentStatus.tier}
                </h3>
                <p className="text-gray-600">
                  {currentStatus.tier === 'Free' 
                    ? 'You are on the free plan' 
                    : `Active until ${new Date(currentStatus.expiresAt).toLocaleDateString()}`
                  }
                </p>
              </div>
            </div>
            {currentStatus.tier !== 'Free' && (
              <Button
                onClick={handleCancelSubscription}
                variant="ghost"
                className="text-red-600 hover:text-red-700"
              >
                Cancel Subscription
              </Button>
            )}
          </div>
        </motion.div>
      )}

      {/* Pricing Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {orderedTiers.map((tier, index) => (
          <motion.div
            key={tier.name}
            className={`relative card-premium p-8 space-y-6 ${
              tier.name === 'Pro' ? 'ring-2 ring-primary/20 scale-105' : ''
            }`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
          >
            {tier.name === 'Pro' && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <div className="bg-primary text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </div>
              </div>
            )}

            <div className="text-center space-y-4">
              <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
                tier.name === 'Free' 
                  ? 'bg-gray-100' 
                  : 'bg-gradient-to-r from-yellow-400 to-orange-500'
              }`}>
                <ApperIcon 
                  name={tier.name === 'Free' ? 'User' : 'Crown'} 
                  size={24} 
                  className={tier.name === 'Free' ? 'text-gray-600' : 'text-white'} 
                />
              </div>
              
              <div>
                <h3 className="text-2xl font-display font-bold text-gray-800">
                  {tier.name}
                </h3>
                <div className="text-4xl font-bold text-gray-800 mt-2">
                  {tier.price === 0 ? 'Free' : `$${(tier.price / 100).toFixed(2)}`}
                  {tier.interval && (
                    <span className="text-lg text-gray-500 font-normal">/{tier.interval}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {tier.features.map((feature, featureIndex) => (
                <div key={featureIndex} className="flex items-center space-x-3">
                  <ApperIcon name="Check" size={16} className="text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              {currentStatus?.tier === tier.name ? (
                <Button
                  disabled
                  className="w-full"
                  variant="secondary"
                >
                  <ApperIcon name="Check" size={16} />
                  Current Plan
                </Button>
              ) : tier.name === 'Free' ? (
                <Button
                  disabled
                  className="w-full"
                  variant="ghost"
                >
                  Always Free
                </Button>
              ) : (
                <Button
                  onClick={() => handleUpgrade(tier.name)}
                  disabled={processingTier === tier.name || !user}
                  className="w-full"
                  variant={tier.name === 'Pro' ? 'primary' : 'secondary'}
                >
                  {processingTier === tier.name ? (
                    <>
                      <ApperIcon name="Loader2" size={16} className="animate-spin" />
                      Processing...
                    </>
                  ) : !user ? (
                    'Sign In to Upgrade'
                  ) : currentStatus?.tier && tierOrder.indexOf(currentStatus.tier) > tierOrder.indexOf(tier.name) ? (
                    'Downgrade'
                  ) : (
                    'Upgrade Now'
                  )}
                </Button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Features Comparison */}
      <motion.div
        className="card-premium p-8 space-y-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <h3 className="text-2xl font-display font-bold text-gray-800 text-center">
          Feature Comparison
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-4 px-4 font-semibold text-gray-800">Features</th>
                {tierOrder.map(tierName => (
                  <th key={tierName} className="text-center py-4 px-4 font-semibold text-gray-800">
                    {tierName}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="space-y-2">
              {[
                { feature: 'Videos per month', Free: '5', Pro: 'Unlimited', Premium: 'Unlimited' },
                { feature: 'Video quality', Free: 'Standard', Pro: 'HD', Premium: '4K' },
                { feature: 'Max duration', Free: '30s', Pro: '2min', Premium: '5min' },
                { feature: 'Watermark removal', Free: '✗', Pro: '✓', Premium: '✓' },
                { feature: 'Priority processing', Free: '✗', Pro: '✓', Premium: '✓' },
                { feature: 'Custom branding', Free: '✗', Pro: '✗', Premium: '✓' },
                { feature: 'API access', Free: '✗', Pro: '✗', Premium: '✓' },
                { feature: 'Priority support', Free: '✗', Pro: '✗', Premium: '✓' }
              ].map((row, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium text-gray-700">{row.feature}</td>
                  {tierOrder.map(tierName => (
                    <td key={tierName} className="py-3 px-4 text-center">
                      {row[tierName] === '✓' ? (
                        <ApperIcon name="Check" size={16} className="text-green-500 mx-auto" />
                      ) : row[tierName] === '✗' ? (
                        <ApperIcon name="X" size={16} className="text-gray-400 mx-auto" />
                      ) : (
                        <span className="text-gray-700">{row[tierName]}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* FAQ Section */}
      <motion.div
        className="card-premium p-8 space-y-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <h3 className="text-2xl font-display font-bold text-gray-800 text-center">
          Frequently Asked Questions
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              question: 'Can I cancel anytime?',
              answer: 'Yes, you can cancel your subscription at any time. You\'ll continue to have access to premium features until the end of your billing period.'
            },
            {
              question: 'Do you offer refunds?',
              answer: 'We offer a 30-day money-back guarantee for all paid plans. Contact support if you\'re not satisfied.'
            },
            {
              question: 'Can I change plans?',
              answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.'
            },
            {
              question: 'Is my data secure?',
              answer: 'Absolutely. We use industry-standard encryption and security measures to protect your data and payments.'
            }
          ].map((faq, index) => (
            <div key={index} className="space-y-2">
              <h4 className="font-semibold text-gray-800">{faq.question}</h4>
              <p className="text-gray-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {!user && (
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <p className="text-gray-600 mb-4">
            Sign in to unlock premium features and start creating amazing videos
          </p>
          <div className="flex justify-center space-x-4">
            <Button onClick={() => window.location.href = '/login'}>
              Sign In
            </Button>
            <Button onClick={() => window.location.href = '/register'} variant="secondary">
              Create Account
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default VipPage;