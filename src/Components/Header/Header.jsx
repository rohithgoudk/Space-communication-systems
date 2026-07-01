// Header.jsx
import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Header.css";
import logo from "../../assets/Stacklyimg1.webp";

const NAV_LINKS = [
  { label: "Home",         path: "/" },
  { label: "Capabilities",  path: "/capabilities" },
  { label: "Network",       path: "/network" },
  { label: "Link Sequence", path: "/sequence" },
  { label: "Contact",       path: "/contact" },
];

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled,    setScrolled]    = useState(false);
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [searchOpen,  setSearchOpen]  = useState(false);
  const searchRef = useRef(null);

  // Get current active link based on path
  const getActiveLink = () => {
    const currentPath = location.pathname;
    const matched = NAV_LINKS.find(link => link.path === currentPath);
    return matched ? matched.label : "Mission Control";
  };

  const [activeLink, setActiveLink] = useState(getActiveLink());

  // Update active link when location changes
  useEffect(() => {
    setActiveLink(getActiveLink());
  }, [location.pathname]);

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close search on outside click
  useEffect(() => {
    if (!searchOpen) return;
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [searchOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  // Handle navigation
  const handleNavigate = (path, label) => {
    navigate(path);
    setActiveLink(label);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Logo always returns home and snaps to the top of the page
  const handleLogoClick = () => {
    handleNavigate("/", "Home");
  };

  return (
    <>
      <header className={`hdr${scrolled ? " hdr--scrolled" : ""}${menuOpen ? " hdr--menu-open" : ""}`}>
        <div className="hdr-inner">

          {/* ── LOGO ── */}
          <div
            className="hdr-logo"
            onClick={handleLogoClick}
            style={{ cursor: "pointer" }}
            aria-label="Meridian Link home"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleLogoClick()}
          >
            <img
              src={logo}
              alt="Meridian Link logo"
              className="hdr-logo-img"
            />
            
          </div>

          {/* ── DESKTOP NAV ── */}
          <nav className="hdr-nav" aria-label="Primary navigation">
            <ul className="hdr-nav-list">
              {NAV_LINKS.map(({ label, path }) => (
                <li key={label}>
                  <button
                    className={`hdr-nav-link${activeLink === label ? " hdr-nav-link--active" : ""}`}
                    onClick={() => handleNavigate(path, label)}
                  >
                    {label}
                    <span className="hdr-nav-underline" />
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* ── RIGHT ACTIONS ── */}
          <div className="hdr-actions">
            {/* Live status pip */}
            <span className="hdr-status" aria-hidden="true">
              <span className="hdr-status-dot" />
              All stations nominal
            </span>

            {/* Member login */}
            <button className="hdr-icon-btn hdr-icon-btn--text" aria-label="Mission login" onClick={() => navigate("/login")}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
              </svg>
            </button>

            {/* CTA */}
            <button
              className="hdr-cta"
              onClick={() => handleNavigate("/register", "Signup")}
            >
              Request Integration
            </button>

            {/* Hamburger */}
            <button
              className={`hdr-burger${menuOpen ? " hdr-burger--open" : ""}`}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </header>

      {/* ── MOBILE DRAWER ── */}
      <div className={`hdr-drawer${menuOpen ? " hdr-drawer--open" : ""}`} aria-hidden={!menuOpen}>
        <nav className="hdr-drawer-nav">
          {NAV_LINKS.map(({ label, path }, i) => (
            <button
              key={label}
              className="hdr-drawer-link"
              style={{ transitionDelay: menuOpen ? `${i * 0.06}s` : "0s" }}
              onClick={() => handleNavigate(path, label)}
            >
              <span className="hdr-drawer-num">0{i + 1}</span>
              {label}
            </button>
          ))}
        </nav>
        <div className="hdr-drawer-footer">
          <button
            className="hdr-cta hdr-cta--full"
            onClick={() => handleNavigate("/login", "Login")}
          >
            Request Integration
          </button>
          <p className="hdr-drawer-tagline">Deep Space &amp; Orbital Communications</p>
        </div>
      </div>

      {/* Backdrop */}
      {menuOpen && (
        <div className="hdr-backdrop" onClick={() => setMenuOpen(false)} aria-hidden="true" />
      )}
    </>
  );
}