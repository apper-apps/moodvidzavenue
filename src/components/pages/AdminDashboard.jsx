import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import adminService from '@/services/api/adminService';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check admin access
      const adminCheck = await adminService.checkAdminAccess();
      setIsAdmin(adminCheck.isAdmin);
      
      if (!adminCheck.isAdmin) {
        setError('Access denied. Admin privileges required.');
        return;
      }

      // Load dashboard data
      const data = await adminService.getDashboardData();
      setDashboardData(data);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = async (action) => {
    try {
      switch (action) {
        case 'refresh':
          await loadDashboardData();
          toast.success('Dashboard refreshed');
          break;
        case 'manageUsers':
          navigate('/admin/users');
          break;
        case 'exportData':
          const exportData = await adminService.exportData();
          toast.success('Export started - check downloads');
          break;
        default:
          break;
      }
    } catch (err) {
      toast.error(err.message || 'Action failed');
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;
  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <ApperIcon name="Shield" size={48} className="mx-auto mb-4 text-red-500" />
          <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">You don't have admin privileges</p>
          <Button onClick={() => navigate('/')} variant="primary">
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Monitor and manage your VIP system</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => handleQuickAction('refresh')}
            variant="secondary"
            size="sm"
          >
            <ApperIcon name="RefreshCw" size={16} className="mr-2" />
            Refresh
          </Button>
          <Button
            onClick={() => handleQuickAction('exportData')}
            variant="secondary"
            size="sm"
          >
            <ApperIcon name="Download" size={16} className="mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData?.metrics.totalUsers || 0}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <ApperIcon name="Users" size={24} className="text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <ApperIcon name="TrendingUp" size={16} className="text-green-500 mr-1" />
            <span className="text-sm text-green-600">+{dashboardData?.metrics.newUsersThisMonth || 0} this month</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Subscriptions</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData?.metrics.activeSubscriptions || 0}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <ApperIcon name="Crown" size={24} className="text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <ApperIcon name="TrendingUp" size={16} className="text-green-500 mr-1" />
            <span className="text-sm text-green-600">{dashboardData?.metrics.subscriptionGrowth || 0}% growth</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${dashboardData?.metrics.monthlyRevenue || 0}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <ApperIcon name="DollarSign" size={24} className="text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <ApperIcon name="TrendingUp" size={16} className="text-green-500 mr-1" />
            <span className="text-sm text-green-600">+{dashboardData?.metrics.revenueGrowth || 0}% vs last month</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Videos Created</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData?.metrics.totalVideos || 0}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <ApperIcon name="Video" size={24} className="text-orange-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <ApperIcon name="TrendingUp" size={16} className="text-green-500 mr-1" />
            <span className="text-sm text-green-600">{dashboardData?.metrics.videosThisMonth || 0} this month</span>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
        >
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {dashboardData?.recentActivity?.map((activity, index) => (
              <div key={activity.Id} className="flex items-center space-x-3">
                <div className="p-2 bg-gray-100 rounded-full">
                  <ApperIcon name={activity.icon} size={16} className="text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                  <p className="text-xs text-gray-500">{activity.timestamp}</p>
                </div>
              </div>
            )) || (
              <p className="text-gray-500 text-sm">No recent activity</p>
            )}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
        >
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Button
              onClick={() => handleQuickAction('manageUsers')}
              variant="secondary"
              className="w-full justify-start"
            >
              <ApperIcon name="Users" size={16} className="mr-3" />
              Manage Users
            </Button>
            <Button
              onClick={() => toast.info('Feature coming soon')}
              variant="secondary"
              className="w-full justify-start"
            >
              <ApperIcon name="BarChart3" size={16} className="mr-3" />
              View Analytics
            </Button>
            <Button
              onClick={() => toast.info('Feature coming soon')}
              variant="secondary"
              className="w-full justify-start"
            >
              <ApperIcon name="Settings" size={16} className="mr-3" />
              System Settings
            </Button>
            <Button
              onClick={() => handleQuickAction('exportData')}
              variant="secondary"
              className="w-full justify-start"
            >
              <ApperIcon name="FileText" size={16} className="mr-3" />
              Generate Reports
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Subscription Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
      >
        <h3 className="text-lg font-semibold mb-4">Subscription Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {dashboardData?.subscriptionBreakdown?.map((tier, index) => (
            <div key={tier.name} className="text-center p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900">{tier.name}</h4>
              <p className="text-2xl font-bold text-gray-900 mt-2">{tier.count}</p>
              <p className="text-sm text-gray-600">subscribers</p>
              <div className="mt-2 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${tier.percentage}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">{tier.percentage}%</p>
            </div>
          )) || (
            <p className="text-gray-500 text-sm col-span-3">No subscription data available</p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;