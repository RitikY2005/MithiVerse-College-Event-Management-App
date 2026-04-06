import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaPlay } from 'react-icons/fa';

const HeroSection = () => {
  // Theme Colors
  const bgDark = '#121212';
  const cardDark = '#1E1E2F';
  const cardLight = '#2A2A3D';
  const primaryGradient = 'linear-gradient(135deg, #00BFA6, #1DE9B6)';
  const secondaryGradient = 'linear-gradient(135deg, #1E1E2F, #2A2A3D)';
  const textWhite = '#FFFFFF';
  const textMuted = '#A0A0A0';

  return (
    <div
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
      style={{ background: bgDark }}
    >
      {/* Parallax Background */}
      <div
        className="absolute inset-0 parallax"
        style={{
          backgroundImage:
            'url(https://www.darden.virginia.edu/sites/default/files/styles/full_width_4_3_413px_fallback/public/2019-07/CI-Seminars-Hero.jpg?itok=5DL9v0is)',
          filter: 'brightness(0.25)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Animated Gradient Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${cardDark}CC, ${cardLight}80)`, // glassy gradient overlay with opacity
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center justify-center min-h-[80vh]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center"
        >
          {/* Heading */}
          <h1
            className="text-5xl md:text-7xl font-bold mb-6"
            style={{
              color: textWhite,
              fontFamily: 'Montserrat, sans-serif',
              lineHeight: '1.2',
            }}
          >
            Create{' '}
            <span
              style={{
                background: primaryGradient,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Unforgettable
            </span>
            <br />
            Events That Inspire
          </h1>

          {/* Subheading */}
          <p
            style={{
              color: textMuted,
              fontSize: '1.25rem',
              maxWidth: '48rem',
              marginBottom: '3rem',
              fontFamily: 'Raleway, sans-serif',
            }}
          >
            The ultimate platform for organizing, managing, and promoting events that leave lasting impressions
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
            {/* Primary CTA */}
            <Link to="/create-event">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: primaryGradient,
                  color: textWhite,
                  borderRadius: '12px',
                  padding: '16px 32px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: 'none',
                }}
              >
                <span>Create Event</span>
                <FaArrowRight />
              </motion.button>
            </Link>

            {/* Secondary CTA */}
            <Link to="/events">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: secondaryGradient,
                  color: textWhite,
                  borderRadius: '12px',
                  padding: '16px 32px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: 'none',
                }}
              >
                <FaPlay />
                <span>Explore Events</span>
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
      >
        <div
          style={{
            width: '1.5rem',
            height: '2.5rem',
            border: `2px solid ${textWhite}`,
            borderRadius: '9999px',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: '0.25rem',
              height: '0.75rem',
              background: textWhite,
              borderRadius: '9999px',
              marginTop: '0.5rem',
              animation: 'pulse 1.5s infinite',
            }}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default HeroSection;