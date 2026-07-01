// Footer.jsx
import "./Footer.css";
import { useNavigate, Link } from "react-router-dom";
import logo from "../../assets/Stacklyimg.webp";

const NAV_LINKS = [
  { label: "Home",         path: "/" },
  { label: "Capabilities",  path: "/capabilities" },
  { label: "Network",       path: "/network" },
  { label: "Link Sequence", path: "/sequence" },
  { label: "Contact",       path: "/contact" },
];

const SOCIALS = [
  {
    label: "Instagram",
    href: "/404",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "X / Twitter",
    href: "/404",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "/404",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="3" />
        <polygon points="10,9 15,12 10,15" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "/404",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="3" />
        <line x1="8" y1="11" x2="8" y2="16" />
        <line x1="8" y1="8" x2="8" y2="8.5" />
        <path d="M12 11v5M12 14a2 2 0 0 1 4 0v2" />
      </svg>
    ),
  },
];

export default function Footer() {
  const navigate = useNavigate();

  // Logo always returns home and snaps to the top of the page
  const handleLogoClick = (e) => {
    e.preventDefault();
    navigate("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="ftr">

      {/* ── TOP BAND: newsletter ── */}
      <div className="ftr-band">
        <div className="ftr-container ftr-band-inner">
          <div className="ftr-band-text">
            <p className="ftr-band-label">Mission Dispatch</p>
            <p className="ftr-band-title">
              Get link status and network updates <em>before they hit the board.</em>
            </p>
          </div>
          <form className="ftr-newsletter" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="your@email.com"
              className="ftr-newsletter-input"
              aria-label="Email address"
            />
            <button type="submit" className="ftr-newsletter-btn" onClick={() => navigate("/404")}>
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* ── MAIN FOOTER ── */}
      <div className="ftr-main">
        <div className="ftr-container">

          {/* Brand column */}
          <div className="ftr-brand">
            <Link to="/" className="ftr-logo" aria-label="Meridian Link home" onClick={handleLogoClick}>
              <div className="ftr-logo-placeholder">
                <img src={logo} alt="" />
              </div>
              
            </Link>
            <p className="ftr-brand-desc">
              Ground stations, laser crosslinks, and orbital relay mesh that keep
              spacecraft talking — from low Earth orbit to the edge of the solar system.
            </p>

            {/* Socials */}
            <div className="ftr-socials">
              {SOCIALS.map(({ label, href, icon }) => (
                <Link key={label} to={href} className="ftr-social" aria-label={label} onClick={() => navigate("/404")}>
                  {icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="ftr-cols">
            <div className="ftr-col">
              <p className="ftr-col-heading">Quick Links</p>
              <ul className="ftr-col-list">
                {NAV_LINKS.map(({ label, path }) => (
                  <li key={label}>
                    <Link to={path} className="ftr-col-link">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Us */}
            <div className="ftr-col">
              <p className="ftr-col-heading">Contact Us</p>
              <ul className="ftr-col-list ftr-contact-list">
                <li>
                  <span className="ftr-contact-icon">✉️</span>
                  <a href="mailto:Stackly@meridianlink.example" className="ftr-col-link">
                    Stackly@meridianlink.in
                  </a>
                </li>
                <li>
                  <span className="ftr-contact-icon">📞</span>
                  <a href="tel:+919878965412" className="ftr-col-link">
                    +91 9878965412
                  </a>
                </li>
                <li>
                  <span className="ftr-contact-icon">📍</span>
                  <span className="ftr-col-link ftr-address">
                    Madhapur, Hyderabad, India
                  </span>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>

      {/* ── DIVIDER WITH LARGE WORDMARK ── */}
      <div className="ftr-wordmark" aria-hidden="true">STACKLY</div>

      {/* ── BOTTOM BAR ── */}
      <div className="ftr-bar">
        <div className="ftr-container ftr-bar-inner">
          <span>© {new Date().getFullYear()} Meridian Link Communications. All rights reserved.</span>
          <div className="ftr-bar-links">
            <Link to="/404">Privacy Policy</Link>
            <Link to="/404">Terms of Use</Link>
            <Link to="/404">Cookie Preferences</Link>
          </div>
          <span className="ftr-bar-tagline">
            <span className="ftr-bar-pip" /> All stations nominal
          </span>
        </div>
      </div>

    </footer>
  );
}