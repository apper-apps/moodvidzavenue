import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import authService from '@/services/api/authService';

const LoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await authService.login(data.email, data.password);
      toast.success('Welcome back! Login successful.');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-white to-secondary/5 px-4">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <motion.div
            className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <ApperIcon name="Video" size={32} className="text-white" />
          </motion.div>
          <h1 className="text-3xl font-display font-bold gradient-text mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">
            Sign in to create amazing mood videos
          </p>
        </div>

        {/* Login Form */}
        <motion.div
          className="card-premium p-8 space-y-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <ApperIcon name="Mail" size={20} className="text-gray-400" />
                </div>
                <input
                  type="email"
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: 'Please enter a valid email address',
                    },
                  })}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm flex items-center">
                  <ApperIcon name="AlertCircle" size={16} className="mr-1" />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <ApperIcon name="Lock" size={20} className="text-gray-400" />
                </div>
                <input
                  type="password"
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm flex items-center">
                  <ApperIcon name="AlertCircle" size={16} className="mr-1" />
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Demo Credentials */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <ApperIcon name="Info" size={16} className="text-blue-500 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-blue-800">Demo Credentials:</p>
                  <p className="text-blue-600">Email: demo@example.com</p>
                  <p className="text-blue-600">Password: password123</p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3"
              icon={loading ? "Loader2" : "LogIn"}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          {/* Register Link */}
          <div className="text-center pt-4 border-t border-gray-100">
            <p className="text-gray-600 text-sm">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Create one now
              </Link>
            </p>
          </div>
        </motion.div>

        {/* Back to Home */}
        <motion.div
          className="text-center mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Link
            to="/"
            className="text-gray-500 hover:text-gray-700 text-sm flex items-center justify-center space-x-1 transition-colors"
          >
            <ApperIcon name="ArrowLeft" size={16} />
            <span>Back to Home</span>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;