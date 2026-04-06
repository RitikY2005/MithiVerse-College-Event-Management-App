import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaUser } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login, isAuthenticated, authLoading } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    try {
      setLoading(true);
      await login(formData.email, formData.password);
      toast.success('Logged in successfully!');
    } catch (error) {
      toast.error('Invalid credentials');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Theme colors
  const colors = {
    bgDark: '#121212',
    bgCard: '#1E1E2F',
    bgGradientCard: 'linear-gradient(135deg, #1E1E2F 0%, #2A2A3D 100%)',
    primaryGradient: 'linear-gradient(135deg, #00BFA6 0%, #1DE9B6 100%)',
    secondaryGradient: 'linear-gradient(135deg, #00BFA6 0%, #FF6B6B 100%)',
    textLight: '#E0E0E0',
    textMuted: '#A0A0A0',
    textWhite: '#FFFFFF',
    borderInput: '#FFFFFF33',
    placeholder: '#A0A0A0',
  };

  return (
    <div
      style={{ minHeight: '100vh', backgroundColor: colors.bgDark }}
      className="pt-20 pb-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative"
    >
      {/* Background overlay image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070)',
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          filter: 'brightness(0.3)',
        }}
      />

      <div className="relative z-10 w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            background: colors.bgGradientCard,
            backdropFilter: 'blur(10px)',
          }}
          className="rounded-3xl p-8 shadow-2xl"
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <div
              style={{ background: colors.primaryGradient }}
              className="inline-block p-3 rounded-full mb-4"
            >
              <FaUser className="text-white text-3xl" />
            </div>
            <h2 style={{ color: colors.textWhite }} className="text-3xl font-bold font-montserrat">
              Welcome Back!
            </h2>
            <p style={{ color: colors.textMuted }} className="mt-2">
              Login to manage your events
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label style={{ color: colors.textWhite }} className="block font-semibold mb-2">
                Email Address
              </label>
              <div className="relative">
                <FaEnvelope
                  className="absolute left-4 top-1/2 transform -translate-y-1/2"
                  style={{ color: colors.textMuted }}
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading || authLoading}
                  placeholder="Enter your email"
                  style={{
                    backgroundColor: '#FFFFFF1A', // white/10
                    color: colors.textWhite,
                    borderColor: colors.borderInput,
                    paddingLeft: '3rem',
                    paddingRight: '1rem',
                  }}
                  className="w-full rounded-lg py-3 focus:outline-none focus:ring-2 disabled:opacity-60"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ color: colors.textWhite }} className="block font-semibold mb-2">
                Password
              </label>
              <div className="relative">
                <FaLock
                  className="absolute left-4 top-1/2 transform -translate-y-1/2"
                  style={{ color: colors.textMuted }}
                />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={loading || authLoading}
                  placeholder="Enter your password"
                  style={{
                    backgroundColor: '#FFFFFF1A', // white/10
                    color: colors.textWhite,
                    borderColor: colors.borderInput,
                    paddingLeft: '3rem',
                    paddingRight: '1rem',
                  }}
                  className="w-full rounded-lg py-3 focus:outline-none focus:ring-2 disabled:opacity-60"
                />
              </div>
            </div>

            {/* Login Button */}
            <motion.button
              whileHover={!loading ? { scale: 1.02 } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
              type="submit"
              disabled={loading || authLoading}
              style={{
                background: colors.primaryGradient,
                color: colors.textWhite,
              }}
              className="w-full text-lg py-3 flex items-center justify-center gap-2 rounded-lg disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {(loading || authLoading) && (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              {loading || authLoading ? 'Logging in...' : 'Login'}
            </motion.button>
          </form>

          {/* Links */}
          <div className="mt-6 text-center">
            <p style={{ color: colors.textMuted }}>
              Don't have an account?{' '}
              <Link
                to="/register"
                style={{ background: 'none', color: '#00BFA6' }}
                className="font-semibold hover:opacity-80"
              >
                Sign up
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center">
            <Link to="/" style={{ color: colors.textMuted }} className="text-sm hover:opacity-80">
              ← Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;