import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FaCalendarAlt,
  FaUsers,
  FaDollarSign,
  FaChartLine,
  FaEdit,
  FaTrash,
  FaChevronDown,
  FaChevronUp,
  FaUserMinus,
} from 'react-icons/fa';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const ManageEvents = () => {
  const { user, isAuthenticated, authLoading } = useAuth();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedEvent, setExpandedEvent] = useState(null);

  // ================= THEME COLORS =================
  const colors = {
    bgDark: '#121212',
    cardGradient: 'linear-gradient(135deg, #1E1E2F 0%, #2A2A3D 100%)',
    textWhite: '#FFFFFF',
    textLight: '#E0E0E0',
    textMuted: '#A0A0A0',
    borderSoft: 'rgba(255,255,255,0.08)',
    borderStrong: 'rgba(255,255,255,0.15)',

    primaryGradient: 'linear-gradient(135deg, #00BFA6 0%, #1DE9B6 100%)',
    primarySoft: 'rgba(0,191,166,0.15)',

    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
  };

  // ================= PROTECT ROUTE =================
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated || user?.role !== 'admin') {
        toast.error('Access denied');
        navigate('/');
      }
    }
  }, [authLoading, isAuthenticated, user, navigate]);

  // ================= FETCH EVENTS =================
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/events`, {
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch events');
      setEvents(data.data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      const res = await fetch(`${API_URL}/api/events/${eventId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Delete failed');
      toast.success('Event deleted successfully');
      fetchEvents();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleRemoveUser = async (eventId, userId) => {
    if (!window.confirm('Remove this participant from event?')) return;
    try {
      const res = await fetch(
        `${API_URL}/api/events/${eventId}/unregister/${userId}`,
        { method: 'DELETE', credentials: 'include' }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to remove user');
      toast.success('Participant removed');
      fetchEvents();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleEdit = (eventId) => {
    navigate(`/edit-event/${eventId}`);
  };

  const totalRevenue = events.reduce(
    (sum, event) =>
      sum +
      (event.price || 0) * (event.registeredUsers?.length || 0),
    0
  );

  const totalRegistrations = events.reduce(
    (sum, event) => sum + (event.registeredUsers?.length || 0),
    0
  );

  const avgAttendance =
    events.length > 0
      ? Math.round(totalRegistrations / events.length)
      : 0;

  if (authLoading) return null;

  return (
    <div
      style={{ backgroundColor: colors.bgDark }}
      className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 style={{ color: colors.textWhite }} className="text-5xl md:text-6xl font-bold mb-4">
            Manage Events
          </h1>
          <p style={{ color: colors.textMuted }} className="text-xl">
            Track and manage all your events
          </p>
        </motion.div>

        {loading && (
          <div style={{ color: colors.textWhite }} className="text-center py-20">
            Loading events...
          </div>
        )}

        {!loading && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              <StatCard icon={FaCalendarAlt} title="Total Events" value={events.length} colors={colors} />
              <StatCard icon={FaUsers} title="Total Registrations" value={totalRegistrations} colors={colors} />
              <StatCard icon={FaDollarSign} title="Total Revenue" value={`₹${totalRevenue.toLocaleString('en-IN')}`} colors={colors} />
              <StatCard icon={FaChartLine} title="Avg. Attendance" value={avgAttendance} colors={colors} />
            </div>

            {/* Events Table */}
            <div
              style={{ background: colors.cardGradient }}
              className="rounded-2xl p-6"
            >
              <h2 style={{ color: colors.textWhite }} className="text-2xl font-bold mb-6">
                All Events
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${colors.borderStrong}` }}>
                      {['Event','Date','Venue','Registrations','Status','Revenue','Actions'].map((h,i)=>(
                        <th key={i} style={{ color: colors.textMuted }} className="py-4 px-4 text-left">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {events.map((event) => (
                      <>
                        <motion.tr
                          key={event._id}
                          whileHover={{ backgroundColor: 'rgba(255,255,255,0.04)' }}
                          style={{ borderBottom: `1px solid ${colors.borderSoft}` }}
                        >
                          <td style={{ color: colors.textWhite }} className="py-4 px-4">
                            <button
                              onClick={() =>
                                setExpandedEvent(
                                  expandedEvent === event._id ? null : event._id
                                )
                              }
                              className="flex items-center space-x-2"
                            >
                              <span>{event.title}</span>
                              {expandedEvent === event._id ? <FaChevronUp size={12}/> : <FaChevronDown size={12}/>}
                            </button>
                          </td>

                          <td style={{ color: colors.textLight }} className="py-4 px-4">
                            {format(new Date(event.date), 'PPP')}
                          </td>

                          <td style={{ color: colors.textLight }} className="py-4 px-4">
                            {event.venue}
                          </td>

                          <td style={{ color: colors.textLight }} className="py-4 px-4">
                            {event.registeredUsers?.length || 0}
                          </td>

                          <td className="py-4 px-4">
                            <span
                              style={{
                                backgroundColor: event.status === 'completed'
                                  ? colors.error
                                  : colors.success,
                                color: '#FFFFFF',
                                padding: '6px 12px',
                                borderRadius: '999px',
                                fontSize: '12px',
                                fontWeight: 600,
                              }}
                            >
                              {event.status === 'completed'
                                ? 'Completed'
                                : 'Upcoming'}
                            </span>
                          </td>

                          <td style={{ color: colors.success, fontWeight: 600 }} className="py-4 px-4">
                            ₹{(
                              (event.price || 0) *
                              (event.registeredUsers?.length || 0)
                            ).toLocaleString('en-IN')}
                          </td>

                          <td className="py-4 px-4">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEdit(event._id)}
                                style={{
                                  backgroundColor: colors.primarySoft,
                                  color: '#00BFA6',
                                  padding: '8px',
                                  borderRadius: '8px',
                                }}
                              >
                                <FaEdit />
                              </button>

                              <button
                                onClick={() => handleDelete(event._id)}
                                style={{
                                  backgroundColor: 'rgba(244,67,54,0.15)',
                                  color: colors.error,
                                  padding: '8px',
                                  borderRadius: '8px',
                                }}
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </motion.tr>

                        <AnimatePresence>
                          {expandedEvent === event._id && (
                            <motion.tr
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                            >
                              <td colSpan="7" style={{ backgroundColor: 'rgba(255,255,255,0.03)' }} className="p-6">
                                <h3 style={{ color: colors.textWhite }} className="font-semibold mb-4">
                                  Participants
                                </h3>

                                {event.registeredUsers?.length === 0 ? (
                                  <p style={{ color: colors.textMuted }}>
                                    No participants yet.
                                  </p>
                                ) : (
                                  <div className="space-y-3">
                                    {event.registeredUsers.map((user) => (
                                      <div
                                        key={user._id}
                                        style={{
                                          backgroundColor: 'rgba(255,255,255,0.06)',
                                          padding: '12px',
                                          borderRadius: '12px',
                                        }}
                                        className="flex justify-between items-center"
                                      >
                                        <div>
                                          <p style={{ color: colors.textWhite, fontWeight: 500 }}>
                                            {user.name}
                                          </p>
                                          <p style={{ color: colors.textMuted, fontSize: '14px' }}>
                                            {user.email}
                                          </p>
                                        </div>

                                        <button
                                          onClick={() =>
                                            handleRemoveUser(event._id, user._id)
                                          }
                                          style={{
                                            backgroundColor: 'rgba(244,67,54,0.15)',
                                            color: colors.error,
                                            padding: '8px 12px',
                                            borderRadius: '8px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                          }}
                                        >
                                          <FaUserMinus />
                                          <span>Remove</span>
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </td>
                            </motion.tr>
                          )}
                        </AnimatePresence>
                      </>
                    ))}
                  </tbody>
                </table>

                {events.length === 0 && (
                  <div style={{ color: colors.textMuted }} className="text-center py-12">
                    No events found
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, title, value, colors }) => (
  <div
    style={{ background: colors.cardGradient }}
    className="rounded-2xl p-6"
  >
    <div className="flex items-center space-x-4">
      <div
        style={{
          background: colors.primaryGradient,
          padding: '12px',
          borderRadius: '12px',
          color: '#FFFFFF',
        }}
      >
        <Icon />
      </div>
      <div>
        <p style={{ color: colors.textMuted }} className="text-sm">
          {title}
        </p>
        <h3 style={{ color: colors.textWhite }} className="text-2xl font-bold">
          {value}
        </h3>
      </div>
    </div>
  </div>
);

export default ManageEvents;