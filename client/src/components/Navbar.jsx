import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBars, FaTimes, FaCalendarAlt, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const textWhite = '#FFFFFF';
  const textLight = '#E0E0E0';
  const bgDark = '#121212';
  const bgGlass = 'linear-gradient(to bottom right, #1E1E2F, #2A2A3D, 0.5)';
  const primaryGradient = 'linear-gradient(to bottom right, #00BFA6, #1DE9B6)';
  const primaryGradientHover = 'linear-gradient(to bottom right, #1DE9B6, #FF6B6B)';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isAdmin = user?.role === 'admin';

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Events', path: '/events' },
    ...(isAdmin ? [
      { name: 'Create Event', path: '/create-event' },
      { name: 'Manage Events', path: '/manage-events' },
    ] : []),
    ...(!isAdmin && isAuthenticated ? [{ name: 'Your Registrations', path: '/my-registrations' }] : []),
    { name: 'Promotion', path: '/promotion' },
    { name: 'Contact', path: '/contact' },
  ];

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully!');
    navigate('/');
    setShowProfileMenu(false);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      style={{
        position: 'fixed',
        width: '100%',
        zIndex: 50,
        transition: 'all 0.3s',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',           // frosted glass effect
    WebkitBackdropFilter: scrolled ? 'blur(10px)' : 'none',
        background: scrolled ? bgGlass : 'transparent',
        boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.5)' : 'none',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '80px' }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
          <div style={{ background: primaryGradient, padding: '8px', borderRadius: '12px', transition: 'transform 0.3s' }}>
            <FaCalendarAlt style={{ color: textWhite, fontSize: '24px' }} />
          </div>
          <span style={{ fontSize: '24px', fontWeight: '700', color: textWhite, fontFamily: 'Montserrat' }}>
            Mithi<span style={{ background: primaryGradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Verse</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div style={{gap: '4px', alignItems: 'center' }} className="hidden md:flex">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              style={{
                padding: '8px 16px',
                borderRadius: '12px',
                fontWeight: 500,
                textDecoration: 'none',
                color: location.pathname === link.path ? textWhite : 'rgba(224,224,224,0.5)',
                background: location.pathname === link.path ? primaryGradient : 'transparent',
                transition: 'all 0.3s'
              }}
            >
              {link.name}
            </Link>
          ))}

          {isAuthenticated ? (
            <div style={{ position: 'relative', marginLeft: '16px' }}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: '12px',
                  background: primaryGradient,
                  color: textWhite,
                  cursor: 'pointer',
                  transition: 'transform 0.2s'
                }}
              >
                <FaUser />
                <span>{user?.name || 'User'}</span>
              </button>

              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    position: 'absolute',
                    right: 0,
                    marginTop: '8px',
                    width: '192px',
                    background: bgGlass,
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.5)',
                  }}
                >
                  <button
                    onClick={handleLogout}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '12px 16px',
                      background: 'transparent',
                      color: textWhite,
                      cursor: 'pointer',
                      border: 'none'
                    }}
                  >
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </button>
                </motion.div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              style={{
                marginLeft: '16px',
                padding: '8px 16px',
                borderRadius: '12px',
                fontWeight: 500,
                textDecoration: 'none',
                color: location.pathname === '/login' ? textWhite : textLight,
                background: location.pathname === '/login' ? primaryGradient : 'transparent',
                transition: 'all 0.3s'
              }}
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{ fontSize: '24px', color: textWhite, background: 'transparent', border: 'none', cursor: 'pointer' }}
          className="md:hidden"
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          style={{
            background: 'rgba(30,30,47,0.85)',      // darker + more visible
            backdropFilter: 'blur(12px)',           // stronger blur for frosted glass
            WebkitBackdropFilter: 'blur(12px)',
            padding: '16px',
            flexDirection: 'column',
            gap: '8px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)', // subtle shadow for separation
            borderRadius: '16px',
          }}
          className='flex md:hidden'
        >
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              style={{
                padding: '12px 16px',
                borderRadius: '12px',
                fontWeight: 500,
                textDecoration: 'none',
                color: location.pathname === link.path ? textWhite : 'rgba(224,224,224,0.5)',
                background: location.pathname === link.path ? primaryGradient : 'transparent',
                transition: 'all 0.3s'
              }}
            >
              {link.name}
            </Link>
          ))}

          {isAuthenticated ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', color: textWhite, fontWeight: 600 }}>
                <FaUser />
                <span>{user?.name || 'User'}</span>
              </div>
              <button
                onClick={() => { handleLogout(); setIsOpen(false); }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  color: textWhite,
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              style={{
                padding: '12px 16px',
                borderRadius: '12px',
                fontWeight: 500,
                textDecoration: 'none',
                color: location.pathname === '/login' ? textWhite : textLight,
                background: location.pathname === '/login' ? primaryGradient : 'transparent',
                transition: 'all 0.3s'
              }}
            >
              Login
            </Link>
          )}
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;