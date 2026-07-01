import { useEffect, useRef, useState } from "react";

import "./Network.css";

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
    <Tag ref={ref} className={`nw-reveal ${visible ? "is-visible" : ""} ${className}`} style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}>
      {children}
    </Tag>
  );
}

const STATIONS = [
  { code: "DSS-14", site: "Goldstone, USA", band: "X-band", load: 82, lock: "LOCKED" },
  { code: "DSS-43", site: "Canberra, Australia", band: "X-band", load: 64, lock: "LOCKED" },
  { code: "DSS-63", site: "Madrid, Spain", band: "Ka-band", load: 71, lock: "LOCKED" },
  { code: "MRO-X1", site: "Lunar Gateway", band: "Ka-band", load: 45, lock: "ACQUIRING" },
  { code: "LCRD-2", site: "GEO Laser Relay", band: "Optical", load: 58, lock: "LOCKED" },
  { code: "SVB-01", site: "Svalbard, Norway", band: "UHF", load: 39, lock: "LOCKED" },
];

const ZONES = [
  { label: "Deep Space", value: 8, color: "#5eead4" },
  { label: "LEO Mesh", value: 6, color: "#5d8aff" },
  { label: "Lunar", value: 5, color: "#9db4ff" },
  { label: "Mars Relay", value: 4, color: "#c49a6c" },
  { label: "GEO Optical", value: 3, color: "#ffb454" },
];

export default function Network() {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div className="nw-page">
        {/* HERO */}
        <section className="nw-hero">
          <p className="nw-eyebrow">Network</p>
          <h1 className="nw-hero__headline">One mesh.<br />No dead zones.</h1>
          <p className="nw-hero__sub">
            A spacecraft handing off between a ground dish and a relay satellite doesn't
            drop a single frame. The mesh negotiates the next-best path before the
            current one degrades.
          </p>
          <div className="nw-hero__stats">
            <div><strong>99.982%</strong><span>Availability, 12mo</span></div>
            <div><strong>0.4s</strong><span>Median handoff</span></div>
            <div><strong>140+</strong><span>Spacecraft supported</span></div>
          </div>
        </section>

        {/* ORBIT VISUAL */}
        <section className="nw-section">
          <Reveal className="nw-orbit-wrap">
            <svg viewBox="0 0 600 420" className="nw-orbit-svg" aria-hidden="true" style={{ transform: `rotate(${Math.min(scrollY * 0.01, 6)}deg)` }}>
              <ellipse cx="300" cy="210" rx="260" ry="120" className="nw-orbit-path" />
              <ellipse cx="300" cy="210" rx="170" ry="78" className="nw-orbit-path nw-orbit-path--inner" />
              <circle cx="300" cy="210" r="34" className="nw-orbit-earth" />
              <circle className="nw-orbit-sat nw-orbit-sat--a" r="6" />
              <circle className="nw-orbit-sat nw-orbit-sat--b" r="5" />
              <circle className="nw-orbit-sat nw-orbit-sat--c" r="4.5" />
              <line x1="300" y1="210" x2="540" y2="100" className="nw-orbit-beam nw-orbit-beam--a" />
              <line x1="300" y1="210" x2="80" y2="300" className="nw-orbit-beam nw-orbit-beam--b" />
            </svg>
          </Reveal>
        </section>

        {/* COVERAGE ZONES */}
        <section className="nw-section nw-zones-section">
          <Reveal className="nw-section__head">
            <p className="nw-eyebrow">Coverage</p>
            <h2>Five zones, one routing table</h2>
          </Reveal>
          <div className="nw-zones">
            {ZONES.map((z, i) => (
              <Reveal key={z.label} delay={i * 80} className="nw-zone-row">
                <div className="nw-zone-row__head">
                  <span className="nw-zone-dot" style={{ background: z.color }} />
                  <span className="nw-zone-label">{z.label}</span>
                  <span className="nw-zone-value">{z.value} stations</span>
                </div>
                <div className="nw-zone-bar">
                  <div className="nw-zone-bar__fill" style={{ width: `${(z.value / 8) * 100}%`, background: z.color }} />
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* LIVE STATION TABLE */}
        <section className="nw-section">
          <Reveal className="nw-section__head">
            <p className="nw-eyebrow">Live Status</p>
            <h2>Station load, right now</h2>
          </Reveal>
          <Reveal delay={100} className="nw-station-table-wrap">
            <table className="nw-station-table">
              <thead>
                <tr><th>Station</th><th>Site</th><th>Band</th><th>Load</th><th>Status</th></tr>
              </thead>
              <tbody>
                {STATIONS.map((s) => (
                  <tr key={s.code}>
                    <td className="nw-station-code">{s.code}</td>
                    <td>{s.site}</td>
                    <td className="nw-station-band">{s.band}</td>
                    <td>
                      <div className="nw-load-wrap">
                        <div className="nw-load-bar"><div className="nw-load-fill" style={{ width: `${s.load}%` }} /></div>
                        <span>{s.load}%</span>
                      </div>
                    </td>
                    <td>
                      <span className={`nw-status-badge ${s.lock === "LOCKED" ? "is-locked" : "is-acquiring"}`}>
                        <span className="nw-status-dot" /> {s.lock}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
        </section>

        {/* CTA */}
        <section className="nw-cta">
          <Reveal>
            <h2>Want coverage data for your orbit?</h2>
            <p>We'll run a link budget against the live network and show you the gaps before launch.</p>
            <a href="/contact" className="nw-btn">Request a Coverage Report</a>
          </Reveal>
        </section>
      </div>
    </>
  );
}