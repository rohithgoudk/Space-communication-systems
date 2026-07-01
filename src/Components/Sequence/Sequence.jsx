import { useEffect, useRef, useState } from "react";
import "./Sequence.css";
import home2 from "../../assets/Home2.webp"
import home3 from "../../assets/Home3.webp"
import home4 from "../../assets/Home4.webp"
import home5 from "../../assets/Home5.webp"
import home1 from "../../assets/Home1.webp"



/* Unsplash source photography (free license, no attribution required).
   Part of the same "Carrier Wave" photo system used across the site. */
const IMG = {
  satelliteOrbit:
    home1,
  dishField:
    home3,
  controlRoom:
    home4,
  serverCables:
    home5,
  nebula:
    home2,
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
    <Tag ref={ref} className={`sq-reveal ${visible ? "is-visible" : ""} ${className}`} style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}>
      {children}
    </Tag>
  );
}

const SEQUENCE = [
  {
    step: "Acquisition",
    detail: "The antenna slews to the predicted ephemeris and sweeps the beam until carrier power rises above threshold. Doppler shift is predicted in advance so the receiver isn't searching blind.",
    metric: "Typical lock time: 8–40s",
    image: IMG.dishField,
    alt: "Large parabolic ground-station dish sweeping the sky",
  },
  {
    step: "Handshake",
    detail: "Spacecraft and station exchange ranging tones to confirm identity and lock the coding scheme for the pass. This is also when link margin is first sampled.",
    metric: "Ranging tones: 2-way coherent",
    image: IMG.satelliteOrbit,
    alt: "Satellite silhouetted against the curve of Earth in orbit",
  },
  {
    step: "Telemetry Lock",
    detail: "Bit and frame sync settle in; housekeeping data starts streaming while the link margin is logged in real time and fed back into the next pass's prediction model.",
    metric: "Frame sync: <2s after carrier lock",
    image: IMG.controlRoom,
    alt: "Bank of monitoring displays in a control room",
  },
  {
    step: "Data Return",
    detail: "Science and engineering payloads queue for downlink, prioritized by onboard storage pressure and time remaining until the next pass.",
    metric: "Priority queue: storage-pressure weighted",
    image: IMG.serverCables,
    alt: "Network cables feeding into a data center rack",
  },
];

export default function Sequence() {
  const [openIndex, setOpenIndex] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const active = SEQUENCE[openIndex];

  return (
    <>
      <div className="sq-page">
        <section className="sq-hero">
          <img
            className="sq-hero__photo"
            src={IMG.satelliteOrbit}
            alt=""
            role="presentation"
            loading="eager"
            fetchpriority="high"
            style={{ transform: `translateY(${Math.min(scrollY * 0.03, 30)}px) scale(1.06)` }}
          />
          <div className="sq-hero__scrim" aria-hidden="true" />
          <div className="sq-hero__inner">
            <p className="sq-eyebrow">Link Sequence</p>
            <h1 className="sq-hero__headline">From first carrier<br />to data on the ground.</h1>
            <p className="sq-hero__sub">
              Every pass follows the same four phases, whether it's a ten-minute LEO
              window or a six-hour deep space contact. Here's what happens, in order.
            </p>
          </div>
        </section>

        {/* PROGRESS RAIL */}
        <section className="sq-section">
          <div className="sq-rail">
            {SEQUENCE.map((s, i) => (
              <button
                key={s.step}
                className={`sq-rail__node ${openIndex === i ? "is-active" : ""} ${i < openIndex ? "is-done" : ""}`}
                onClick={() => setOpenIndex(i)}
              >
                <span className="sq-rail__dot" />
                <span className="sq-rail__label">{s.step}</span>
              </button>
            ))}
            <div className="sq-rail__track" aria-hidden="true">
              <div className="sq-rail__progress" style={{ width: `${(openIndex / (SEQUENCE.length - 1)) * 100}%` }} />
            </div>
          </div>

          {/* ACCORDION DETAIL, now with a step photo */}
          <div className="sq-detail">
            <div className="sq-detail-card">
              <span className="sq-detail-index">{String(openIndex + 1).padStart(2, "0")} / {String(SEQUENCE.length).padStart(2, "0")}</span>
              <h2>{active.step}</h2>
              <p>{active.detail}</p>
              <div className="sq-detail-metric">
                <span className="sq-detail-metric__dot" />
                {active.metric}
              </div>
              <div className="sq-detail-nav">
                <button disabled={openIndex === 0} onClick={() => setOpenIndex((v) => Math.max(0, v - 1))}>← Previous</button>
                <button disabled={openIndex === SEQUENCE.length - 1} onClick={() => setOpenIndex((v) => Math.min(SEQUENCE.length - 1, v + 1))}>Next →</button>
              </div>
            </div>

            <div className="sq-detail-figure">
              <img key={active.image} src={active.image} alt={active.alt} loading="lazy" />
              <div className="sq-detail-figure__tag">
                <span className="sq-detail-metric__dot" /> PHASE {String(openIndex + 1).padStart(2, "0")}
              </div>
            </div>
          </div>
        </section>

        {/* FULL TIMELINE (scroll reveal list, for those who want to read it all) */}
        <section className="sq-timeline-section">
          <img className="sq-timeline-section__photo" src={IMG.nebula} alt="" role="presentation" loading="lazy" />
          <div className="sq-timeline-section__scrim" aria-hidden="true" />
          <div className="sq-section sq-timeline-section__inner">
            <Reveal className="sq-section__head">
              <p className="sq-eyebrow">Full Walkthrough</p>
              <h2>All four phases, end to end</h2>
            </Reveal>
            <ol className="sq-timeline">
              {SEQUENCE.map((s, i) => (
                <Reveal as="li" key={s.step} delay={i * 110} className="sq-timeline__item">
                  <span className="sq-timeline__index">{String(i + 1).padStart(2, "0")}</span>
                  <div className="sq-timeline__thumb">
                    <img src={s.image} alt={s.alt} loading="lazy" />
                  </div>
                  <div className="sq-timeline__body">
                    <h3>{s.step}</h3>
                    <p>{s.detail}</p>
                    <span className="sq-timeline__metric">{s.metric}</span>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* CTA */}
        <section className="sq-cta">
          <img className="sq-cta__photo" src={IMG.dishField} alt="" role="presentation" loading="lazy" />
          <div className="sq-cta__scrim" aria-hidden="true" />
          <Reveal className="sq-cta__inner">
            <h2>Want to see your mission's pass schedule modeled?</h2>
            <p>We'll simulate acquisition through data return against your real orbit.</p>
            <a href="/contact" className="sq-btn">Request a Pass Simulation</a>
          </Reveal>
        </section>
      </div>
    </>
  );
}