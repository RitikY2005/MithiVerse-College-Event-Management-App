import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaEnvelope, FaPhone, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Message sent successfully! We'll get back to you soon.");
    e.target.reset();
  };

  const textWhite = '#FFFFFF';
  const textLight = '#E0E0E0';
  const textMuted = '#A0A0A0';
  const bgCard = '#1E1E2F';
  const bgGlass = 'linear-gradient(to bottom right, #1E1E2F, #2A2A3D, 0.5)'; // Glass effect
  const primaryGradient = 'linear-gradient(to bottom right, #00BFA6, #1DE9B6)';

  return (
    <div style={{ minHeight: '100vh', paddingTop: '96px', paddingBottom: '80px', paddingLeft: '16px', paddingRight: '16px', backgroundColor: '#121212' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: '48px' }}
        >
          <h1 style={{ fontSize: '48px', fontWeight: '700', color: textWhite, marginBottom: '16px', fontFamily: 'Montserrat' }}>
            Get In Touch
          </h1>
          <p style={{ fontSize: '20px', color: textLight, fontFamily: 'Raleway' }}>
            We'd love to hear from you. Send us a message!
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '48px', maxWidth: '100%', margin: '0 auto', 
                      '@media(min-width:1024px)': { gridTemplateColumns: '1fr 1fr' } 
                    }}>
          {/* Contact Form */}
          <div style={{ background: bgGlass, borderRadius: '24px', padding: '32px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: textWhite, marginBottom: '24px', fontFamily: 'Montserrat' }}>Send us a Message</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <label style={{ display: 'block', color: textWhite, fontWeight: '600', marginBottom: '8px' }}>Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  style={{
                    width: '100%',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    color: textWhite,
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    outline: 'none',
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', color: textWhite, fontWeight: '600', marginBottom: '8px' }}>Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="john@example.com"
                  style={{
                    width: '100%',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    color: textWhite,
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    outline: 'none',
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', color: textWhite, fontWeight: '600', marginBottom: '8px' }}>Subject</label>
                <input
                  type="text"
                  required
                  placeholder="How can we help?"
                  style={{
                    width: '100%',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    color: textWhite,
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    outline: 'none',
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', color: textWhite, fontWeight: '600', marginBottom: '8px' }}>Message</label>
                <textarea
                  required
                  rows="5"
                  placeholder="Tell us more about your inquiry..."
                  style={{
                    width: '100%',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    color: textWhite,
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    outline: 'none',
                  }}
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                style={{
                  width: '100%',
                  background: primaryGradient,
                  color: textWhite,
                  padding: '12px 0',
                  borderRadius: '12px',
                  fontWeight: '600',
                  fontSize: '18px',
                  cursor: 'pointer',
                  border: 'none',
                }}
              >
                Send Message
              </motion.button>
            </form>
          </div>

          {/* Contact Info + Socials */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Contact Details */}
            <div style={{ background: bgGlass, borderRadius: '24px', padding: '32px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '700', color: textWhite, marginBottom: '24px', fontFamily: 'Montserrat' }}>Contact Information</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'start' }}>
                  <div style={{ background: primaryGradient, padding: '12px', borderRadius: '12px' }}>
                    <FaMapMarkerAlt style={{ color: textWhite, fontSize: '20px' }} />
                  </div>
                  <div>
                    <h3 style={{ color: textWhite, fontWeight: '600', marginBottom: '4px' }}>Address</h3>
                    <p style={{ color: textMuted }}>Mithibai College<br />Vile Parle<br />Mumbai</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'start' }}>
                  <div style={{ background: primaryGradient, padding: '12px', borderRadius: '12px' }}>
                    <FaEnvelope style={{ color: textWhite, fontSize: '20px' }} />
                  </div>
                  <div>
                    <h3 style={{ color: textWhite, fontWeight: '600', marginBottom: '4px' }}>Email</h3>
                    <a href="mailto:mahabriarman@gmail.com" style={{ color: '#00BFA6' }}>mahabriarman@gmail.com</a><br/>
                    <a href="mailto:mahabriarman+support@gmail.com" style={{ color: '#00BFA6' }}>mahabriarman+support@gmail.com</a>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'start' }}>
                  <div style={{ background: primaryGradient, padding: '12px', borderRadius: '12px' }}>
                    <FaPhone style={{ color: textWhite, fontSize: '20px' }} />
                  </div>
                  <div>
                    <h3 style={{ color: textWhite, fontWeight: '600', marginBottom: '4px' }}>Phone</h3>
                    <a href="tel:+919529873656" style={{ color: '#00BFA6' }}>+91 9529873656</a><br/>
                    <a href="tel:+919529873657" style={{ color: '#00BFA6' }}>+91 9529873657</a>
                  </div>
                </div>
              </div>

              {/* Socials */}
              <div style={{ marginTop: '32px', paddingTop: '32px', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
                <h3 style={{ color: textWhite, fontWeight: '600', marginBottom: '16px' }}>Follow Us</h3>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '12px' }}><FaFacebook style={{ color: textWhite, fontSize: '20px' }} /></a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '12px' }}><FaTwitter style={{ color: textWhite, fontSize: '20px' }} /></a>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '12px' }}><FaInstagram style={{ color: textWhite, fontSize: '20px' }} /></a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '12px' }}><FaLinkedin style={{ color: textWhite, fontSize: '20px' }} /></a>
                </div>
              </div>
            </div>

            {/* Google Map */}
            <div style={{ background: bgGlass, borderRadius: '24px', overflow: 'hidden' }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.108528382179!2d72.8348553751888!3d19.10289425112767!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c856a7d54355%3A0xd8481ebbaccd8149!2sMithibai%20College%20of%20Arts%2C%20Chauhan%20Institute%20of%20Science%20and%20Amrutben%20Jivanlal%20College%20of%20Commerce%20and%20Economics!5e0!3m2!1sen!2sin!4v1771138795368!5m2!1sen!2sin"
                width="100%"
                height="300"
                style={{ border: 0, borderRadius: '12px' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Lottie Animation */}
            <div style={{ textAlign: 'center', marginTop: '24px' }}>
              <lottie-player
                src="https://assets3.lottiefiles.com/packages/lf20_u25cckyh.json"
                background="transparent"
                speed="1"
                style={{ width: '200px', height: '200px', margin: '0 auto' }}
                loop
                autoplay
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;