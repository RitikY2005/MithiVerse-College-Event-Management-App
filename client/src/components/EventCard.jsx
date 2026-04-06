import { motion } from 'framer-motion';
import { FaCalendar, FaMapMarkerAlt, FaUsers, FaTicketAlt } from 'react-icons/fa';
import { format } from 'date-fns';

const EventCard = ({ event, onRegister, isRegistering }) => {
  const isCompleted = event.status === 'completed';
  const isFull = (event.registeredUsers?.length || 0) >= event.capacity;
  const isDisabled = isCompleted || isFull || isRegistering;

  const getButtonText = () => {
    if (isCompleted) return 'Event Completed';
    if (isFull) return 'Event Full';
    if (isRegistering) return 'Registering...';
    return 'Register';
  };

  // Theme colors
  const textWhite = '#FFFFFF';
  const textLight = '#E0E0E0';
  const textMuted = '#A0A0A0';
  const bgCardDark = '#1E1E2F';
  const bgCardLight = '#2A2A3D';
  const primaryGradient = 'linear-gradient(to bottom right, #00BFA6, #1DE9B6)';
  const primaryHoverGradient = 'linear-gradient(to bottom right, #1DE9B6, #00BFA6)';
  const successColor = '#4CAF50';
  const errorColor = '#F44336';
  const disabledColor = '#555555';

  return (
    <motion.div
      whileHover={{ y: -10 }}
      style={{
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: '0 8px 20px rgba(0,0,0,0.5)',
        background: 'linear-gradient(to bottom right, #1E1E2F, #2A2A3D, 0.5)',
        maxWidth:'400px',
        width:'100%',
      }}
    >
      <div style={{ position: 'relative', height: '192px', overflow: 'hidden' }}>
        <img
          src={event.image || 'https://via.placeholder.com/400'}
          alt={event.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />

        {/* Status Badge */}
        <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
          <span
            style={{
              padding: '4px 12px',
              borderRadius: '999px',
              fontSize: '12px',
              fontWeight: 600,
              color: textWhite,
              backgroundColor: isCompleted ? errorColor : successColor,
            }}
          >
            {isCompleted ? 'Completed' : 'Upcoming'}
          </span>
        </div>
      </div>

      <div style={{ padding: '24px' }}>
        {/* Title */}
        <h3 style={{ color: textWhite, fontSize: '24px', fontWeight: '700', marginBottom: '12px' }}>
          {event.title}
        </h3>

        {/* Description */}
        <p style={{ color: textMuted, marginBottom: '16px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {event.description}
        </p>

        {/* Event Details */}
        <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', color: textMuted }}>
            <FaCalendar style={{ marginRight: '8px', color: '#00BFA6' }} />
            <span>{format(new Date(event.date), 'PPP')}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', color: textMuted }}>
            <FaMapMarkerAlt style={{ marginRight: '8px', color: '#00BFA6' }} />
            <span>{event.venue}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', color: textMuted }}>
            <FaUsers style={{ marginRight: '8px', color: '#00BFA6' }} />
            <span>
              {event.registeredUsers?.length || 0} / {event.capacity} Attendees
            </span>
          </div>
        </div>

        {/* Price & Register Button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', color: textWhite }}>
            <FaTicketAlt style={{ marginRight: '8px', color: '#00BFA6' }} />
            <span style={{ fontSize: '20px', fontWeight: '700' }}>
              {event.price === 0 ? 'Free' : `₹${event.price}`}
            </span>
          </div>

          <button
            disabled={isDisabled}
            onClick={() => onRegister(event._id)}
            style={{
              padding: '12px 24px',
              borderRadius: '12px',
              fontWeight: 600,
              color: textWhite,
              cursor: isDisabled ? 'not-allowed' : 'pointer',
              background: isDisabled ? disabledColor : primaryGradient,
              transition: 'all 0.2s',
            }}
          >
            {getButtonText()}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;