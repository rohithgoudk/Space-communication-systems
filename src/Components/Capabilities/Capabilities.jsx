import { useEffect, useRef, useState } from "react";
import "./Capabilities.css";
import home2 from "../../assets/Home2.webp"
import home1 from "../../assets/Home1.webp"
import home3 from "../../assets/Home3.webp"
import home4 from "../../assets/Home4.webp"
import home5 from "../../assets/Home5.webp"
import home6 from "../../assets/Home6.webp"
import home7 from "../../assets/Home7.webp"


/* Unsplash source photography (free license, no attribution required).
   Reused across the site's "Carrier Wave" visual system so every page
   feels like part of the same physical network. */
const IMG = {
  nebula:
    home2,
  milkyWay:
    home1,
  dishField:
    home3,
  satelliteOrbit:
    home4,
  earthAtNight:
    home5,
  groundStation:
   home6,
  controlRoom:
    home7,
};

function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.16 }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function Reveal({ as: Tag = "div", className = "", delay = 0, children }) {
  const [ref, visible] = useReveal();
  return (
    <Tag ref={ref} className={`cp-reveal ${visible ? "is-visible" : ""} ${className}`} style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}>
      {children}
    </Tag>
  );
}

const CAPS = [
  {
    tag: "01",
    label: "Deep Space Network",
    title: "X-band & Ka-band uplink",
    body: "Three 34-meter dish clusters spaced across longitudes keep continuous contact with spacecraft from cislunar space out past the heliopause, handing off cleanly as Earth rotates underneath them.",
    metrics: [["Range", "23B+ km"], ["Bands", "X / Ka"], ["Dishes", "12 active"]],
    image: IMG.dishField,
    alt: "Large parabolic ground-station dish standing in an open field",
  },
  {
    tag: "02",
    label: "Optical Crosslink",
    title: "Laser comm relay",
    body: "Point-ahead tracking and adaptive optics push data rates past what RF can carry, turning a single photon budget into gigabit-class returns from lunar and near-Earth missions.",
    metrics: [["Throughput", "1.2 Gbps"], ["Pointing", "±0.5 µrad"], ["Latency", "0.4s avg"]],
    image: IMG.satelliteOrbit,
    alt: "Satellite silhouetted against the curve of Earth in orbit",
  },
  {
    tag: "03",
    label: "Mesh Constellation",
    title: "LEO relay swarm",
    body: "Spacecraft talk to the nearest node instead of waiting for a ground pass. The mesh routes around weather, congestion, and eclipse, so a downlink window is rarely more than a few minutes away.",
    metrics: [["Nodes", "340 sats"], ["Reroute", "<0.4s"], ["Coverage", "Global"]],
    image: IMG.earthAtNight,
    alt: "Earth at night, city lights forming a bright interconnected web",
  },
  {
    tag: "04",
    label: "Ground Segment",
    title: "Field-deployable stations",
    body: "Containerized 4.5-meter terminals stand up a mission-grade link in under a day, built for polar orbits, expedition science, and sites where permanent infrastructure isn't an option.",
    metrics: [["Setup", "<24 hrs"], ["Terminals", "4.5m"], ["Sites", "61 fielded"]],
    image: IMG.groundStation,
    alt: "Compact satellite dish deployed on an open grass field",
  },
];

const COMPARE = [
  { feature: "Best for", rf: "Bulk telemetry, deep space", optical: "High-rate near-Earth data", mesh: "Latency-sensitive LEO" },
  { feature: "Typical data rate", rf: "Up to 250 Mbps", optical: "1+ Gbps", mesh: "100–600 Mbps" },
  { feature: "Range", rf: "Heliopause+", optical: "Lunar / GEO", mesh: "LEO global" },
  { feature: "Weather sensitivity", rf: "Low", optical: "High (clear sky)", mesh: "Low (auto-reroute)" },
];

const PROCESS = [
  { step: "Assess", detail: "We map your orbit, data volume, and deadline against the network's current coverage and link budgets." },
  { step: "Design", detail: "A path is engineered across ground stations, optical relays, or mesh nodes — whichever combination clears the margin." },
  { step: "Integrate", detail: "Your spacecraft's comms subsystem is validated against our protocols in a sandboxed pass simulation." },
  { step: "Operate", detail: "Live passes begin under 24/7 monitoring, with automatic failover if a node degrades mid-link." },
];

export default function Capabilities() {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div className="cp-page">
        {/* HERO */}
        <section className="cp-hero">
          <img
            className="cp-hero__photo"
            src={IMG.nebula}
            alt=""
            role="presentation"
            loading="eager"
            fetchpriority="high"
            style={{ transform: `translateY(${Math.min(scrollY * 0.03, 30)}px) scale(1.06)` }}
          />
          <div className="cp-hero__scrim" aria-hidden="true" />
          <div className="cp-hero__grid" style={{ transform: `translateY(${Math.min(scrollY * 0.05, 40)}px)` }} aria-hidden="true" />
          <div className="cp-hero__inner">
            <p className="cp-eyebrow">Capabilities</p>
            <h1 className="cp-hero__headline">Four ways to keep<br />a signal alive.</h1>
            <p className="cp-hero__sub">
              Every mission has a different orbit, data budget, and deadline. Meridian Link
              engineers the right combination of RF, optical, and mesh relay to match it.
            </p>
          </div>
        </section>

        {/* CAPABILITY CARDS */}
        <section className="cp-section">
          <div className="cp-caps-grid">
            {CAPS.map((c, i) => (
              <Reveal key={c.title} delay={i * 100} className="cp-cap-card">
                <div className="cp-cap-card__photo">
                  <img src={c.image} alt={c.alt} loading="lazy" />
                </div>
                <div className="cp-cap-card__top">
                  <span className="cp-cap-tag">{c.tag}</span>
                  <span className="cp-cap-label">{c.label}</span>
                </div>
                <h3>{c.title}</h3>
                <p>{c.body}</p>
                <div className="cp-cap-metrics">
                  {c.metrics.map(([k, v]) => (
                    <div key={k} className="cp-metric">
                      <span className="cp-metric__value">{v}</span>
                      <span className="cp-metric__key">{k}</span>
                    </div>
                  ))}
                </div>
                <div className="cp-cap-card__beam" aria-hidden="true" />
              </Reveal>
            ))}
          </div>
        </section>

        {/* COMPARISON TABLE */}
        <section className="cp-section cp-compare-section">
          <Reveal className="cp-section__head">
            <p className="cp-eyebrow">Choosing a Path</p>
            <h2>RF, optical, or mesh — side by side</h2>
          </Reveal>
          <Reveal delay={100} className="cp-compare-wrap">
            <table className="cp-compare-table">
              <thead>
                <tr>
                  <th></th>
                  <th>RF Network</th>
                  <th>Optical Crosslink</th>
                  <th>Mesh Constellation</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE.map((row) => (
                  <tr key={row.feature}>
                    <td className="cp-compare-feature">{row.feature}</td>
                    <td>{row.rf}</td>
                    <td>{row.optical}</td>
                    <td>{row.mesh}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
        </section>

        {/* PROCESS */}
        <section className="cp-process-section">
          <img className="cp-process-section__photo" src={IMG.controlRoom} alt="" role="presentation" loading="lazy" />
          <div className="cp-process-section__scrim" aria-hidden="true" />
          <div className="cp-section cp-process-section__inner">
            <Reveal className="cp-section__head">
              <p className="cp-eyebrow">Onboarding</p>
              <h2>From first call to first pass</h2>
            </Reveal>
            <div className="cp-process">
              <div className="cp-process__rail" aria-hidden="true" />
              {PROCESS.map((p, i) => (
                <Reveal key={p.step} delay={i * 110} className="cp-process__item">
                  <span className="cp-process__index">{String(i + 1).padStart(2, "0")}</span>
                  <div className="cp-process__dot" />
                  <div>
                    <h3>{p.step}</h3>
                    <p>{p.detail}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="cp-cta">
          <img className="cp-cta__photo" src={IMG.milkyWay} alt="" role="presentation" loading="lazy" />
          <div className="cp-cta__scrim" aria-hidden="true" />
          <Reveal className="cp-cta__inner">
            <h2>Not sure which path fits your mission?</h2>
            <p>Tell us the orbit and the data budget — we'll map it to a link in one call.</p>
            <a href="/contact" className="cp-btn cp-btn--primary">Talk to a Network Engineer</a>
          </Reveal>
        </section>
      </div>
    </>
  );
}