import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaUser } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user'
  });

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();

  // ===== THEME COLORS =====
  const colors = {
    bgDark: '#121212',
    cardGradient: 'linear-gradient(135deg, #1E1E2F 0%, #2A2A3D 100%)',
    glassOverlay: 'rgba(30,30,47,0.5)',
    primaryGradient: 'linear-gradient(135deg, #00BFA6 0%, #1DE9B6 100%)',

    textWhite: '#FFFFFF',
    textLight: '#E0E0E0',
    textMuted: '#A0A0A0',

    inputBg: '#1E1E2F',
    borderSoft: 'rgba(255,255,255,0.08)',
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    try {
      setLoading(true);

      await register(
        formData.name,
        formData.email,
        formData.password,
        formData.role
      );

      toast.success('Account created successfully!');
      navigate('/');
    } catch (error) {
      toast.error('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div
      style={{ backgroundColor: colors.bgDark }}
      className="min-h-screen pt-20 pb-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center"
    >
      {/* Background Overlay */}
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
            background: colors.cardGradient,
            border: `1px solid ${colors.borderSoft}`
          }}
          className="rounded-3xl p-8 shadow-2xl"
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <div
              style={{
                background: colors.primaryGradient,
              }}
              className="inline-block p-3 rounded-full mb-4"
            >
              <FaUser style={{ color: '#FFFFFF', fontSize: 28 }} />
            </div>
            <h2
              style={{ color: colors.textWhite }}
              className="text-3xl font-bold"
            >
              Join MithiVerse
            </h2>
            <p style={{ color: colors.textMuted }} className="mt-2">
              Create an account to get started
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {['name', 'email', 'password', 'confirmPassword'].map((field, index) => {
              const labels = {
                name: 'Full Name',
                email: 'Email Address',
                password: 'Password',
                confirmPassword: 'Confirm Password'
              };

              const types = {
                name: 'text',
                email: 'email',
                password: 'password',
                confirmPassword: 'password'
              };

              const icons = {
                name: <FaUser />,
                email: <FaEnvelope />,
                password: <FaLock />,
                confirmPassword: <FaLock />
              };

              return (
                <div key={index}>
                  <label
                    style={{ color: colors.textWhite }}
                    className="block font-semibold mb-2"
                  >
                    {labels[field]}
                  </label>
                  <div className="relative">
                    <div
                      className="absolute left-4 top-1/2 transform -translate-y-1/2"
                      style={{ color: colors.textMuted }}
                    >
                      {icons[field]}
                    </div>
                    <input
                      type={types[field]}
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      placeholder={`Enter your ${labels[field].toLowerCase()}`}
                      style={{
                        backgroundColor: colors.inputBg,
                        color: colors.textWhite,
                        border: `1px solid ${colors.borderSoft}`
                      }}
                      className="w-full rounded-lg pl-12 pr-4 py-3 focus:outline-none disabled:opacity-60"
                    />
                  </div>
                </div>
              );
            })}

            <motion.button
              whileHover={!loading ? { scale: 1.05 } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
              type="submit"
              disabled={loading}
              style={{
                background: colors.primaryGradient,
                color: '#FFFFFF'
              }}
              className="w-full text-lg py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading && (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              {loading ? 'Creating Account...' : 'Create Account'}
            </motion.button>
          </form>

          {/* Toggle Login */}
          <div className="mt-6 text-center">
            <p style={{ color: colors.textMuted }}>
              Already have an account?{' '}
              <Link
                to="/login"
                style={{ color: '#1DE9B6' }}
                className="font-semibold"
              >
                Login
              </Link>
            </p>
          </div>

          {/* Back to Home */}
          <div className="mt-4 text-center">
            <Link
              to="/"
              style={{ color: colors.textMuted }}
              className="text-sm"
            >
              ← Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;