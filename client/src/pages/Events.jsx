import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import EventCard from '../components/EventCard';
import { FaSearch, FaFilter } from 'react-icons/fa';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(false);
  const [registeringEventId, setRegisteringEventId] = useState(null);
  const { isAuthenticated } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL;

  const colors = {
    bgDark: '#121212',
    cardDark: '#1E1E2F',
    cardLight: '#2A2A3D',
    primaryGradient: 'linear-gradient(135deg, #00BFA6, #1DE9B6)',
    textWhite: '#FFFFFF',
    textMuted: '#A0A0A0',
    inputBg: 'rgba(30,30,47,0.5)',
    selectedCategoryBg: 'linear-gradient(135deg, #00BFA6, #1DE9B6)',
    unselectedCategoryBg: 'rgba(255,255,255,0.1)',
  };

  // Fetch Events
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_URL}/api/events?search=${searchTerm}`);
      setEvents(data.data);
    } catch (error) {
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [searchTerm]);

  const filteredEvents =
    selectedCategory === 'All'
      ? events
      : events.filter((event) => event.category === selectedCategory);

  const handleRegister = async (eventId) => {
    try {
      if (!isAuthenticated) {
        toast.error('Please login to register');
        return;
      }

      const selectedEvent = events.find((e) => e._id === eventId);

      if (selectedEvent?.status === 'completed') {
        toast.error('Registration closed. Event completed.');
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
      await fetchEvents();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setRegisteringEventId(null);
    }
  };

  return (
    <div style={{ minHeight: '100vh', paddingTop: '6rem', paddingBottom: '5rem', paddingLeft: '1rem', paddingRight: '1rem', background: colors.bgDark }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: '700', color: colors.textWhite, marginBottom: '1rem' }}>Discover Events</h1>
          <p style={{ fontSize: '1.25rem', color: colors.textMuted }}>Find and join amazing events happening around you</p>
        </motion.div>

        {/* Search */}
        <div style={{ marginBottom: '2rem', background: `linear-gradient(135deg, ${colors.cardDark}CC, ${colors.cardLight}80)`, backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', borderRadius: '24px', padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <FaSearch style={{ color: colors.textMuted, fontSize: '1.25rem' }} />
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ flex: 1, background: 'transparent', color: colors.textWhite, border: 'none', outline: 'none', fontSize: '1rem' }}
          />
        </div>

        {/* Category Filter */}
        <div style={{ marginBottom: '2rem', background: `linear-gradient(135deg, ${colors.cardDark}CC, ${colors.cardLight}80)`, backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', borderRadius: '24px', padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
            <FaFilter style={{ color: colors.primaryGradient, fontSize: '1.25rem' }} />
            <h3 style={{ color: colors.textWhite, fontWeight: 600 }}>Filter by Category</h3>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            {['All', 'Technical', 'Cultural', 'Sports', 'Workshop'].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '9999px',
                  color: colors.textWhite,
                  background: selectedCategory === category ? colors.selectedCategoryBg : colors.unselectedCategoryBg,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <p style={{ color: colors.textMuted, marginBottom: '1.5rem' }}>
          Found <span style={{ color: colors.primaryGradient, fontWeight: 700 }}>{filteredEvents.length}</span> events
        </p>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', color: colors.textWhite, padding: '5rem 0' }}>Loading events...</div>
        )}

       {/* Events Grid */}
{!loading && filteredEvents.length > 0 && (
  <div
    style={{
      display: 'flex',
      flexWrap: 'wrap',           // allow cards to wrap to next row
      gap: '2rem',                // spacing between cards
      justifyContent: 'start',   // center cards when there are few
      margin: '0 auto',           // center container
    }}
  >
    {filteredEvents.map((event) => (
      <div
        key={event._id}
        style={{
          flex: '1 1 300px',      // flex-grow:1, flex-shrink:1, base width:300px
          maxWidth: '400px',      // prevent card from growing too much
          minWidth: '300px',      // optional: prevent card from shrinking too small
        }}
      >
        <EventCard
          event={event}
          onRegister={handleRegister}
          isRegistering={registeringEventId === event._id}
        />
      </div>
    ))}
  </div>
)}

        {/* No Events */}
        {!loading && filteredEvents.length === 0 && (
          <div style={{ textAlign: 'center', color: colors.textMuted, padding: '5rem 0' }}>No events found</div>
        )}
      </div>
    </div>
  );
};

export default Events;