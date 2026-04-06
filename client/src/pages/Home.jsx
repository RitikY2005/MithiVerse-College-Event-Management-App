import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import EventCard from '../components/EventCard';
import { FaRocket, FaChartLine, FaUsers, FaBullhorn } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Home = () => {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;
  const { isAuthenticated } = useAuth();
  const [registeringEventId, setRegisteringEventId] = useState(null);

  // Theme colors
  const colors = {
    bgDark: '#121212',
    cardDark: '#1E1E2F',
    cardLight: '#2A2A3D',
    primaryGradient: 'linear-gradient(135deg, #00BFA6, #1DE9B6)',
    secondaryGradient: 'linear-gradient(135deg, #00BFA6, #FF6B6B)',
    textWhite: '#FFFFFF',
    textMuted: '#A0A0A0',
    btnBg: 'linear-gradient(135deg, #00BFA6, #1DE9B6)',
    glassBg: 'linear-gradient(135deg, #1E1E2FCC, #2A2A3D80)',
    btnHover: 'linear-gradient(135deg, #1DE9B6, #FF6B6B)',
  };

  const handleRegister = async (eventId) => {
    try {
      if (!isAuthenticated) {
        toast.error('Please login to register');
        return;
      }

      setRegisteringEventId(eventId);

      const res = await fetch(`${API_URL}/api/events/${eventId}/register`, {
        method: 'POST',
        credentials: 'include',
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Registration failed');

      toast.success('Successfully registered!');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setRegisteringEventId(null);
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/events`);
        const events = response.data.data;

        const now = new Date();
        const next7Days = new Date();
        next7Days.setDate(now.getDate() + 7);

        const upcomingEvents = events
          .filter((event) => {
            const eventDate = new Date(event.date);
            return eventDate >= now && eventDate <= next7Days;
          })
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .slice(0, 3);

        setFeaturedEvents(upcomingEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const features = [
    {
      icon: FaRocket,
      title: 'Easy Event Creation',
      description: 'Create stunning events in minutes with our intuitive interface',
    },
    {
      icon: FaChartLine,
      title: 'Real-time Analytics',
      description: 'Track registrations, engagement, and revenue in real-time',
    },
    {
      icon: FaUsers,
      title: 'Attendee Management',
      description: 'Manage attendees, tickets, and check-ins effortlessly',
    },
    {
      icon: FaBullhorn,
      title: 'Powerful Promotion',
      description: 'Reach your audience with integrated marketing tools',
    },
  ];

  return (
    <div style={{ background: colors.bgDark }}>
      <HeroSection />

      {/* Features Section */}
      <section style={{ padding: '5rem 1rem' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '3rem', fontWeight: '700', color: colors.textWhite, marginBottom: '1rem' }}>Why Choose EventHub?</h2>
            <p style={{ fontSize: '1.25rem', color: colors.textMuted }}>Everything you need to create memorable events</p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            {features.map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -10 }}
                style={{ background: colors.glassBg, borderRadius: '24px', padding: '2rem', textAlign: 'center' }}
              >
                <div style={{ background: colors.primaryGradient, width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                  <feature.icon style={{ color: colors.textWhite, fontSize: '1.5rem' }} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: colors.textWhite, marginBottom: '0.75rem' }}>{feature.title}</h3>
                <p style={{ color: colors.textMuted }}>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section style={{ padding: '5rem 1rem', background: 'rgba(0,0,0,0.1)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '3rem', fontWeight: '700', color: colors.textWhite, marginBottom: '1rem' }}>Upcoming This Week</h2>
            <p style={{ fontSize: '1.25rem', color: colors.textMuted }}>Don’t miss these exciting events</p>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', color: colors.textMuted }}>Loading events...</div>
          ) : featuredEvents.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#888888' }}>No events scheduled for this week.</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
              {featuredEvents.map((event) => (
                <EventCard
                  key={event._id}
                  event={event}
                  onRegister={handleRegister}
                  isRegistering={registeringEventId === event._id}
                />
              ))}
            </div>
          )}

          <div style={{ textAlign: 'center' }}>
            <Link to="/events">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: '0.75rem 2rem',
                  borderRadius: '12px',
                  background: colors.btnBg,
                  color: colors.textWhite,
                  border: 'none',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                View All Events
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '5rem 1rem' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            style={{ background: colors.glassBg, borderRadius: '36px', padding: '3rem' }}
          >
            <h2 style={{ fontSize: '3rem', fontWeight: '700', color: colors.textWhite, marginBottom: '1.5rem' }}>Ready to Create Your Event?</h2>
            <p style={{ fontSize: '1.25rem', color: colors.textMuted, marginBottom: '2rem' }}>Join thousands of organizers who trust EventHub</p>
            <Link to="/create-event">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: '1rem 2rem',
                  borderRadius: '12px',
                  background: colors.btnBg,
                  color: colors.textWhite,
                  border: 'none',
                  fontWeight: 600,
                  fontSize: '1.125rem',
                  cursor: 'pointer',
                }}
              >
                Get Started Now
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;