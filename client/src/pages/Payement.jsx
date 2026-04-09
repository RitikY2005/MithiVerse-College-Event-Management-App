import { useEffect } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderDetails } = location.state || {};
  const API_URL = import.meta.env.VITE_API_URL;

 

  // ✅ Register user after successful payment
  const registerUser = async (eventId) => {
    try {
      const res = await fetch(`${API_URL}/api/events/${eventId}/register`, {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Registration failed");
        return false;
      }

      return true;
    } catch (err) {
      toast.error("Registration error");
      return false;
    }
  };

  useEffect(() => {
    const startPayment = async () => {
      if (!orderDetails) {
        navigate("/events");
        return;
      }

     

      const options = {
        key: orderDetails.key,
        amount: orderDetails.amount,
        currency: "INR",
        name: "MithiVerse - Event Registration",
        description: "Secure Payment",
        image: "https://cdn-icons-png.flaticon.com/512/10691/10691802.png",
        order_id: orderDetails.orderId,

        handler: async (response) => {
          try {
            const verifyRes = await fetch(
              `${API_URL}/api/payments/verify-payment`,
              {
                method: "POST",
                credentials: "include",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                  userId: orderDetails.user._id,
                  eventId: orderDetails.eventId,
                }),
              }
            );

            const data = await verifyRes.json();

            if (!data.success) {
              navigate("/register-fail");
              return;
            }

            const registered = await registerUser(orderDetails.eventId);

            if (registered) {
              toast.success("Payment successful!");
              document.body.style.overflow = "auto"; // Re-enable scrolling
              navigate("/register-success");
             
            }
          } catch (err) {
            toast.error("Payment verification failed");
            navigate("/register-fail");
          }
        },

        modal: {
          ondismiss: () => {
            toast.error("Payment cancelled");
            navigate("/events");
          },
        },

        prefill: {
          name: orderDetails.user.name,
          email: orderDetails.user.email,
        },

        notes: {
          address: "Mithibai College Campus, Mumbai",
        },

        theme: {
          color: "#1DE9B6",
        },
      };

      const rzp = new Razorpay(options);

      rzp.on("payment.failed", () => {
        toast.error("Payment failed");
        navigate("/register-fail");
      });

      try {
        rzp.open();
      } catch (err) {
        toast.error("Error opening payment gateway");
        navigate("/events");
      }
    };

    startPayment();
  }, [orderDetails, navigate]);

  // ✅ Fallback UI
  if (!orderDetails) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center text-white gap-4">
        <p className="text-xl">Payment session not found</p>
        <button
          onClick={() => navigate("/events")}
          className="px-6 py-2 bg-[#00BFA6] rounded"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex items-center justify-center text-white">
      <div className="text-center">
        <p className="text-lg font-medium">Initializing secure payment...</p>
        <p className="text-sm text-gray-400 mt-2">
          Please do not refresh or close this page
        </p>
      </div>
    </div>
  );
};

export default PaymentPage;