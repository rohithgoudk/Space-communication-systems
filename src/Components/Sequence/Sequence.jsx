import { useEffect, useRef, useState } from "react";
import "./Sequence.css";

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
  },
  {
    step: "Handshake",
    detail: "Spacecraft and station exchange ranging tones to confirm identity and lock the coding scheme for the pass. This is also when link margin is first sampled.",
    metric: "Ranging tones: 2-way coherent",
  },
  {
    step: "Telemetry Lock",
    detail: "Bit and frame sync settle in; housekeeping data starts streaming while the link margin is logged in real time and fed back into the next pass's prediction model.",
    metric: "Frame sync: <2s after carrier lock",
  },
  {
    step: "Data Return",
    detail: "Science and engineering payloads queue for downlink, prioritized by onboard storage pressure and time remaining until the next pass.",
    metric: "Priority queue: storage-pressure weighted",
  },
];

export default function Sequence() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <>
      <div className="sq-page">
        <section className="sq-hero">
          <p className="sq-eyebrow">Link Sequence</p>
          <h1 className="sq-hero__headline">From first carrier<br />to data on the ground.</h1>
          <p className="sq-hero__sub">
            Every pass follows the same four phases, whether it's a ten-minute LEO
            window or a six-hour deep space contact. Here's what happens, in order.
          </p>
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

          {/* ACCORDION DETAIL */}
          <div className="sq-detail-card">
            <span className="sq-detail-index">{String(openIndex + 1).padStart(2, "0")} / {String(SEQUENCE.length).padStart(2, "0")}</span>
            <h2>{SEQUENCE[openIndex].step}</h2>
            <p>{SEQUENCE[openIndex].detail}</p>
            <div className="sq-detail-metric">
              <span className="sq-detail-metric__dot" />
              {SEQUENCE[openIndex].metric}
            </div>
            <div className="sq-detail-nav">
              <button disabled={openIndex === 0} onClick={() => setOpenIndex((v) => Math.max(0, v - 1))}>← Previous</button>
              <button disabled={openIndex === SEQUENCE.length - 1} onClick={() => setOpenIndex((v) => Math.min(SEQUENCE.length - 1, v + 1))}>Next →</button>
            </div>
          </div>
        </section>

        {/* FULL TIMELINE (scroll reveal list, for those who want to read it all) */}
        <section className="sq-section sq-timeline-section">
          <Reveal className="sq-section__head">
            <p className="sq-eyebrow">Full Walkthrough</p>
            <h2>All four phases, end to end</h2>
          </Reveal>
          <ol className="sq-timeline">
            {SEQUENCE.map((s, i) => (
              <Reveal as="li" key={s.step} delay={i * 110} className="sq-timeline__item">
                <span className="sq-timeline__index">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{s.step}</h3>
                  <p>{s.detail}</p>
                  <span className="sq-timeline__metric">{s.metric}</span>
                </div>
              </Reveal>
            ))}
          </ol>
        </section>

        {/* CTA */}
        <section className="sq-cta">
          <Reveal>
            <h2>Want to see your mission's pass schedule modeled?</h2>
            <p>We'll simulate acquisition through data return against your real orbit.</p>
            <a href="/contact" className="sq-btn">Request a Pass Simulation</a>
          </Reveal>
        </section>
      </div>
    </>
  );
}