import { useEffect, useRef, useState } from "react";
import "./Contact.css";

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
    <Tag ref={ref} className={`ct-reveal ${visible ? "is-visible" : ""} ${className}`} style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}>
      {children}
    </Tag>
  );
}

const OFFICES = [
  { city: "Pasadena, USA", role: "Deep Space Ops", time: "UTC -8" },
  { city: "Darmstadt, Germany", role: "Network Engineering", time: "UTC +1" },
  { city: "Canberra, Australia", role: "Ground Segment", time: "UTC +10" },
  { city: "Hyderabad, India", role: "Mission Integration", time: "UTC +5:30" },
];

const FAQ = [
  { q: "How long does integration take?", a: "Most missions clear sandbox validation and run a live test pass within 3–6 weeks of first contact, depending on protocol complexity." },
  { q: "Do you support CubeSats?", a: "Yes — the mesh constellation and ground segment both support small-sat link budgets, with simplified onboarding for low-power transponders." },
  { q: "What happens if a station goes down mid-pass?", a: "The network automatically reroutes to the next-best node or station within a fraction of a second, logging the handoff for your mission telemetry." },
  { q: "Can we bring our own ground station into the mesh?", a: "Yes, third-party stations can be federated into the network after a calibration and security review." },
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", org: "", message: "" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((er) => ({ ...er, [name]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = {};
    if (!form.name.trim()) next.name = "Name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Enter a valid email";
    if (!form.message.trim()) next.message = "Tell us a little about your mission";
    setErrors(next);
    if (Object.keys(next).length === 0) {
      setSubmitted(true);
    }
  };

  return (
    <>
      <div className="ct-page">
        <section className="ct-hero">
          <p className="ct-eyebrow">Contact</p>
          <h1 className="ct-hero__headline">Let's get your<br />mission on the link.</h1>
          <p className="ct-hero__sub">
            Tell us the orbit, the data volume, and the deadline. A network engineer
            will map it to a station, a relay path, and a margin you can trust.
          </p>
        </section>

        <section className="ct-section ct-main-grid">
          {/* FORM */}
          <Reveal className="ct-form-card">
            {submitted ? (
              <div className="ct-success">
                <span className="ct-success__dot" />
                <h2>Transmission received.</h2>
                <p>A network engineer will respond within one business day.</p>
                <button className="ct-btn" onClick={() => setSubmitted(false)}>Send another message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="ct-field">
                  <label htmlFor="name">Name</label>
                  <input id="name" name="name" value={form.name} onChange={handleChange} placeholder="Dr. Jane Okoro" className={errors.name ? "has-error" : ""} />
                  {errors.name && <span className="ct-error">{errors.name}</span>}
                </div>
                <div className="ct-field">
                  <label htmlFor="email">Email</label>
                  <input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="jane@mission.org" className={errors.email ? "has-error" : ""} />
                  {errors.email && <span className="ct-error">{errors.email}</span>}
                </div>
                <div className="ct-field">
                  <label htmlFor="org">Organization</label>
                  <input id="org" name="org" value={form.org} onChange={handleChange} placeholder="Optional" />
                </div>
                <div className="ct-field">
                  <label htmlFor="message">Mission details</label>
                  <textarea id="message" name="message" rows="5" value={form.message} onChange={handleChange} placeholder="Orbit, data volume, target launch date…" className={errors.message ? "has-error" : ""} />
                  {errors.message && <span className="ct-error">{errors.message}</span>}
                </div>
                <button type="submit" className="ct-btn ct-btn--full">
                  Transmit Message
                  <span className="ct-btn-arrow">→</span>
                </button>
              </form>
            )}
          </Reveal>

          {/* OFFICES */}
          <Reveal delay={120} className="ct-offices">
            <h2>Network Operations Centers</h2>
            <ul>
              {OFFICES.map((o) => (
                <li key={o.city} className="ct-office">
                  <span className="ct-office__dot" />
                  <div>
                    <div className="ct-office__city">{o.city}</div>
                    <div className="ct-office__role">{o.role} · {o.time}</div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="ct-direct">
              <span className="ct-eyebrow">Direct Line</span>
              <a href="mailto:integration@meridianlink.example">integration@meridianlink.example</a>
            </div>
          </Reveal>
        </section>

        {/* FAQ */}
        <section className="ct-section ct-faq-section">
          <Reveal className="ct-section__head">
            <p className="ct-eyebrow">FAQ</p>
            <h2>Before you reach out</h2>
          </Reveal>
          <div className="ct-faq-list">
            {FAQ.map((f, i) => (
              <Reveal key={f.q} delay={i * 70} className={`ct-faq-item ${openFaq === i ? "is-open" : ""}`}>
                <button className="ct-faq-question" onClick={() => setOpenFaq(openFaq === i ? -1 : i)}>
                  {f.q}
                  <span className="ct-faq-icon">{openFaq === i ? "−" : "+"}</span>
                </button>
                <div className="ct-faq-answer" style={{ maxHeight: openFaq === i ? "200px" : "0px" }}>
                  <p>{f.a}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}