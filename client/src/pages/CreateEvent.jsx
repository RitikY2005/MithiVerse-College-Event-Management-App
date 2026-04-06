import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaTicketAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const CreateEvent = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Technical',
    price: '',
    date: '',
    time: '',
    venue: '',
    capacity: '',
    image: '',
  });

  // Theme Colors
  const bgDark = '#121212';
  const cardDark = '#1E1E2F';
  const cardLight = '#2A2A3D';
  const primaryGradient = 'linear-gradient(135deg, #00BFA6, #1DE9B6)';
  const secondaryGradient = 'linear-gradient(135deg, #1E1E2F, #2A2A3D)';
  const textWhite = '#FFFFFF';
  const textMuted = '#A0A0A0';

  if (!user || user.role !== 'admin') {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ color: textWhite }}
      >
        Access Denied
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const selectedDate = new Date(formData.date);
    if (selectedDate < new Date()) {
      toast.error('Cannot create event in the past');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/events`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          date: selectedDate,
          capacity: Number(formData.capacity),
          price: Number(formData.price),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create event');

      toast.success('Event created successfully!');
      navigate('/events');
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div
      className="min-h-screen pt-24 pb-20 px-4"
      style={{
        background: `linear-gradient(135deg, ${bgDark}, ${cardDark})`,
      }}
    >
      <div className="max-w-3xl mx-auto">
        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onSubmit={handleSubmit}
          style={{
            background: `linear-gradient(135deg, ${cardDark}CC, ${cardLight}80)`, // glassy gradient with opacity
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            borderRadius: '24px',
            padding: '32px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
          }}
        >
          {/* Title */}
          <input
            type="text"
            name="title"
            required
            placeholder="Event Title"
            value={formData.title}
            onChange={handleChange}
            style={{
              padding: '12px 16px',
              borderRadius: '12px',
              background: `${cardDark}80`,
              color: textWhite,
              border: 'none',
            }}
          />

          {/* Description */}
          <textarea
            name="description"
            required
            rows="4"
            placeholder="Event Description"
            value={formData.description}
            onChange={handleChange}
            style={{
              padding: '12px 16px',
              borderRadius: '12px',
              background: `${cardDark}80`,
              color: textWhite,
              border: 'none',
            }}
          />

          {/* Category */}
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            style={{
              padding: '12px 16px',
              borderRadius: '12px',
              background: `${cardDark}80`,
              color: textWhite,
              border: 'none',
            }}
          >
            <option value="Technical">Technical</option>
            <option value="Cultural">Cultural</option>
            <option value="Sports">Sports</option>
            <option value="Workshop">Workshop</option>
          </select>

          {/* Price */}
          <div className="flex items-center gap-2">
            <FaTicketAlt style={{ color: primaryGradient }} />
            <input
              type="number"
              name="price"
              required
              min="0"
              placeholder="Price (0 for Free)"
              value={formData.price}
              onChange={handleChange}
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: '12px',
                background: `${cardDark}80`,
                color: textWhite,
                border: 'none',
              }}
            />
          </div>

          {/* Date & Time */}
          <div className="flex gap-2">
  <div style={{flex: 1, position: 'relative'}}>
    <label style={{position: 'absolute', top: '-8px', left: '12px', color: textWhite, fontSize: '12px'}}>Date</label>
    <input
      type="date"
      name="date"
      required
      min={new Date().toISOString().split('T')[0]}
      value={formData.date}
      onChange={handleChange}
      style={{
        width: '100%',
        padding: '12px 16px',
        borderRadius: '12px',
        background: `${cardDark}cc`,
        color: textWhite,
        // border: '2px solid #ffffff33',
      }}
    />
  </div>

  <div style={{flex: 1, position: 'relative'}}>
    <label style={{position: 'absolute', top: '-8px', left: '12px', color: textWhite, fontSize: '12px'}}>Time</label>
    <input
      type="time"
      name="time"
      required
      value={formData.time}
      onChange={handleChange}
      style={{
        width: '100%',
        padding: '12px 16px',
        borderRadius: '12px',
        background: `${cardDark}cc`,
        color: textWhite,
        // border: '2px solid #ffffff33',
      }}
    />
  </div>
</div>

          {/* Venue */}
          <input
            type="text"
            name="venue"
            required
            placeholder="Venue"
            value={formData.venue}
            onChange={handleChange}
            style={{
              padding: '12px 16px',
              borderRadius: '12px',
              background: `${cardDark}80`,
              color: textWhite,
              border: 'none',
            }}
          />

          {/* Capacity */}
          <input
            type="number"
            name="capacity"
            required
            min="1"
            placeholder="Capacity"
            value={formData.capacity}
            onChange={handleChange}
            style={{
              padding: '12px 16px',
              borderRadius: '12px',
              background: `${cardDark}80`,
              color: textWhite,
              border: 'none',
            }}
          />

          {/* Image */}
          <input
            type="url"
            name="image"
            required
            placeholder="Image URL"
            value={formData.image}
            onChange={handleChange}
            style={{
              padding: '12px 16px',
              borderRadius: '12px',
              background: `${cardDark}80`,
              color: textWhite,
              border: 'none',
            }}
          />

          {/* Submit Button */}
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: '16px',
              fontWeight: 600,
              color: textWhite,
              background: primaryGradient,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Create Event
          </button>
        </motion.form>
      </div>
    </div>
  );
};

export default CreateEvent;