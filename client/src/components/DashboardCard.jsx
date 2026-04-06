import { motion } from 'framer-motion';

const DashboardCard = ({ icon: Icon, title, value, color, trend }) => {
  // Hardcoded theme colors
  const textWhite = '#FFFFFF';
  const textLight = '#E0E0E0';
  const textMuted = '#A0A0A0';
  const bgCardDark = '#1E1E2F';
  const bgCardLight = '#2A2A3D';
  const bgGlass = 'linear-gradient(to bottom right, #1E1E2F, #2A2A3D, 0.5)';
  const primaryGradient = 'linear-gradient(to bottom right, #00BFA6, #FF6B6B)';
  const secondaryGradient = 'linear-gradient(to bottom right, #333333, #444444)';
  const successColor = '#4CAF50';
  const errorColor = '#F44336';

  // Determine icon gradient
  let iconGradient = primaryGradient;
  if (color === 'secondary') iconGradient = secondaryGradient;

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      style={{
        borderRadius: '24px',
        padding: '24px',
        background: bgGlass,
        boxShadow: '0 8px 20px rgba(0,0,0,0.5)',
      }}
      data-aos="zoom-in"
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          {/* Title */}
          <p style={{ color: textMuted, fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>
            {title}
          </p>

          {/* Value */}
          <h3 style={{ color: textWhite, fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>
            {value}
          </h3>

          {/* Trend */}
          {trend !== undefined && (
            <p style={{ color: trend > 0 ? successColor : errorColor, fontSize: '14px' }}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% from last month
            </p>
          )}
        </div>

        {/* Icon with gradient background */}
        <div
          style={{
            padding: '16px',
            borderRadius: '50%',
            background: iconGradient,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon style={{ color: textWhite, fontSize: '24px' }} />
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardCard;