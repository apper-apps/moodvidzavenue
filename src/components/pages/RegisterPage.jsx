import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import authService from '@/services/api/authService';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  
  const password = watch('password');

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await authService.register({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      toast.success('Account created successfully! Welcome to Moodvidz.');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Registration failed. Please try again.');
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
            Join Moodvidz
          </h1>
          <p className="text-gray-600">
            Create your account and start making mood videos
          </p>
        </div>

        {/* Register Form */}
        <motion.div
          className="card-premium p-8 space-y-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <ApperIcon name="User" size={20} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your full name"
                  {...register('name', {
                    required: 'Name is required',
                    minLength: {
                      value: 2,
                      message: 'Name must be at least 2 characters',
                    },
                  })}
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-sm flex items-center">
                  <ApperIcon name="AlertCircle" size={16} className="mr-1" />
                  {errors.name.message}
                </p>
              )}
            </div>

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
                  placeholder="Create a password"
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

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <ApperIcon name="Lock" size={20} className="text-gray-400" />
                </div>
                <input
                  type="password"
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
                    errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Confirm your password"
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (value) =>
                      value === password || 'Passwords do not match',
                  })}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm flex items-center">
                  <ApperIcon name="AlertCircle" size={16} className="mr-1" />
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary/20"
                {...register('terms', {
                  required: 'You must agree to the terms and conditions',
                })}
              />
              <div className="text-sm">
                <label className="text-gray-600">
                  I agree to the{' '}
                  <a href="#" className="text-primary hover:text-primary/80">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-primary hover:text-primary/80">
                    Privacy Policy
                  </a>
                </label>
                {errors.terms && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <ApperIcon name="AlertCircle" size={14} className="mr-1" />
                    {errors.terms.message}
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3"
              icon={loading ? "Loader2" : "UserPlus"}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          {/* Login Link */}
          <div className="text-center pt-4 border-t border-gray-100">
            <p className="text-gray-600 text-sm">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Sign in here
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

export default RegisterPage;