import { useState, useEffect, useRef } from "react";
import "./Dashboard.css";
import logo from "../../assets/Stacklyimg1.webp"
import { useNavigate } from "react-router-dom";

const siteAccents = {
  "Deep Space": "#5EEAD4", "Lunar": "#9DB4FF", "LEO": "#5D8AFF",
  "Mars Relay": "#C49A6C", "GEO Optical": "#FFB454", "Polar": "#8B9DAF",
};

const excavationsData = [
  { id: 1, name: "Voyager 1 Uplink", region: "Deep Space", site: "DSS-14 Goldstone", type: "X-band", status: "Active", progress: 72, endDate: "Ongoing", budget: "$450,000", director: "Dr. Sarah Chen" },
  { id: 2, name: "Artemis Lunar Relay", region: "Lunar", site: "Gateway Node", type: "Ka-band", status: "Field Work", progress: 38, endDate: "Aug 2026", budget: "$320,000", director: "Dr. Nikos Papadopoulos" },
  { id: 3, name: "Starlink Mesh Sync", region: "LEO", site: "Constellation Shell B", type: "Mesh Relay", status: "Completed", progress: 100, endDate: "Mar 2026", budget: "$580,000", director: "Dr. Elena Rodriguez" },
  { id: 4, name: "Mars Relay Network", region: "Mars Relay", site: "DSS-63 Madrid", type: "UHF Relay", status: "Active", progress: 55, endDate: "Nov 2026", budget: "$390,000", director: "Dr. James O'Neill" },
  { id: 5, name: "LCRD-2 Crosslink Survey", region: "GEO Optical", site: "GEO Laser Relay", type: "Optical", status: "Review", progress: 89, endDate: "Jul 2026", budget: "$275,000", director: "Dr. Priya Sharma" },
  { id: 6, name: "Polar Ground Segment", region: "Polar", site: "Svalbard Station", type: "Field Terminal", status: "Active", progress: 61, endDate: "Oct 2026", budget: "$520,000", director: "Dr. Marco Ferretti" },
  { id: 7, name: "New Horizons Pass", region: "Deep Space", site: "DSS-43 Canberra", type: "X-band", status: "Field Work", progress: 45, endDate: "Sep 2026", budget: "$310,000", director: "Dr. Ana Flores" },
];

const fieldTeam = [
  { name: "Dr. Sarah Chen", role: "Lead Flight Controller — Deep Space", experience: 14, avatar: "SC", status: "active", projects: 3, speciality: "X-band Uplink & Telemetry", email: "s.chen@meridianlink.io" },
  { name: "Dr. Nikos Papadopoulos", role: "Network Director — Lunar", experience: 11, avatar: "NP", status: "active", projects: 2, speciality: "Cislunar Relay Architecture", email: "n.papadopoulos@meridianlink.io" },
  { name: "Dr. Elena Rodriguez", role: "Mesh Specialist — LEO", experience: 9, avatar: "ER", status: "away", projects: 2, speciality: "Constellation Routing", email: "e.rodriguez@meridianlink.io" },
  { name: "Dr. James O'Neill", role: "RF Systems Lead — Mars Relay", experience: 16, avatar: "JO", status: "active", projects: 2, speciality: "UHF Relay & Ranging", email: "j.oneill@meridianlink.io" },
  { name: "Dr. Priya Sharma", role: "Optical Comms Specialist — GEO", experience: 8, avatar: "PS", status: "active", projects: 1, speciality: "Laser Crosslink Pointing", email: "p.sharma@meridianlink.io" },
  { name: "Dr. Marco Ferretti", role: "Ground Segment Engineer — Polar", experience: 12, avatar: "MF", status: "active", projects: 1, speciality: "Field Terminal Deployment", email: "m.ferretti@meridianlink.io" },
];

const artifactsData = [
  { id: "SC-001", name: "Voyager 1 Probe", site: "DSS-14 Goldstone", region: "Deep Space", era: "Heliopause Class", date: "Launched 1977", condition: "Excellent", status: "Catalogued" },
  { id: "SC-002", name: "Artemis Gateway Module", site: "Lunar Orbit", region: "Lunar", era: "Cislunar Class", date: "Launched 2025", condition: "Good", status: "Under Study" },
  { id: "SC-003", name: "Starlink Shell-B Sat #1142", site: "LEO Constellation", region: "LEO", era: "Mesh Relay Class", date: "Launched 2024", condition: "Fragmented", status: "Restored" },
  { id: "SC-004", name: "Mars Relay Orbiter", site: "Ur Relay Node", region: "Mars Relay", era: "Areostationary Class", date: "Launched 2021", condition: "Excellent", status: "Catalogued" },
  { id: "SC-005", name: "LCRD Optical Terminal", site: "GEO Laser Relay", region: "GEO Optical", era: "Optical Crosslink", date: "Launched 2021", condition: "Good", status: "Under Study" },
  { id: "SC-006", name: "Polar Field Terminal", site: "Svalbard Station", region: "Polar", era: "Ground Segment", date: "Deployed 2023", condition: "Good", status: "Catalogued" },
  { id: "SC-007", name: "New Horizons Probe", site: "DSS-43 Canberra", region: "Deep Space", era: "Kuiper Belt Class", date: "Launched 2006", condition: "Excellent", status: "On Display" },
  { id: "SC-008", name: "Starlink Shell-B Sat #0931", site: "LEO Constellation", region: "LEO", era: "Mesh Relay Class", date: "Launched 2024", condition: "Good", status: "Catalogued" },
];

const researchPapers = [
  { title: "Adaptive Coding Gains for Ka-band Lunar Relay", authors: "Papadopoulos, N. et al.", journal: "IEEE Transactions on Aerospace Comms", year: 2026, status: "Published", citations: 12 },
  { title: "Ranging Tone Precision in UHF Mars Relay Passes", authors: "O'Neill, J., Al-Rashid, M.", journal: "Journal of Spacecraft & Rockets", year: 2026, status: "Published", citations: 7 },
  { title: "Doppler Compensation for High-Velocity LEO Mesh Handoff", authors: "Chen, S. et al.", journal: "Acta Astronautica", year: 2026, status: "In Review", citations: 0 },
  { title: "Point-Ahead Accuracy in GEO Optical Crosslinks: New Field Results", authors: "Sharma, P., Khan, R.", journal: "Optical Engineering", year: 2025, status: "Published", citations: 31 },
  { title: "Mesh Routing Resilience Under Eclipse Conditions", authors: "Rodriguez, E., Flores, A.", journal: "International Journal of Satellite Comms", year: 2025, status: "Published", citations: 44 },
  { title: "Field-Deployable Terminals for Polar Coverage: Lessons from Svalbard", authors: "Ferretti, M. et al.", journal: "Polar Engineering Review", year: 2026, status: "In Draft", citations: 0 },
];

const scheduleEvents = [
  { date: "Jun 21", event: "Voyager 1 — Extended mission pass window opens", site: "Goldstone, USA", type: "urgent" },
  { date: "Jun 25", event: "Artemis Gateway — Relay structural diagnostics", site: "Lunar Orbit", type: "normal" },
  { date: "Jul 2", event: "Mars Relay — Ranging tone calibration session", site: "Madrid, Spain", type: "normal" },
  { date: "Jul 10", event: "Team debrief: Starlink mesh sync final report", site: "Virtual", type: "meeting" },
  { date: "Jul 18", event: "GEO Optical — Point-ahead tracking survey", site: "GEO Laser Relay", type: "normal" },
  { date: "Aug 5", event: "Lunar Relay — 3D coverage model final review", site: "Gateway Node", type: "normal" },
  { date: "Aug 14", event: "Annual network directors' symposium", site: "London, UK", type: "meeting" },
  { date: "Sep 1", event: "Polar Ground Segment — Sector B deployment resumes", site: "Svalbard, Norway", type: "normal" },
  { date: "Oct 15", event: "Mars Relay — Phase 1 report submission deadline", site: "Madrid, Spain", type: "urgent" },
];

const budgetData = [
  { site: "Voyager 1 Uplink", allocated: 450000, spent: 284000, region: "Deep Space" },
  { site: "Artemis Lunar Relay", allocated: 320000, spent: 108000, region: "Lunar" },
  { site: "Starlink Mesh Sync", allocated: 580000, spent: 580000, region: "LEO" },
  { site: "Mars Relay Network", allocated: 390000, spent: 201000, region: "Mars Relay" },
  { site: "LCRD-2 Crosslink Survey", allocated: 275000, spent: 241000, region: "GEO Optical" },
  { site: "Polar Ground Segment", allocated: 520000, spent: 298000, region: "Polar" },
  { site: "New Horizons Pass", allocated: 310000, spent: 132000, region: "Deep Space" },
];

const publications = [
  { title: "Meridian Link Annual Network Review 2026", type: "Annual Report", year: 2026, pages: 128, downloads: 3841 },
  { title: "Handbook of Ground Station Operations", type: "Technical Manual", year: 2025, pages: 264, downloads: 7120 },
  { title: "Deep Space X-band Links: A Comparative Study", type: "Monograph", year: 2026, pages: 312, downloads: 2450 },
  { title: "Mesh Relay Engineering: Constellation Routing in Practice", type: "Field Guide", year: 2026, pages: 96, downloads: 5633 },
  { title: "Link Margin Ethics in Active Mission Contexts", type: "Proceedings", year: 2025, pages: 180, downloads: 1920 },
];

const liveFeed = [
  { icon: "🛰️", text: "Voyager 1 telemetry frame sync re-acquired after weak-signal dropout", time: "2h ago", type: "discovery" },
  { icon: "📡", text: "New ranging tone data decoded from Mars Relay — confirming orbit insertion", time: "4h ago", type: "research" },
  { icon: "✅", text: "Starlink mesh sync completed — final routing report published", time: "Yesterday", type: "complete" },
  { icon: "⚠️", text: "Weather delay at Svalbard terminal — uplink paused until conditions improve", time: "Yesterday", type: "alert" },
  { icon: "🔬", text: "Doppler analysis reveals new handoff pattern in LEO constellation shell", time: "2d ago", type: "update" },
];

const navItems = [
  { icon: "▦", label: "Dashboard", id: "dashboard" },
  { icon: "🛰️", label: "Missions", id: "excavations" },
  { icon: "🛡", label: "Flight Teams", id: "teams" },
  { icon: "📡", label: "Spacecraft", id: "artifacts" },
  { icon: "🔬", label: "Research", id: "research" },
  { icon: "🗓️", label: "Schedule", id: "schedule" },
  { icon: "💰", label: "Budget", id: "budget" },
  { icon: "📚", label: "Publications", id: "publications" },
  { icon: "⚙️", label: "Settings", id: "settings" },
];

const statusColors = {
  Active: "status-active", "Field Work": "status-field",
  Completed: "status-complete", Review: "status-review",
};

const conditionColor = { Excellent: "#22c55e", Good: "#f59e0b", Fragmented: "#ef4444" };
const paperStatusColor = { Published: "#22c55e", "In Review": "#f59e0b", "In Draft": "#8B9DAF" };
const scheduleTypeColor = { urgent: "#ef4444", normal: "#5EEAD4", meeting: "#8B9DAF" };

function fmt(n) { return "$" + n.toLocaleString(); }

// ─── PAGE COMPONENTS ───────────────────────────────────────────────

function DashboardPage({ navigate }) {
  return (
    <>
      <section className="stats-grid">
        {[
          { icon: "🛰️", delta: "+3 this month", value: "12", label: "Active Missions", bar: 72, accent: true },
          { icon: "📡", delta: "+42 this week", value: "2,847", label: "Spacecraft Tracked", bar: 64 },
          { icon: "💰", delta: "On track", value: "$4.2M", label: "Network Funding", bar: 88 },
          { icon: "🌍", delta: "+2 this quarter", value: "18", label: "Active Coverage Zones", bar: 90 },
        ].map((s, i) => (
          <div key={i} className={`stat-card ${s.accent ? "stat-accent" : ""}`} onClick={() => navigate("/404")} style={{ cursor: "pointer" }}>
            <div className="stat-top"><span className="stat-icon">{s.icon}</span><span className="stat-delta up">{s.delta}</span></div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
            <div className="stat-bar"><div className="stat-bar-fill" style={{ width: `${s.bar}%` }} /></div>
          </div>
        ))}
      </section>

      <section className="mid-grid">
        <div className="card">
          <div className="card-header">
            <div><h2 className="card-title">Active Missions</h2><p className="card-sub">Current network link operations</p></div>
          </div>
          <div className="table-wrapper">
            <table className="excavations-table">
              <thead><tr><th>Mission</th><th>Region</th><th>Type</th><th>Status</th><th>Progress</th><th>End Date</th><th>Budget</th></tr></thead>
              <tbody>
                {excavationsData.slice(0, 5).map(t => (
                  <tr key={t.id} onClick={() => navigate("/404")} style={{ cursor: "pointer" }}>
                    <td><div className="t-name">{t.name}</div><div className="t-sub">{t.site} · {t.director}</div></td>
                    <td><span className="region-tag" style={{ color: siteAccents[t.region], borderColor: siteAccents[t.region], background: `${siteAccents[t.region]}1f` }}>{t.region}</span></td>
                    <td className="type-col">{t.type}</td>
                    <td><span className={`status-badge ${statusColors[t.status]}`}>{t.status}</span></td>
                    <td><div className="progress-wrap"><div className="progress-bar"><div className="progress-fill" style={{ width: `${t.progress}%` }} /></div><span className="progress-pct">{t.progress}%</span></div></td>
                    <td className="date-col">{t.endDate}</td>
                    <td className="budget-col">{t.budget}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card">
          <div className="card-header"><div><h2 className="card-title">Live Feed</h2><p className="card-sub">Network updates</p></div></div>
          <ul className="activity-list">
            {liveFeed.map((a, i) => (
              <li key={i} className={`activity-item act-${a.type}`} onClick={() => navigate("/404")} style={{ cursor: "pointer" }}>
                <span className="act-icon">{a.icon}</span>
                <div><p className="act-text">{a.text}</p><span className="act-time">{a.time}</span></div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bottom-grid">
        <div className="card">
          <div className="card-header"><div><h2 className="card-title">Flight Team</h2><p className="card-sub">Active controllers</p></div></div>
          <ul className="team-list">
            {fieldTeam.slice(0, 4).map((m, i) => (
              <li key={i} className="team-item" onClick={() => navigate("/404")} style={{ cursor: "pointer" }}>
                <div className="member-avatar">{m.avatar}<span className={`online-dot dot-${m.status}`} /></div>
                <div className="member-info"><div className="member-name">{m.name}</div><div className="member-role">{m.role}</div></div>
                <div className="member-projects"><span className="proj-count">{m.experience}</span><span className="proj-label">yrs</span></div>
              </li>
            ))}
          </ul>
        </div>
        <div className="card">
          <div className="card-header"><div><h2 className="card-title">Upcoming Deadlines</h2><p className="card-sub">Next 60 days</p></div></div>
          <ul className="milestone-list">
            {[
              { site: "Voyager 1 Uplink", event: "Extended pass window — Phase 2", date: "Jun 21", done: false, urgent: true },
              { site: "Artemis Lunar Relay", event: "Relay structural diagnostics", date: "Jun 25", done: false, urgent: false },
              { site: "Mars Relay Network", event: "Ranging tone calibration", date: "Jul 2", done: false, urgent: false },
              { site: "Artemis Lunar Relay", event: "3D coverage model — Final review", date: "Aug 05", done: false, urgent: false },
              { site: "Starlink Mesh Sync", event: "Final routing report submission", date: "Jun 14", done: true, urgent: false },
            ].map((m, i) => (
              <li key={i} className={`milestone-item ${m.done ? "ms-done" : ""} ${m.urgent ? "ms-urgent" : ""}`} onClick={() => navigate("/404")} style={{ cursor: "pointer" }}>
                <div className="ms-date"><span>{m.date.split(" ")[0]}</span><span>{m.date.split(" ")[1]}</span></div>
                <div className="ms-line"><div className="ms-dot" /></div>
                <div className="ms-body"><div className="ms-event">{m.event}</div><div className="ms-project">{m.site}</div></div>
                {m.urgent && <span className="ms-tag">Urgent</span>}
                {m.done && <span className="ms-tag ms-done-tag">Done</span>}
              </li>
            ))}
          </ul>
        </div>
        <div className="card">
          <div className="card-header"><div><h2 className="card-title">Coverage Distribution</h2><p className="card-sub">By region</p></div></div>
          <div className="donut-chart" onClick={() => navigate("/404")} style={{ cursor: "pointer" }}>
            <svg viewBox="0 0 120 120" className="donut-svg">
              <circle cx="60" cy="60" r="48" fill="none" stroke="#0f1830" strokeWidth="16" />
              <circle cx="60" cy="60" r="48" fill="none" stroke="#5EEAD4" strokeWidth="16" strokeDasharray="65 212" strokeDashoffset="0" strokeLinecap="round" />
              <circle cx="60" cy="60" r="48" fill="none" stroke="#5D8AFF" strokeWidth="16" strokeDasharray="57 212" strokeDashoffset="-65" strokeLinecap="round" />
              <circle cx="60" cy="60" r="48" fill="none" stroke="#9DB4FF" strokeWidth="16" strokeDasharray="49 212" strokeDashoffset="-122" strokeLinecap="round" />
              <circle cx="60" cy="60" r="48" fill="none" stroke="#C49A6C" strokeWidth="16" strokeDasharray="41 212" strokeDashoffset="-171" strokeLinecap="round" />
              <text x="60" y="56" textAnchor="middle" className="donut-num">18</text>
              <text x="60" y="68" textAnchor="middle" className="donut-label">Zones</text>
            </svg>
          </div>
          <ul className="legend-list">
            {[{ color: "#5EEAD4", label: "Deep Space", count: 5 }, { color: "#5D8AFF", label: "LEO", count: 4 }, { color: "#9DB4FF", label: "Lunar", count: 4 }, { color: "#C49A6C", label: "Mars Relay", count: 3 }, { color: "#FFB454", label: "GEO Optical", count: 2 }].map((l, i) => (
              <li key={i} className="legend-item" onClick={() => navigate("/404")} style={{ cursor: "pointer" }}>
                <span className="legend-dot" style={{ background: l.color }} />
                <span className="legend-label">{l.label}</span>
                <span className="legend-count">{l.count}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

function ExcavationsPage({ navigate }) {
  const [filter, setFilter] = useState("All");
  const statuses = ["All", "Active", "Field Work", "Review", "Completed"];
  const filtered = filter === "All" ? excavationsData : excavationsData.filter(e => e.status === filter);
  return (
    <>
      <section className="stats-grid">
        {[
          { icon: "🛰️", value: excavationsData.length, label: "Total Missions", bar: 100 },
          { icon: "🟢", value: excavationsData.filter(e => e.status === "Active").length, label: "Active Now", bar: 60, accent: true },
          { icon: "📍", value: excavationsData.filter(e => e.status === "Field Work").length, label: "Field Work", bar: 40 },
          { icon: "✅", value: excavationsData.filter(e => e.status === "Completed").length, label: "Completed", bar: 20 },
        ].map((s, i) => (
          <div key={i} className={`stat-card ${s.accent ? "stat-accent" : ""}`} onClick={() => navigate("/404")} style={{ cursor: "pointer" }}>
            <div className="stat-top"><span className="stat-icon">{s.icon}</span></div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
            <div className="stat-bar"><div className="stat-bar-fill" style={{ width: `${s.bar}%` }} /></div>
          </div>
        ))}
      </section>
      <div className="card">
        <div className="card-header">
          <div><h2 className="card-title">All Missions</h2><p className="card-sub">Full list of network link operations</p></div>
          <div className="filter-row" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {statuses.map(s => (
              <button key={s} className={`btn-outline ${filter === s ? "btn-active" : ""}`} onClick={() => setFilter(s)}
                style={filter === s ? { borderColor: "#5EEAD4", color: "#5EEAD4" } : {}}>{s}</button>
            ))}
          </div>
        </div>
        <div className="table-wrapper">
          <table className="excavations-table">
            <thead><tr><th>Mission</th><th>Region</th><th>Type</th><th>Status</th><th>Progress</th><th>Director</th><th>End Date</th><th>Budget</th></tr></thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t.id} onClick={() => navigate("/404")} style={{ cursor: "pointer" }}>
                  <td><div className="t-name">{t.name}</div><div className="t-sub">{t.site}</div></td>
                  <td><span className="region-tag" style={{ color: siteAccents[t.region], borderColor: siteAccents[t.region], background: `${siteAccents[t.region]}1f` }}>{t.region}</span></td>
                  <td className="type-col">{t.type}</td>
                  <td><span className={`status-badge ${statusColors[t.status]}`}>{t.status}</span></td>
                  <td><div className="progress-wrap"><div className="progress-bar"><div className="progress-fill" style={{ width: `${t.progress}%` }} /></div><span className="progress-pct">{t.progress}%</span></div></td>
                  <td className="date-col" style={{ fontSize: 12 }}>{t.director}</td>
                  <td className="date-col">{t.endDate}</td>
                  <td className="budget-col">{t.budget}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function TeamsPage({ navigate }) {
  return (
    <>
      <section className="stats-grid">
        {[
          { icon: "👥", value: fieldTeam.length, label: "Controllers", bar: 80 },
          { icon: "🟢", value: fieldTeam.filter(m => m.status === "active").length, label: "Online Now", bar: 85, accent: true },
          { icon: "📋", value: fieldTeam.reduce((a, m) => a + m.projects, 0), label: "Active Missions", bar: 70 },
          { icon: "🏅", value: Math.round(fieldTeam.reduce((a, m) => a + m.experience, 0) / fieldTeam.length), label: "Avg. Yrs Exp.", bar: 75 },
        ].map((s, i) => (
          <div key={i} className={`stat-card ${s.accent ? "stat-accent" : ""}`} onClick={() => navigate("/404")} style={{ cursor: "pointer" }}>
            <div className="stat-top"><span className="stat-icon">{s.icon}</span></div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
            <div className="stat-bar"><div className="stat-bar-fill" style={{ width: `${s.bar}%` }} /></div>
          </div>
        ))}
      </section>
      <div className="card">
        <div className="card-header"><div><h2 className="card-title">Flight Controllers</h2><p className="card-sub">Full team directory</p></div></div>
        <div className="team-grid">
          {fieldTeam.map((m, i) => (
            <div key={i} className="team-card"
              onClick={() => navigate("/404")}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(94,234,212,0.4)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "none"; }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
                <div className="member-avatar" style={{ width: 46, height: 46, fontSize: 14 }}>{m.avatar}<span className={`online-dot dot-${m.status}`} /></div>
                <div>
                  <div className="member-name" style={{ fontSize: 15 }}>{m.name}</div>
                  <div className="member-role">{m.role}</div>
                </div>
              </div>
              <div style={{ fontSize: 12.5, color: "rgba(231,236,243,0.55)", lineHeight: 1.9 }}>
                <div>🎓 {m.speciality}</div>
                <div>✉️ {m.email}</div>
                <div>📂 {m.projects} active mission{m.projects !== 1 ? "s" : ""} · {m.experience} yrs experience</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function ArtifactsPage({ navigate }) {
  const [search, setSearch] = useState("");
  const filtered = artifactsData.filter(a => a.name.toLowerCase().includes(search.toLowerCase()) || a.site.toLowerCase().includes(search.toLowerCase()));
  return (
    <>
      <section className="stats-grid">
        {[
          { icon: "📡", value: "2,847", label: "Total Tracked", bar: 75, accent: true },
          { icon: "🔬", value: "142", label: "Under Analysis", bar: 55 },
          { icon: "🛰️", value: "89", label: "On Display", bar: 30 },
          { icon: "🔧", value: "34", label: "In Restoration", bar: 20 },
        ].map((s, i) => (
          <div key={i} className={`stat-card ${s.accent ? "stat-accent" : ""}`} onClick={() => navigate("/404")} style={{ cursor: "pointer" }}>
            <div className="stat-top"><span className="stat-icon">{s.icon}</span></div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
            <div className="stat-bar"><div className="stat-bar-fill" style={{ width: `${s.bar}%` }} /></div>
          </div>
        ))}
      </section>
      <div className="card">
        <div className="card-header">
          <div><h2 className="card-title">Spacecraft Registry</h2><p className="card-sub">Tracked assets across all stations</p></div>
          <div className="search-box" style={{ flex: "0 0 auto" }}>
            <span className="search-icon">🔍</span>
            <input placeholder="Search spacecraft…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="table-wrapper">
          <table className="excavations-table">
            <thead><tr><th>ID</th><th>Spacecraft</th><th>Station</th><th>Class</th><th>Date</th><th>Condition</th><th>Status</th></tr></thead>
            <tbody>
              {filtered.map(a => (
                <tr key={a.id} onClick={() => navigate("/404")} style={{ cursor: "pointer" }}>
                  <td className="type-col" style={{ fontSize: 11.5, fontFamily: "monospace" }}>{a.id}</td>
                  <td><div className="t-name">{a.name}</div><div className="t-sub">{a.region}</div></td>
                  <td className="date-col">{a.site}</td>
                  <td className="type-col" style={{ fontSize: 12 }}>{a.era}</td>
                  <td className="date-col">{a.date}</td>
                  <td><span style={{ color: conditionColor[a.condition], fontWeight: 700, fontSize: 12 }}>{a.condition}</span></td>
                  <td><span className="status-badge status-review" style={{ background: a.status === "Catalogued" ? "rgba(34,197,94,0.14)" : a.status === "On Display" ? "rgba(94,234,212,0.14)" : "rgba(245,158,11,0.14)", color: a.status === "Catalogued" ? "#86efac" : a.status === "On Display" ? "#5EEAD4" : "#fcd34d" }}>{a.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function ResearchPage({ navigate }) {
  return (
    <>
      <section className="stats-grid">
        {[
          { icon: "📄", value: researchPapers.length, label: "Active Papers", bar: 80, accent: true },
          { icon: "✅", value: researchPapers.filter(p => p.status === "Published").length, label: "Published", bar: 70 },
          { icon: "🔍", value: researchPapers.filter(p => p.status === "In Review").length, label: "In Review", bar: 20 },
          { icon: "📊", value: researchPapers.reduce((a, p) => a + p.citations, 0), label: "Total Citations", bar: 60 },
        ].map((s, i) => (
          <div key={i} className={`stat-card ${s.accent ? "stat-accent" : ""}`} onClick={() => navigate("/404")} style={{ cursor: "pointer" }}>
            <div className="stat-top"><span className="stat-icon">{s.icon}</span></div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
            <div className="stat-bar"><div className="stat-bar-fill" style={{ width: `${s.bar}%` }} /></div>
          </div>
        ))}
      </section>
      <div className="card">
        <div className="card-header"><div><h2 className="card-title">Technical Papers</h2><p className="card-sub">Active publications and submissions</p></div></div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {researchPapers.map((p, i) => (
            <div key={i} className="research-card"
              onClick={() => navigate("/404")}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(94,234,212,0.35)"; e.currentTarget.style.transform = "translateX(4px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "none"; }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 180 }}>
                  <div style={{ fontWeight: 700, color: "#e7ecf3", fontSize: 14, marginBottom: 4 }}>{p.title}</div>
                  <div style={{ fontSize: 12.5, color: "rgba(231,236,243,0.6)", marginBottom: 6 }}>{p.authors}</div>
                  <div style={{ fontSize: 12, color: "rgba(231,236,243,0.45)" }}>{p.journal} · {p.year}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, flexShrink: 0 }}>
                  <span style={{ background: paperStatusColor[p.status] + "22", color: paperStatusColor[p.status], borderRadius: 999, padding: "3px 10px", fontSize: 11.5, fontWeight: 700 }}>{p.status}</span>
                  {p.citations > 0 && <span style={{ fontSize: 12, color: "rgba(231,236,243,0.5)" }}>📊 {p.citations} citations</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function SchedulePage({ navigate }) {
  return (
    <>
      <div className="card">
        <div className="card-header"><div><h2 className="card-title">Pass Calendar</h2><p className="card-sub">All upcoming deadlines and link windows</p></div></div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {scheduleEvents.map((ev, i) => (
            <div key={i} className="schedule-row"
              onClick={() => navigate("/404")}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(94,234,212,0.04)"; e.currentTarget.style.transform = "translateX(4px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.transform = "none"; }}>
              <div style={{ width: 50, flexShrink: 0, textAlign: "center" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: scheduleTypeColor[ev.type], textTransform: "uppercase", letterSpacing: "0.04em" }}>{ev.date.split(" ")[0]}</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#e7ecf3" }}>{ev.date.split(" ")[1]}</div>
              </div>
              <div style={{ width: 3, alignSelf: "stretch", borderRadius: 999, background: scheduleTypeColor[ev.type], opacity: 0.7, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, color: "#e7ecf3", fontSize: 13.5 }}>{ev.event}</div>
                <div style={{ fontSize: 12, color: "rgba(231,236,243,0.55)", marginTop: 3 }}>📍 {ev.site}</div>
              </div>
              {ev.type === "urgent" && <span className="evt-tag" style={{ background: "rgba(239,68,68,0.16)", color: "#fca5a5" }}>Urgent</span>}
              {ev.type === "meeting" && <span className="evt-tag" style={{ background: "rgba(139,157,175,0.2)", color: "#8B9DAF" }}>Meeting</span>}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function BudgetPage({ navigate }) {
  const totalAllocated = budgetData.reduce((a, b) => a + b.allocated, 0);
  const totalSpent = budgetData.reduce((a, b) => a + b.spent, 0);
  const remaining = totalAllocated - totalSpent;
  return (
    <>
      <section className="stats-grid">
        {[
          { icon: "💰", value: fmt(totalAllocated), label: "Total Allocated", bar: 100, accent: true },
          { icon: "📉", value: fmt(totalSpent), label: "Total Spent", bar: Math.round((totalSpent / totalAllocated) * 100) },
          { icon: "✅", value: fmt(remaining), label: "Remaining", bar: Math.round((remaining / totalAllocated) * 100) },
          { icon: "📊", value: Math.round((totalSpent / totalAllocated) * 100) + "%", label: "Utilisation Rate", bar: Math.round((totalSpent / totalAllocated) * 100) },
        ].map((s, i) => (
          <div key={i} className={`stat-card ${s.accent ? "stat-accent" : ""}`} onClick={() => navigate("/404")} style={{ cursor: "pointer" }}>
            <div className="stat-top"><span className="stat-icon">{s.icon}</span></div>
            <div className="stat-value" style={{ fontSize: 22 }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
            <div className="stat-bar"><div className="stat-bar-fill" style={{ width: `${s.bar}%` }} /></div>
          </div>
        ))}
      </section>
      <div className="card">
        <div className="card-header"><div><h2 className="card-title">Budget by Mission</h2><p className="card-sub">Allocation vs spend</p></div></div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {budgetData.map((b, i) => {
            const pct = Math.round((b.spent / b.allocated) * 100);
            return (
              <div key={i} onClick={() => navigate("/404")} style={{ cursor: "pointer" }}>
                <div className="budget-row-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, flexWrap: "wrap", gap: 6 }}>
                  <div>
                    <span style={{ fontWeight: 700, color: "#e7ecf3", fontSize: 13.5 }}>{b.site}</span>
                    <span className="region-tag" style={{ marginLeft: 10, color: siteAccents[b.region], borderColor: siteAccents[b.region], background: `${siteAccents[b.region]}1f`, fontSize: 11 }}>{b.region}</span>
                  </div>
                  <div style={{ textAlign: "right", fontSize: 12.5, color: "rgba(231,236,243,0.65)" }}>
                    <span style={{ color: "#e7ecf3", fontWeight: 700 }}>{fmt(b.spent)}</span> / {fmt(b.allocated)}
                    <span style={{ marginLeft: 10, color: pct > 80 ? "#fca5a5" : "#5EEAD4", fontWeight: 700 }}>{pct}%</span>
                  </div>
                </div>
                <div style={{ height: 8, background: "rgba(231,236,243,0.07)", borderRadius: 999, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: pct > 85 ? "linear-gradient(90deg,#ef4444,#f87171)" : "linear-gradient(90deg,#5EEAD4,#2d6e64)", borderRadius: 999, transition: "width 1.5s ease" }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

function PublicationsPage({ navigate }) {
  return (
    <>
      <section className="stats-grid">
        {[
          { icon: "📚", value: publications.length, label: "Publications", bar: 80, accent: true },
          { icon: "📥", value: publications.reduce((a, p) => a + p.downloads, 0).toLocaleString(), label: "Total Downloads", bar: 90 },
          { icon: "📄", value: publications.reduce((a, p) => a + p.pages, 0).toLocaleString(), label: "Total Pages", bar: 65 },
          { icon: "🗓️", value: "2026", label: "Latest Year", bar: 100 },
        ].map((s, i) => (
          <div key={i} className={`stat-card ${s.accent ? "stat-accent" : ""}`} onClick={() => navigate("/404")} style={{ cursor: "pointer" }}>
            <div className="stat-top"><span className="stat-icon">{s.icon}</span></div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
            <div className="stat-bar"><div className="stat-bar-fill" style={{ width: `${s.bar}%` }} /></div>
          </div>
        ))}
      </section>
      <div className="card">
        <div className="card-header"><div><h2 className="card-title">Published Works</h2><p className="card-sub">Manuals, guides, and reports</p></div></div>
        <div className="pub-grid">
          {publications.map((pub, i) => (
            <div key={i} className="pub-card"
              onClick={() => navigate("/404")}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(94,234,212,0.4)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "none"; }}>
              <div style={{ fontSize: 30, marginBottom: 12 }}>📖</div>
              <div style={{ fontWeight: 700, color: "#e7ecf3", fontSize: 14, marginBottom: 6, lineHeight: 1.4 }}>{pub.title}</div>
              <div style={{ fontSize: 12, color: "rgba(231,236,243,0.5)", marginBottom: 14 }}>{pub.type} · {pub.year} · {pub.pages} pages</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                <span style={{ fontSize: 12, color: "#5EEAD4", fontWeight: 700 }}>📥 {pub.downloads.toLocaleString()} downloads</span>
                <button className="btn-outline" style={{ padding: "5px 12px", fontSize: 11.5 }} onClick={(e) => { e.stopPropagation(); navigate("/404"); }}>View</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function SettingsPage({ navigate }) {
  const [notifications, setNotifications] = useState(true);
  const [emailDigest, setEmailDigest] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [language, setLanguage] = useState("English");

  const Toggle = ({ value, onChange }) => (
    <div onClick={() => onChange(!value)} style={{ width: 42, height: 24, borderRadius: 999, background: value ? "#5EEAD4" : "rgba(231,236,243,0.12)", cursor: "pointer", transition: "all 0.3s ease", position: "relative", flexShrink: 0 }}>
      <div style={{ position: "absolute", top: 3, left: value ? 20 : 3, width: 18, height: 18, borderRadius: "50%", background: value ? "#04060b" : "#e7ecf3", transition: "left 0.3s ease", boxShadow: "0 1px 4px rgba(0,0,0,0.3)" }} />
    </div>
  );

  return (
    <>
      <div className="card">
        <div className="card-header"><div><h2 className="card-title">Account</h2><p className="card-sub">Your operator profile</p></div></div>
        <div className="account-row" style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 20, flexWrap: "wrap" }}>
          <img src="https://placehold.co/64x64/0b1220/5eead4?text=You" alt="avatar" style={{ width: 64, height: 64, borderRadius: "50%", border: "2px solid rgba(94,234,212,0.4)" }} />
          <div>
            <div style={{ fontWeight: 700, color: "#e7ecf3", fontSize: 16 }}>Dr. Alex Morgan</div>
            <div style={{ fontSize: 13, color: "rgba(231,236,243,0.55)", marginTop: 2 }}>Programme Director · alex.morgan@meridianlink.io</div>
            <div style={{ fontSize: 12, color: "#5EEAD4", marginTop: 4 }}>🛰️ 7 years with Meridian Link</div>
          </div>
        </div>
        <button className="btn-outline" style={{ borderColor: "#5EEAD4", color: "#5EEAD4" }} onClick={() => navigate("/404")}>Edit Profile</button>
      </div>
      <div className="card">
        <div className="card-header"><div><h2 className="card-title">Preferences</h2><p className="card-sub">Notifications and display</p></div></div>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {[
            { label: "Push Notifications", sub: "Receive alerts for link drops and deadline changes", value: notifications, set: setNotifications },
            { label: "Weekly Email Digest", sub: "Summary of network activity sent every Monday", value: emailDigest, set: setEmailDigest },
            { label: "Dark Mode", sub: "Use dark colour scheme across the dashboard", value: darkMode, set: setDarkMode },
          ].map((item, i) => (
            <div key={i} className="pref-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 0", borderBottom: i < 2 ? "1px solid rgba(231,236,243,0.06)" : "none" }}>
              <div>
                <div style={{ fontWeight: 700, color: "#e7ecf3", fontSize: 13.5 }}>{item.label}</div>
                <div style={{ fontSize: 12.5, color: "rgba(231,236,243,0.5)", marginTop: 2 }}>{item.sub}</div>
              </div>
              <Toggle value={item.value} onChange={item.set} />
            </div>
          ))}
          <div className="pref-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 18 }}>
            <div>
              <div style={{ fontWeight: 700, color: "#e7ecf3", fontSize: 13.5 }}>Language</div>
              <div style={{ fontSize: 12.5, color: "rgba(231,236,243,0.5)", marginTop: 2 }}>Interface display language</div>
            </div>
            <select value={language} onChange={e => setLanguage(e.target.value)} style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "#e7ecf3", borderRadius: 8, padding: "7px 12px", fontSize: 13, outline: "none" }}>
              {["English", "French", "Spanish", "Japanese", "German"].map(l => <option key={l}>{l}</option>)}
            </select>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-header"><div><h2 className="card-title">Danger Zone</h2><p className="card-sub">Irreversible account actions</p></div></div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button className="btn-outline" style={{ borderColor: "rgba(239,68,68,0.4)", color: "#fca5a5" }} onClick={() => navigate("/404")}>Reset Password</button>
          <button className="btn-outline" style={{ borderColor: "rgba(239,68,68,0.4)", color: "#fca5a5" }} onClick={() => navigate("/404")}>Delete Account</button>
        </div>
      </div>
    </>
  );
}

const pageMap = {
  dashboard: { title: "Dashboard", sub: "", component: DashboardPage },
  excavations: { title: "Missions", sub: "All active and completed network links.", component: ExcavationsPage },
  teams: { title: "Flight Teams", sub: "Manage your controllers and network directors.", component: TeamsPage },
  artifacts: { title: "Spacecraft", sub: "Registry of all tracked spacecraft and ground assets.", component: ArtifactsPage },
  research: { title: "Research", sub: "Publications, papers, and technical output.", component: ResearchPage },
  schedule: { title: "Schedule", sub: "Deadlines, pass windows, and upcoming events.", component: SchedulePage },
  budget: { title: "Budget", sub: "Funding allocation and expenditure tracking.", component: BudgetPage },
  publications: { title: "Publications", sub: "Manuals, guides, and annual reports.", component: PublicationsPage },
  settings: { title: "Settings", sub: "Account preferences and configuration.", component: SettingsPage },
};

export default function Dashboard() {
  const navigate=useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("dashboard");
  const mainRef = useRef(null);

  const currentPage = pageMap[activeNav];
  const PageComponent = currentPage.component;

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    if (mainRef.current) mainRef.current.scrollTop = 0;
  }, [activeNav]);

  return (
    <div className="dashboard-root">
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}
      <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-header">
          <div className="brand">
            <img src={logo} alt="Meridian Link" className="brand-logo-img" />
          </div>
          <button className="close-btn" onClick={() => setSidebarOpen(false)} aria-label="Close sidebar">✕</button>
        </div>
        <div className="sidebar-section-label">MAIN MENU</div>
        <nav className="sidebar-nav">
          {navItems.slice(0, 6).map(item => (
            <button key={item.id} className={`nav-item ${activeNav === item.id ? "nav-active" : ""}`} onClick={() => { setActiveNav(item.id); setSidebarOpen(false); }}>
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
              {item.id === "excavations" && <span className="nav-badge">7</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-section-label">MANAGEMENT</div>
        <nav className="sidebar-nav">
          {navItems.slice(6).map(item => (
            <button key={item.id} className={`nav-item ${activeNav === item.id ? "nav-active" : ""}`} onClick={() => { setActiveNav(item.id); setSidebarOpen(false); }}>
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <button className="logout-full-btn" style={{ marginTop: "auto" }} onClick={()=>navigate("/login")}>
          <span className="logout-icon" aria-hidden="true" />
          Sign Off
        </button>
      </aside>

      <main className="main-content" ref={mainRef}>
        <header className="topbar">
          <div className="topbar-left">
            <button className="hamburger" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
              <span /><span /><span />
            </button>
            <div className="page-title">
              <h1>{currentPage.title}</h1>
              <p>{currentPage.sub}</p>
            </div>
          </div>
          <div className="topbar-right">
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input placeholder="Search missions, spacecraft, controllers…" />
            </div>
            <button className="icon-btn" aria-label="Notifications" onClick={()=>navigate("/404")}>🔔<span className="notif-dot" /></button>
          </div>
        </header>

        <div className="content-area">
          <PageComponent navigate={navigate} />
        </div>
      </main>
    </div>
  );
}