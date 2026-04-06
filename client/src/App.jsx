import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import AOS from 'aos';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Events from './pages/Events';
import CreateEvent from './pages/CreateEvent';
import ManageEvents from './pages/ManageEvents';
import Promotion from './pages/Promotion';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import EditEvent from './pages/EditEvent';
import MyRegistrations from './pages/MyRegistrations';

function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-out-cubic',
    });
  }, []);

  // Base theme colors
  const colors = {
    appBackground: '#121212', // very dark gray
  };

  return (
    <AuthProvider>
      <Router>
        <div style={{ minHeight: '100vh', backgroundColor: colors.appBackground }}>
          <Navbar />
          <Toaster position="bottom-right" />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<Events />} />
            <Route path="/create-event" element={<CreateEvent />} />
            <Route path="/edit-event/:id" element={<EditEvent />} />
            <Route path="/my-registrations" element={<MyRegistrations />} />
            <Route path="/manage-events" element={<ManageEvents />} />
            <Route path="/promotion" element={<Promotion />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;