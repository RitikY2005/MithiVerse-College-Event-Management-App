import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  FaEnvelope,
  FaShare,
  FaEye,
  FaUsers,
  FaChartLine
} from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';

const Promotion = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [emailList, setEmailList] = useState('');
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL;
  const BASE_URL =
    import.meta.env.VITE_FRONTEND_URL || window.location.origin;

  // ===== THEME COLORS =====
  const colors = {
    bgDark: '#121212',
    cardGradient: 'linear-gradient(135deg, #1E1E2F 0%, #2A2A3D 100%)',
    glassBg: 'rgba(30,30,47,0.5)',
    primaryGradient: 'linear-gradient(135deg, #00BFA6 0%, #1DE9B6 100%)',
    iconGradient: 'linear-gradient(135deg, #00BFA6 0%, #FF6B6B 100%)',

    textWhite: '#FFFFFF',
    textLight: '#E0E0E0',
    textMuted: '#A0A0A0',

    borderSoft: 'rgba(255,255,255,0.08)',
  };

  // =========================
  // Fetch Events
  // =========================
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/events`);
        const data = response?.data?.data || [];
        setEvents(data);

        if (data.length > 0) {
          setSelectedEvent(data[0]._id);
        }
      } catch (error) {
        toast.error('Failed to load events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const selectedEventData = useMemo(() => {
    return events.find((e) => e._id === selectedEvent);
  }, [selectedEvent, events]);

  const eventLink = selectedEvent
    ? `${BASE_URL}/events/${selectedEvent}`
    : '';

  // =========================
  // Share Logic
  // =========================
  const shareOnSocial = (platform) => {
    if (!selectedEventData) return;

    const encodedUrl = encodeURIComponent(eventLink);
    const encodedText = encodeURIComponent(
      `Join me at ${selectedEventData.title}!`
    );

    let shareUrl = '';

    switch (platform) {
      case 'Facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'Twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;
        break;
      case 'LinkedIn':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case 'Instagram':
        toast('Instagram sharing must be done manually from mobile.');
        return;
      default:
        return;
    }

    window.open(shareUrl, '_blank');
  };

  const copyLink = () => {
    if (!eventLink) return;
    navigator.clipboard.writeText(eventLink);
    toast.success('Event link copied!');
  };

  const sendEmailInvites = (e) => {
    e.preventDefault();

    if (!selectedEventData) {
      toast.error('Please select an event');
      return;
    }

    const emails = emailList
      .split(',')
      .map((email) => email.trim())
      .filter((email) => email.length > 0);

    const invalidEmails = emails.filter(
      (email) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    );

    if (!emails.length) {
      toast.error('Please enter at least one email');
      return;
    }

    if (invalidEmails.length) {
      toast.error('Some email addresses are invalid');
      return;
    }

    toast.success(`Invitations prepared for ${emails.length} recipients!`);
    setEmailList('');
  };

  // =========================
  // Loading States
  // =========================
  if (loading) {
    return (
      <div
        style={{ backgroundColor: colors.bgDark, color: colors.textWhite }}
        className="text-center pt-40 min-h-screen"
      >
        Loading events...
      </div>
    );
  }

  if (!events.length) {
    return (
      <div
        style={{ backgroundColor: colors.bgDark, color: colors.textWhite }}
        className="text-center pt-40 min-h-screen"
      >
        No events available to promote.
      </div>
    );
  }

  return (
    <div
      style={{ backgroundColor: colors.bgDark }}
      className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1
            style={{ color: colors.textWhite }}
            className="text-5xl md:text-6xl font-bold mb-4"
          >
            Promote Your Event
          </h1>
          <p style={{ color: colors.textMuted }} className="text-xl">
            Boost visibility and increase registrations
          </p>
        </motion.div>

        {/* Event Selector */}
        <div
          style={{
            background: colors.cardGradient,
            border: `1px solid ${colors.borderSoft}`
          }}
          className="rounded-2xl p-6 mb-8"
        >
          <label
            style={{ color: colors.textWhite }}
            className="block font-semibold mb-4"
          >
            Select Event
          </label>
          <select
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
            style={{
              backgroundColor: '#1E1E2F',
              color: colors.textWhite,
              border: `1px solid ${colors.borderSoft}`
            }}
            className="w-full rounded-lg px-4 py-3"
          >
            {events.map((event) => (
              <option
                key={event._id}
                value={event._id}
                style={{ backgroundColor: '#1E1E2F' }}
              >
                {event.title}
              </option>
            ))}
          </select>
        </div>

        {/* Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[FaEye, FaUsers, FaChartLine].map((Icon, index) => (
            <div
              key={index}
              style={{
                background: colors.cardGradient,
                border: `1px solid ${colors.borderSoft}`
              }}
              className="rounded-xl p-6 text-center"
            >
              <div
                style={{
                  background: colors.iconGradient,
                  width: 50,
                  height: 50,
                  borderRadius: '50%',
                  margin: '0 auto 12px auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Icon color="#FFFFFF" />
              </div>
              <h3 style={{ color: colors.textWhite }} className="text-xl font-bold">—</h3>
              <p style={{ color: colors.textMuted }} className="text-sm">
                {index === 0 ? 'Event Views' : index === 1 ? 'Registrations' : 'Conversion Rate'}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Social Share */}
          <div
            style={{
              background: colors.cardGradient,
              border: `1px solid ${colors.borderSoft}`
            }}
            className="rounded-2xl p-8"
          >
            <div className="flex items-center mb-6">
              <FaShare color="#1DE9B6" size={22} className="mr-3" />
              <h2 style={{ color: colors.textWhite }} className="text-2xl font-bold">
                Social Media
              </h2>
            </div>

            <div className="space-y-4">
              {['Facebook', 'Twitter', 'LinkedIn', 'Instagram'].map(
                (platform) => (
                  <motion.button
                    key={platform}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => shareOnSocial(platform)}
                    style={{
                      background: colors.primaryGradient,
                      color: '#FFFFFF'
                    }}
                    className="w-full py-4 rounded-lg font-semibold"
                  >
                    Share on {platform}
                  </motion.button>
                )
              )}
            </div>

            {/* Copy Link */}
            <div
              style={{
                backgroundColor: colors.glassBg,
                border: `1px solid ${colors.borderSoft}`
              }}
              className="mt-6 p-4 rounded-lg flex justify-between items-center"
            >
              <span style={{ color: colors.textLight }} className="text-sm truncate mr-4">
                {eventLink}
              </span>
              <button
                onClick={copyLink}
                style={{
                  background: colors.primaryGradient,
                  color: '#FFFFFF'
                }}
                className="px-4 py-2 rounded-lg"
              >
                Copy
              </button>
            </div>
          </div>

          {/* Email Invites */}
          <div
            style={{
              background: colors.cardGradient,
              border: `1px solid ${colors.borderSoft}`
            }}
            className="rounded-2xl p-8"
          >
            <div className="flex items-center mb-6">
              <FaEnvelope color="#1DE9B6" size={22} className="mr-3" />
              <h2 style={{ color: colors.textWhite }} className="text-2xl font-bold">
                Email Invites
              </h2>
            </div>

            <form onSubmit={sendEmailInvites} className="space-y-4">
              <textarea
                value={emailList}
                onChange={(e) => setEmailList(e.target.value)}
                placeholder="Enter comma separated emails"
                rows="6"
                style={{
                  backgroundColor: '#1E1E2F',
                  color: colors.textWhite,
                  border: `1px solid ${colors.borderSoft}`
                }}
                className="w-full rounded-lg px-4 py-3"
              />

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                style={{
                  background: colors.primaryGradient,
                  color: '#FFFFFF'
                }}
                className="w-full rounded-lg px-6 py-3 font-semibold"
              >
                Send Invitations
              </motion.button>
            </form>

            {selectedEventData && (
              <div
                style={{
                  backgroundColor: colors.glassBg,
                  border: `1px solid ${colors.borderSoft}`
                }}
                className="mt-6 p-4 rounded-lg"
              >
                <p style={{ color: colors.textMuted }} className="text-sm mb-2">
                  Email Preview
                </p>
                <p style={{ color: colors.textWhite }} className="font-semibold text-sm">
                  Subject: You're invited to {selectedEventData.title}!
                </p>
                <p style={{ color: colors.textMuted }} className="text-xs mt-2">
                  Includes event details and direct registration link.
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Promotion;