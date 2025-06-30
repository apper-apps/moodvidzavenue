import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import adminService from "@/services/api/adminService";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showApiKeys, setShowApiKeys] = useState(false);
  const [apiKeys, setApiKeys] = useState([]);
  const [editingApiKey, setEditingApiKey] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [revealedKeys, setRevealedKeys] = useState(new Set());

useEffect(() => {
    loadDashboardData();
    if (isAdmin) {
      loadApiKeys();
    }
  }, [isAdmin]);

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

  const loadApiKeys = async () => {
    try {
      const keys = await adminService.getApiKeys();
      setApiKeys(keys);
    } catch (err) {
      toast.error('Failed to load API keys');
    }
  };

  const handleSaveApiKey = async (keyData) => {
    try {
      if (editingApiKey) {
        await adminService.updateApiKey(editingApiKey.Id, keyData);
        toast.success('API key updated successfully');
      } else {
        await adminService.createApiKey(keyData);
        toast.success('API key created successfully');
      }
      
      await loadApiKeys();
      setEditingApiKey(null);
      setShowCreateForm(false);
    } catch (err) {
      toast.error(err.message || 'Failed to save API key');
    }
  };

  const handleDeleteApiKey = async (id) => {
    if (!confirm('Are you sure you want to delete this API key?')) return;
    
    try {
      await adminService.deleteApiKey(id);
      toast.success('API key deleted successfully');
      await loadApiKeys();
    } catch (err) {
      toast.error('Failed to delete API key');
    }
  };

  const toggleKeyVisibility = (keyId) => {
    const newRevealed = new Set(revealedKeys);
    if (newRevealed.has(keyId)) {
      newRevealed.delete(keyId);
    } else {
      newRevealed.add(keyId);
    }
    setRevealedKeys(newRevealed);
  };

  const ApiKeyForm = ({ apiKey, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
      name: apiKey?.name || '',
      service: apiKey?.service || '',
      key: apiKey?.key || '',
      description: apiKey?.description || ''
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!formData.name || !formData.service || !formData.key) {
        toast.error('Please fill in all required fields');
        return;
      }
      onSave(formData);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 className="text-lg font-semibold mb-4">
            {apiKey ? 'Edit API Key' : 'Add New API Key'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., OpenAI API"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Service *
              </label>
              <select
                value={formData.service}
                onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Service</option>
                <option value="openai">OpenAI</option>
                <option value="elevenlabs">ElevenLabs</option>
                <option value="assemblyai">AssemblyAI</option>
                <option value="removebg">Remove.bg</option>
                <option value="shotstack">Shotstack</option>
                <option value="stripe">Stripe</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                API Key *
              </label>
              <input
                type="password"
                value={formData.key}
                onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter API key"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Optional description"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button type="button" onClick={onCancel} variant="secondary">
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                {apiKey ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
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
              onClick={() => setShowApiKeys(true)}
              variant="secondary"
              className="w-full justify-start"
            >
              <ApperIcon name="Key" size={16} className="mr-3" />
              API Configuration
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
)) || (
            <p className="text-gray-500 text-sm col-span-3">No subscription data available</p>
          )}
        </div>
      </motion.div>

      {/* API Configuration Section */}
      {showApiKeys && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">API Configuration</h3>
            <div className="flex gap-2">
              <Button
                onClick={() => setShowCreateForm(true)}
                variant="primary"
                size="sm"
              >
                <ApperIcon name="Plus" size={16} className="mr-2" />
                Add API Key
              </Button>
              <Button
                onClick={() => setShowApiKeys(false)}
                variant="secondary"
                size="sm"
              >
                <ApperIcon name="X" size={16} />
              </Button>
            </div>
          </div>
          
          <div className="space-y-3">
            {apiKeys.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <ApperIcon name="Key" size={48} className="mx-auto mb-4 text-gray-300" />
                <p>No API keys configured</p>
                <p className="text-sm">Add your first API key to get started</p>
              </div>
            ) : (
              apiKeys.map((apiKey) => (
                <div key={apiKey.Id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-900">{apiKey.name}</h4>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {apiKey.service}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        apiKey.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {apiKey.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="text-sm font-mono bg-white px-2 py-1 rounded border">
                        {revealedKeys.has(apiKey.Id) 
                          ? apiKey.key 
                          : `${'•'.repeat(Math.min(apiKey.key.length, 20))}...`
                        }
                      </code>
                      <button
                        onClick={() => toggleKeyVisibility(apiKey.Id)}
                        className="p-1 hover:bg-white rounded"
                      >
                        <ApperIcon 
                          name={revealedKeys.has(apiKey.Id) ? "EyeOff" : "Eye"} 
                          size={16} 
                          className="text-gray-500" 
                        />
                      </button>
                    </div>
                    {apiKey.description && (
                      <p className="text-sm text-gray-600 mt-1">{apiKey.description}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Last updated: {new Date(apiKey.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      onClick={() => setEditingApiKey(apiKey)}
                      variant="secondary"
                      size="sm"
                    >
                      <ApperIcon name="Edit" size={16} />
                    </Button>
                    <Button
                      onClick={() => handleDeleteApiKey(apiKey.Id)}
                      variant="secondary"
                      size="sm"
                      className="text-red-600 hover:bg-red-50"
                    >
                      <ApperIcon name="Trash2" size={16} />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      )}

      {/* API Key Form Modal */}
      {(showCreateForm || editingApiKey) && (
        <ApiKeyForm
          apiKey={editingApiKey}
          onSave={handleSaveApiKey}
          onCancel={() => {
            setShowCreateForm(false);
            setEditingApiKey(null);
          }}
        />
      )}
  );
};

export default AdminDashboard;