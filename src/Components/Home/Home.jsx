import { useEffect, useRef, useState } from "react";
import "./home.css";
import home1 from "../../assets/Home1.webp"
import home2 from "../../assets/Home2.webp"
import home3 from "../../assets/Home3.webp"
import home4 from "../../assets/Home4.webp"
import home5 from "../../assets/Home5.webp"
import home6 from "../../assets/Home6.webp"

/**
 * MERIDIAN LINK — Deep Space Communications
 * ------------------------------------------------------------
 * Signature element: the "Carrier Wave" — concentric pulse rings
 * radiating from an uplink dish in the hero, echoed as a scanning
 * sine wave through the page. Scroll position drives a slow parallax
 * drift on the rings; IntersectionObserver drives staggered reveals
 * on every section below the fold.
 *
 * Photography layer: real dish, orbit, and starfield photography is
 * used as texture behind the vector signature elements — never as a
 * replacement for them — so the page keeps its illustrated identity
 * while feeling grounded in an actual, physical network.
 * ------------------------------------------------------------
 */

/* Unsplash source photography (free license, no attribution required).
   Query params keep requests appropriately sized per placement. */
const IMG = {
  milkyWay:
    home1,
  nebula:
    home2,
  dishField:
   home3,
  satelliteOrbit:
    home4,
  earthAtNight:
    home5,
  groundStation:
    home6,
};

const STATIONS = [
  { code: "DSS-14", site: "Goldstone, CA", target: "Voyager 1", rtlt: "41h 22m", lock: "LOCKED" },
  { code: "DSS-43", site: "Canberra, AU", target: "New Horizons", rtlt: "12h 04m", lock: "LOCKED" },
  { code: "DSS-63", site: "Madrid, ES", target: "Mars Relay Network", rtlt: "22m 14s", lock: "LOCKED" },
  { code: "MRO-X1", site: "Lunar Gateway", target: "Artemis Surface Ops", rtlt: "2.6s", lock: "ACQUIRING" },
  { code: "LCRD-2", site: "GEO Laser Relay", target: "LEO Constellation", rtlt: "0.4s", lock: "LOCKED" },
];

const CAPABILITIES = [
  {
    label: "Deep Space Network",
    title: "X-band & Ka-band uplink",
    body: "Three 34-meter dish clusters spaced across longitudes keep a continuous line on spacecraft from cislunar space out past the heliopause, handing off cleanly as Earth rotates underneath them.",
    image: IMG.dishField,
    alt: "Large parabolic ground-station dish standing in an open field",
  },
  {
    label: "Optical Crosslink",
    title: "Laser comm relay",
    body: "Point-ahead tracking and adaptive optics push data rates past what RF can carry, turning a single photon budget into gigabit-class returns from lunar and near-Earth missions.",
    image: IMG.satelliteOrbit,
    alt: "Satellite silhouetted against the curve of Earth in orbit",
  },
  {
    label: "Mesh Constellation",
    title: "LEO relay swarm",
    body: "Spacecraft talk to the nearest node instead of waiting for a ground pass. The mesh routes around weather, congestion, and eclipse, so a downlink window is rarely more than a few minutes away.",
    image: IMG.earthAtNight,
    alt: "Earth at night, city lights forming a bright interconnected web",
  },
  {
    label: "Ground Segment",
    title: "Field-deployable stations",
    body: "Containerized 4.5-meter terminals stand up a mission-grade link in under a day, built for polar orbits, expedition science, and sites where permanent infrastructure isn't an option.",
    image: IMG.groundStation,
    alt: "Compact satellite dish deployed on an open grass field",
  },
];

const SEQUENCE = [
  { step: "Acquisition", detail: "Antenna slews to predicted ephemeris and sweeps the beam until carrier power rises above threshold." },
  { step: "Handshake", detail: "Spacecraft and station exchange ranging tones to confirm identity and lock the coding scheme for the pass." },
  { step: "Telemetry Lock", detail: "Bit and frame sync settle in; housekeeping data starts streaming while the link margin is logged in real time." },
  { step: "Data Return", detail: "Science and engineering payloads queue for downlink, prioritized by storage pressure and time to next pass." },
];

function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.18 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return [ref, visible];
}

function Reveal({ as: Tag = "div", className = "", delay = 0, children }) {
  const [ref, visible] = useReveal();
  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
    >
      {children}
    </Tag>
  );
}

export default function Home() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const ringDrift = Math.min(scrollY * 0.08, 60);
  const bgDrift = Math.min(scrollY * 0.03, 40);

  return (
    <div className="ml-page">

      {/* ---------- HERO ---------- */}
      <section className="ml-hero">
        <img
          className="ml-hero__photo"
          src={IMG.milkyWay}
          alt=""
          role="presentation"
          loading="eager"
          fetchpriority="high"
          style={{ transform: `translateY(${bgDrift}px) scale(1.06)` }}
        />
        <div className="ml-hero__scrim" aria-hidden="true" />

        <div
          className="ml-hero__rings"
          style={{ transform: `translateY(${ringDrift}px)` }}
          aria-hidden="true"
        >
          <span className="ring ring--1" />
          <span className="ring ring--2" />
          <span className="ring ring--3" />
          <svg className="ml-hero__dish" viewBox="0 0 120 120" aria-hidden="true">
            <circle cx="60" cy="60" r="3" className="dish-core" />
            <path d="M60 60 L60 18 A42 42 0 0 1 95 78 Z" className="dish-cone" />
            <line x1="60" y1="60" x2="20" y2="100" className="dish-strut" />
          </svg>
        </div>

        <div className="ml-hero__content">
          <p className="eyebrow">Deep Space &amp; Orbital Communications</p>
          <h1 className="ml-hero__headline">
            Every signal<br />finds its way home.
          </h1>
          <p className="ml-hero__sub">
            Meridian Link operates the ground stations, laser crosslinks, and orbital
            relay mesh that keep spacecraft talking — from low Earth orbit to the
            edge of the solar system.
          </p>
          <div className="ml-hero__actions">
            <a href="#contact" className="btn btn--primary">Request Integration</a>
            <a href="#network" className="btn btn--ghost">View Live Network ↓</a>
          </div>
        </div>

        <svg className="ml-hero__wave" viewBox="0 0 1200 80" preserveAspectRatio="none" aria-hidden="true">
          <path
            d="M0 40 Q 50 0, 100 40 T 200 40 T 300 40 T 400 40 T 500 40 T 600 40 T 700 40 T 800 40 T 900 40 T 1000 40 T 1100 40 T 1200 40"
            className="wave-path"
          />
        </svg>
      </section>

      {/* ---------- TELEMETRY MARQUEE ---------- */}
      <div className="ml-marquee" role="status" aria-label="Live station telemetry">
        <div className="ml-marquee__track">
          {[...STATIONS, ...STATIONS].map((s, i) => (
            <span className="ml-marquee__item" key={i}>
              <span className={`pip pip--${s.lock === "LOCKED" ? "ok" : "warn"}`} />
              {s.code} · {s.site} → {s.target} · RTLT {s.rtlt} · {s.lock}
            </span>
          ))}
        </div>
      </div>

      {/* ---------- CAPABILITIES ---------- */}
      <section id="capabilities" className="ml-section">
        <Reveal className="ml-section__head">
          <p className="eyebrow">Capabilities</p>
          <h2>Four ways to keep a link alive</h2>
        </Reveal>

        <div className="ml-grid">
          {CAPABILITIES.map((c, i) => (
            <Reveal key={c.title} delay={i * 90} className="ml-card">
              <div className="ml-card__photo">
                <img src={c.image} alt={c.alt} loading="lazy" />
                <span className="ml-card__label">{c.label}</span>
              </div>
              <h3>{c.title}</h3>
              <p>{c.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- LIVE NETWORK VISUAL ---------- */}
      <section id="network" className="ml-orbit-section">
        <img className="ml-orbit-section__photo" src={IMG.nebula} alt="" role="presentation" loading="lazy" />
        <div className="ml-orbit-section__scrim" aria-hidden="true" />

        <div className="ml-orbit-section__inner">
          <Reveal className="ml-section__head ml-section__head--light">
            <p className="eyebrow">Network</p>
            <h2>One mesh, no dead zones</h2>
            <p className="ml-section__copy">
              A spacecraft handing off between a ground dish and a relay satellite
              doesn't drop a single frame. The mesh negotiates the next-best path
              before the current one degrades.
            </p>
          </Reveal>

          <Reveal delay={120} className="ml-orbit">
            <svg viewBox="0 0 600 420" className="ml-orbit__svg" aria-hidden="true">
              <ellipse cx="300" cy="210" rx="260" ry="120" className="orbit-path" />
              <ellipse cx="300" cy="210" rx="170" ry="78" className="orbit-path orbit-path--inner" />
              <circle cx="300" cy="210" r="34" className="orbit-earth" />
              <circle className="orbit-sat orbit-sat--a" r="6" />
              <circle className="orbit-sat orbit-sat--b" r="5" />
              <circle className="orbit-sat orbit-sat--c" r="4.5" />
              <line x1="300" y1="210" x2="540" y2="100" className="orbit-beam orbit-beam--a" />
              <line x1="300" y1="210" x2="80" y2="300" className="orbit-beam orbit-beam--b" />
            </svg>
            <div className="ml-orbit__stats">
              <div>
                <strong>99.982%</strong>
                <span>Network availability, trailing 12 months</span>
              </div>
              <div>
                <strong>0.4s</strong>
                <span>Median crosslink handoff time</span>
              </div>
              <div>
                <strong>140+</strong>
                <span>Spacecraft under active support</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- LINK SEQUENCE ---------- */}
      <section id="sequence" className="ml-section ml-sequence-section">
        <Reveal className="ml-section__head">
          <p className="eyebrow">Anatomy of a Pass</p>
          <h2>From first carrier to data on the ground</h2>
        </Reveal>

        <div className="ml-sequence-layout">
          <ol className="ml-sequence">
            {SEQUENCE.map((s, i) => (
              <Reveal as="li" key={s.step} delay={i * 110} className="ml-sequence__item">
                <span className="ml-sequence__index">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{s.step}</h3>
                  <p>{s.detail}</p>
                </div>
              </Reveal>
            ))}
          </ol>

          <Reveal delay={140} className="ml-sequence__figure">
            <img
              src={IMG.satelliteOrbit}
              alt="Communications satellite passing over the curve of the Earth"
              loading="lazy"
            />
            <div className="ml-sequence__figure-tag">
              <span className="pip pip--ok" /> LIVE PASS · DSS-14
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- CTA / FOOTER ---------- */}
      <section id="contact" className="ml-cta">
        <img className="ml-cta__photo" src={IMG.dishField} alt="" role="presentation" loading="lazy" />
        <div className="ml-cta__scrim" aria-hidden="true" />

        <Reveal className="ml-cta__inner">
          <h2>Bring your mission onto the link.</h2>
          <p>
            Tell us the orbit, the data volume, and the deadline. We'll map it
            to a station, a relay path, and a margin you can trust.
          </p>
          <a href="mailto:integration@meridianlink.example" className="btn btn--primary">
            Request Mission Integration
          </a>
        </Reveal>
      </section>

      <footer className="ml-footer">
        <span>© {new Date().getFullYear()} Meridian Link Communications</span>
        <span className="ml-footer__status">
          <span className="pip pip--ok" /> All stations nominal
        </span>
      </footer>
    </div>
  );
}