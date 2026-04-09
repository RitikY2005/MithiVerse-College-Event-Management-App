import { useEffect, useState } from "react";
import { FaCalendar, FaClock, FaMapMarkerAlt, FaUsers } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { format, set } from 'date-fns';
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const EventDetails = () => {

    const location = useLocation();
    const navigator = useNavigate();
    const event = location.state?.event;
    const { isAuthenticated, user } = useAuth();
    const API_URL = import.meta.env.VITE_API_URL;
    const [isRegistering, setIsRegistering] = useState(false);


    if (!event) {
        return <div className="w-full h-full flex justify-center item-center p-48">
            <h4 className="text-2xl font-bold text-white">No event data available</h4>
            <button className="ml-4 px-4 py-2 bg-gradient-to-br from-[#00BFA6] to-[#1DE9B6] text-white font-bold rounded" onClick={() => navigator('/')}>Go Home</button>
        </div>
    }

    const handleRegister = async () => {
        setIsRegistering(true);
        try {
            if (!isAuthenticated) {
                toast.error('Please login to register');
                setIsRegistering(false);
                return;
            }

            if (event?.status === 'completed') {
                toast.error('Registration closed. Event completed.');
                setIsRegistering(false);
                return;
            }

            // if the event is free, register directly without payment

            if (event.price <= 0) {
                const res = await fetch(`${API_URL}/api/events/${event._id}/register`, {
                    method: 'POST',
                    credentials: 'include',
                });

                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Registration failed');

                toast.success('Successfully registered!');
                navigator('/register-success');
                setIsRegistering(false);
                return;
            }

            // For paid events , redirect to payment page with event details 

            const payload = {
                userId: user._id,
                eventId: event._id,
                amount: event.price
            };

            try {
                const res = await fetch(`${API_URL}/api/payments/create-order`, {
                    method: 'POST',
                    credentials: 'include',
                    body: JSON.stringify(payload),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                const data = await res.json();
                if (!data.success) {
                    toast.error(data.message || 'Payment initiation failed');
                    setIsRegistering(false);
                    return;
                }


                const orderDetails = {
                    orderId: data.orderId,
                    amount: data.amount,
                    key: data.key,
                    eventId: event._id,
                    user: user
                }

                // redirect to payment page with order details 
                navigator('/payment', { state: { orderDetails: orderDetails } });

                setIsRegistering(false);
            } catch (err) {
                toast.error('Payment initiation failed. Please try again.');
                setIsRegistering(false);
                return;
            }






        } catch (error) {
            setIsRegistering(false);
            toast.error(error.message);
        }
    };


   


    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-[#0f172a] to-[#020617] pt-28 pb-20 px-4 flex justify-center">

            <div className="w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl bg-white/5 backdrop-blur-lg border border-white/10">

                {/* HERO IMAGE */}
                <div className="relative h-72 w-full">
                    <img
                        src={event.image}
                        alt="event"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 flex flex-col justify-end p-6">
                        <h1 className="text-4xl font-bold text-white">{event.title}</h1>

                        <div className="flex gap-3 mt-3">
                            <span className="px-3 py-1 text-sm bg-[#00BFA6]/20 text-[#1DE9B6] rounded-full">
                                {event.category}
                            </span>

                            <span className={`px-3 py-1 text-sm rounded-full ${event.status === 'completed'
                                    ? 'bg-red-500/20 text-red-400'
                                    : 'bg-green-500/20 text-green-400'
                                }`}>
                                {event.status}
                            </span>
                        </div>
                    </div>
                </div>

                {/* CONTENT */}
                <div className="p-8 flex flex-col gap-8">

                    {/* DESCRIPTION */}
                    <div>
                        <h2 className="text-xl font-semibold text-white mb-2">About Event</h2>
                        <p className="text-gray-300 leading-relaxed">
                            {event.description}
                        </p>
                    </div>

                    {/* EVENT INFO GRID */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                        <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
                            <FaCalendar className="text-[#00BFA6] text-xl" />
                            <div>
                                <p className="text-sm text-gray-400">Date</p>
                                <p className="text-white font-medium">
                                    {format(new Date(event.date), 'PPP')}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
                            <FaClock className="text-[#00BFA6] text-xl" />
                            <div>
                                <p className="text-sm text-gray-400">Time</p>
                                <p className="text-white font-medium">{event.time}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
                            <FaMapMarkerAlt className="text-[#00BFA6] text-xl" />
                            <div>
                                <p className="text-sm text-gray-400">Venue</p>
                                <p className="text-white font-medium">{event.venue}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
                            <FaUsers className="text-[#00BFA6] text-xl" />
                            <div>
                                <p className="text-sm text-gray-400">Attendees</p>
                                <p className="text-white font-medium">
                                    {event.registeredUsers?.length || 0} / {event.capacity}
                                </p>
                            </div>
                        </div>

                    </div>

                    {/* PRICE + CTA */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-4">

                        <div>
                            <p className="text-gray-400 text-sm">Price</p>
                            <h2 className="text-3xl font-bold text-white">
                                {event.price > 0 ? `₹${event.price}` : "Free"}
                            </h2>
                        </div>

                        <div className="w-full sm:w-auto">
                            {event.isRegistrationOpen ? (
                                <button
                                    onClick={handleRegister}
                                    disabled={isRegistering}
                                    className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-[#00BFA6] to-[#1DE9B6] text-black font-semibold rounded-xl shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50"
                                >
                                    {isRegistering ? 'Processing...' : 'Register Now'}
                                </button>
                            ) : (
                                <button
                                    disabled
                                    className="w-full sm:w-auto px-8 py-3 bg-gray-600 text-white rounded-xl cursor-not-allowed"
                                >
                                    Registration Closed
                                </button>
                            )}
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
}

export default EventDetails;