import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const MyRegistrations = () => {
  const { isAuthenticated, authLoading } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL;

  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  // ===== THEME COLORS =====
  const colors = {
    bgDark: "#121212",
    cardGradient: "linear-gradient(135deg, #1E1E2F 0%, #2A2A3D 100%)",
    textWhite: "#FFFFFF",
    textLight: "#E0E0E0",
    textMuted: "#A0A0A0",

    primaryGradient: "linear-gradient(135deg, #00BFA6 0%, #1DE9B6 100%)",

    info: "#2196F3",
    success: "#4CAF50",
    warning: "#FF9800",
    error: "#F44336",
  };

  // =========================
  // Fetch User Registrations
  // =========================
  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const res = await fetch(`${API_URL}/api/events/my-registrations`, {
          credentials: "include",
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch registrations");
        }

        setRegistrations(data.data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && isAuthenticated) {
      fetchRegistrations();
    }
  }, [API_URL, isAuthenticated, authLoading]);

  // =========================
  // Cancel Registration
  // =========================
  const handleCancel = async (id) => {
    try {
      setCancellingId(id);

      const res = await fetch(`${API_URL}/api/events/${id}/unregister`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Cancellation failed");
      }

      setRegistrations((prev) =>
        prev.filter((reg) => reg._id !== id)
      );

      toast.success("Registration cancelled");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setCancellingId(null);
    }
  };

  if (authLoading || loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: colors.bgDark,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: colors.textWhite,
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <div
      style={{ backgroundColor: colors.bgDark }}
      className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1
            style={{ color: colors.textWhite }}
            className="text-5xl font-bold mb-4"
          >
            My Registrations
          </h1>
          <p style={{ color: colors.textMuted }}>
            View and manage your event registrations
          </p>
        </motion.div>

        {registrations.length === 0 ? (
          <div
            style={{
              background: colors.cardGradient,
              color: colors.textLight,
            }}
            className="rounded-2xl p-10 text-center"
          >
            You haven’t registered for any events yet.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {registrations.map((registration) => {
              const event = registration;

              return (
                <motion.div
                  key={registration._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{
                    background: colors.cardGradient,
                  }}
                  className="rounded-2xl overflow-hidden"
                >
                  {/* Event Image */}
                  <img
                    src={event.image}
                    alt={event.title}
                    className="h-48 w-full object-cover"
                  />

                  <div className="p-6 space-y-3">
                    <h2
                      style={{ color: colors.textWhite }}
                      className="text-xl font-semibold"
                    >
                      {event.title}
                    </h2>

                    <p style={{ color: colors.textLight }} className="text-sm">
                      📍 {event.venue}
                    </p>

                    <p style={{ color: colors.textLight }} className="text-sm">
                      📅 {new Date(event.date).toLocaleDateString()}
                    </p>

                    {/* Status */}
                    <div className="flex justify-between text-sm">
                      <span style={{ color: colors.textMuted }}>
                        Status:
                      </span>
                      <span
                        style={{
                          color:
                            registration.status === "completed"
                              ? colors.error
                              : colors.success,
                          fontWeight: 500,
                        }}
                      >
                        {registration.status === "completed"
                          ? "Completed"
                          : "Upcoming"}
                      </span>
                    </div>

                    {/* Payment */}
                    <div className="flex justify-between text-sm">
                      <span style={{ color: colors.textMuted }}>
                        Payment:
                      </span>
                      <span
                        style={{
                          color:
                            registration.paymentStatus === "paid"
                              ? colors.success
                              : colors.warning,
                          fontWeight: 500,
                        }}
                      >
                        {registration.paymentStatus}
                      </span>
                    </div>

                    {/* Cancel Button */}
                    <button
                      onClick={() => handleCancel(registration._id)}
                      disabled={cancellingId === registration._id}
                      style={{
                        width: "100%",
                        marginTop: "16px",
                        padding: "10px",
                        borderRadius: "8px",
                        fontWeight: 500,
                        border: "none",
                        cursor:
                          cancellingId === registration._id
                            ? "not-allowed"
                            : "pointer",
                        background:
                          cancellingId === registration._id
                            ? "rgba(160,160,160,0.4)"
                            : colors.error,
                        color: "#FFFFFF",
                        transition: "0.3s ease",
                      }}
                    >
                      {cancellingId === registration._id
                        ? "Cancelling..."
                        : "Cancel Registration"}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRegistrations;