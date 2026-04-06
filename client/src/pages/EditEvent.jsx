import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, authLoading } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL;

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    venue: '',
    capacity: '',
    price: '',
    category: 'Technical',
    image: '',
  });

  // =========================
  // Theme Colors
  // =========================
  const colors = {
    bgDark: '#121212',
    cardDark: '#1E1E2F',
    cardLight: '#2A2A3D',
    primaryGradient: 'linear-gradient(135deg, #00BFA6, #1DE9B6)',
    secondaryGradient: 'linear-gradient(135deg, #1E1E2F, #2A2A3D)',
    textWhite: '#FFFFFF',
    textMuted: '#A0A0A0',
    inputBg: 'rgba(30,30,47,0.5)',
    disabledBtn: '#555555'
  };

  // =========================
  // Protect Route (Admin Only)
  // =========================
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated || user?.role !== 'admin') {
        toast.error('Access denied');
        navigate('/');
      }
    }
  }, [authLoading, isAuthenticated, user, navigate]);

  // =========================
  // Fetch Event By ID
  // =========================
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`${API_URL}/api/events/${id}`, {
          credentials: 'include',
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.error || 'Failed to fetch event');

        const event = data.data;

        setFormData({
          title: event.title || '',
          description: event.description || '',
          date: event.date ? event.date.substring(0, 10) : '',
          venue: event.venue || '',
          capacity: event.capacity || '',
          price: event.price || 0,
          category: event.category || 'Technical',
          image: event.image || '',
        });
      } catch (error) {
        toast.error(error.message);
        navigate('/manage-events');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id, API_URL, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const selectedDate = new Date(formData.date);

    if (selectedDate < new Date()) {
      toast.error('Cannot set event date in the past');
      return;
    }

    try {
      setUpdating(true);
      const res = await fetch(`${API_URL}/api/events/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          capacity: Number(formData.capacity),
          price: Number(formData.price),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Update failed');

      toast.success('Event updated successfully');
      navigate('/manage-events');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUpdating(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ color: colors.textWhite, background: colors.bgDark }}
      >
        Loading...
      </div>
    );
  }

  return (
    <div
      className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8"
      style={{ background: colors.bgDark }}
    >
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <h1 style={{ color: colors.textWhite, fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            Edit Event
          </h1>
          <p style={{ color: colors.textMuted }}>Update event details below</p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            background: `linear-gradient(135deg, ${colors.cardDark}CC, ${colors.cardLight}80)`,
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            borderRadius: '24px',
            padding: '32px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
          }}
        >
          <InputField label="Event Title" name="title" value={formData.title} onChange={handleChange} colors={colors} />
          
          <div>
            <label style={{ color: colors.textMuted, marginBottom: '0.5rem', display: 'block' }}>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              required
              style={{
                width: '100%',
                background: colors.inputBg,
                color: colors.textWhite,
                padding: '12px 16px',
                borderRadius: '12px',
                border: 'none',
                outline: 'none',
              }}
            />
          </div>

          <InputField label="Date" type="date" name="date" value={formData.date} onChange={handleChange} colors={colors} />
          <InputField label="Venue" name="venue" value={formData.venue} onChange={handleChange} colors={colors} />
          <InputField label="Capacity" type="number" name="capacity" value={formData.capacity} onChange={handleChange} colors={colors} />
          <InputField label="Price (₹)" type="number" name="price" value={formData.price} onChange={handleChange} colors={colors} />

          <div>
            <label style={{ color: colors.textMuted, marginBottom: '0.5rem', display: 'block' }}>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              style={{
                width: '100%',
                background: colors.inputBg,
                color: colors.textWhite,
                padding: '12px 16px',
                borderRadius: '12px',
                border: 'none',
                outline: 'none',
              }}
            >
              <option>Technical</option>
              <option>Cultural</option>
              <option>Sports</option>
              <option>Workshop</option>
            </select>
          </div>

          <InputField label="Image URL" name="image" value={formData.image} onChange={handleChange} colors={colors} />

          <button
            type="submit"
            disabled={updating}
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: '16px',
              fontWeight: 600,
              color: colors.textWhite,
              background: updating ? colors.disabledBtn : colors.primaryGradient,
              border: 'none',
              cursor: updating ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s',
            }}
          >
            {updating ? 'Updating...' : 'Update Event'}
          </button>
        </motion.form>
      </div>
    </div>
  );
};

// Reusable Input Component
const InputField = ({ label, type = 'text', name, value, onChange, colors }) => (
  <div>
    <label style={{ color: colors.textMuted, marginBottom: '0.5rem', display: 'block' }}>{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required
      style={{
        width: '100%',
        background: colors.inputBg,
        color: colors.textWhite,
        padding: '12px 16px',
        borderRadius: '12px',
        border: 'none',
        outline: 'none',
      }}
    />
  </div>
);

export default EditEvent;