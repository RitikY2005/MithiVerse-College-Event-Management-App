import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaCalendarAlt, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  // Theme colors
  const textWhite = '#FFFFFF';
  const textLight = '#E0E0E0';
  const textMuted = '#A0A0A0';
  const bgDark = '#121212';
  const bgCardDark = '#1E1E2F';
  const bgCardLight = '#2A2A3D';
  const primaryGradient = 'linear-gradient(to bottom right, #00BFA6, #1DE9B6)';
  const socialHover = '#00BFA6';

  return (
    <footer style={{ backgroundColor: bgDark, color: textWhite, marginTop: '80px' }}>
      
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '32px', 
                      '@media(min-width:768px)': { gridTemplateColumns: 'repeat(4, 1fr)' } }}>
          {/* Brand Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ background: primaryGradient, padding: '8px', borderRadius: '12px' }}>
                <FaCalendarAlt style={{ color: textWhite, fontSize: '24px' }} />
              </div>
              <span style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'Montserrat, sans-serif' }}>
                Mithi<span style={{ background: primaryGradient, WebkitBackgroundClip: 'text', color: 'transparent' }}>Verse</span>
              </span>
            </div>
            <p style={{ color: textMuted, fontSize: '14px' }}>
              Creating unforgettable experiences through seamless event management and innovative solutions.
            </p>
            <div style={{ display: 'flex', gap: '16px' }}>
              {[FaFacebook, FaTwitter, FaInstagram, FaLinkedin].map((Icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: textMuted, fontSize: '20px', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = socialHover)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = textMuted)}
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 style={{ color: textWhite, fontSize: '16px', fontWeight: 600, marginBottom: '16px', fontFamily: 'Montserrat, sans-serif' }}>
              Quick Links
            </h3>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { name: 'Home', path: '/' },
                { name: 'Browse Events', path: '/events' },
                { name: 'Create Event', path: '/create-event' },
                { name: 'Manage Events', path: '/manage-events' },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    style={{ color: textMuted, textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = socialHover)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = textMuted)}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 style={{ color: textWhite, fontSize: '16px', fontWeight: 600, marginBottom: '16px', fontFamily: 'Montserrat, sans-serif' }}>
              Resources
            </h3>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {['Event Planning Guide', 'Pricing', 'FAQ', 'Support'].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    style={{ color: textMuted, textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = socialHover)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = textMuted)}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 style={{ color: textWhite, fontSize: '16px', fontWeight: 600, marginBottom: '16px', fontFamily: 'Montserrat, sans-serif' }}>
              Contact Us
            </h3>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: textMuted }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <FaMapMarkerAlt style={{ color: socialHover, marginTop: '2px' }} />
                <span>Mithibai college, Vile Parle, Mumbai</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaEnvelope style={{ color: socialHover }} />
                <a href="mailto:mahabriarman@gmail.com" style={{ color: textMuted, textDecoration: 'none' }}
                   onMouseEnter={(e) => (e.currentTarget.style.color = socialHover)}
                   onMouseLeave={(e) => (e.currentTarget.style.color = textMuted)}>
                  mahabriarman@gmail.com
                </a>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaPhone style={{ color: socialHover }} />
                <a href="tel:+919529873656" style={{ color: textMuted, textDecoration: 'none' }}
                   onMouseEnter={(e) => (e.currentTarget.style.color = socialHover)}
                   onMouseLeave={(e) => (e.currentTarget.style.color = textMuted)}>
                  +91 9529873656
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #2A2A3D', marginTop: '32px', paddingTop: '32px', textAlign: 'center', color: textMuted, fontSize: '14px' }}>
          &copy; {new Date().getFullYear()} MithiVerse. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;