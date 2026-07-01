import { useState, useEffect, useRef } from "react";
import "./Dashboard.css";
import logo from "../../assets/Stacklyimg1.webp"
import { useNavigate } from "react-router-dom";
const siteAccents = {
  DSN: "#D4A574", Lunar: "#8B9DAF", Mars: "#C1440E",
  ISS: "#4A90D9", LEO: "#B8860B",
};

const missionsData = [
  { id: 1, name: "Voyager 1 Deep Space Link", region: "DSN", site: "Goldstone", type: "Telemetry", status: "Active", progress: 87, endDate: "Dec 2025", budget: "$2,100,000", director: "Dr. Elena Voss" },
  { id: 2, name: "Artemis Lunar Relay", region: "Lunar", site: "Madrid", type: "Relay", status: "Field Work", progress: 52, endDate: "Aug 2025", budget: "$1,450,000", director: "Dr. Kenji Watanabe" },
  { id: 3, name: "Perseverance Mars Uplink", region: "Mars", site: "Canberra", type: "Uplink", status: "Completed", progress: 100, endDate: "Mar 2025", budget: "$1,980,000", director: "Dr. Amara Osei" },
  { id: 4, name: "ISS Comms Array", region: "ISS", site: "Houston", type: "Downlink", status: "Active", progress: 65, endDate: "Nov 2025", budget: "$890,000", director: "Dr. Liam Carter" },
  { id: 5, name: "Starlink Gateway Survey", region: "LEO", site: "Redmond", type: "Gateway", status: "Review", progress: 91, endDate: "Jul 2025", budget: "$670,000", director: "Dr. Priya Nair" },
  { id: 6, name: "Europa Clipper Beacon", region: "DSN", site: "Canberra", type: "Beacon", status: "Active", progress: 58, endDate: "Oct 2025", budget: "$1,320,000", director: "Dr. Marco Bianchi" },
  { id: 7, name: "Gateway Lunar Node", region: "Lunar", site: "Goldstone", type: "Relay", status: "Field Work", progress: 40, endDate: "Sep 2025", budget: "$1,100,000", director: "Dr. Sofia Reyes" },
];

const missionControlTeam = [
  { name: "Dr. Elena Voss", role: "Chief Signal Engineer — DSN", experience: 15, avatar: "EV", status: "active", projects: 3, speciality: "Deep Space Telemetry & Tracking", email: "e.voss@orbitalink.io" },
  { name: "Dr. Kenji Watanabe", role: "Relay Systems Lead — Lunar Network", experience: 12, avatar: "KW", status: "active", projects: 2, speciality: "Lunar Communication Relays", email: "k.watanabe@orbitalink.io" },
  { name: "Dr. Amara Osei", role: "Mars Comms Specialist", experience: 10, avatar: "AO", status: "away", projects: 2, speciality: "Mars Uplink Protocols", email: "a.osei@orbitalink.io" },
  { name: "Dr. Liam Carter", role: "ISS Network Engineer", experience: 14, avatar: "LC", status: "active", projects: 2, speciality: "Crewed Spacecraft Comms", email: "l.carter@orbitalink.io" },
  { name: "Dr. Priya Nair", role: "LEO Constellation Analyst", experience: 9, avatar: "PN", status: "active", projects: 1, speciality: "Satellite Gateway Systems", email: "p.nair@orbitalink.io" },
  { name: "Dr. Marco Bianchi", role: "Deep Space Beacon Engineer", experience: 13, avatar: "MB", status: "active", projects: 1, speciality: "Beacon Signal Optimisation", email: "m.bianchi@orbitalink.io" },
];

const transmissionsData = [
  { id: "TX-001", name: "Telemetry Downlink Packet", site: "Voyager 1 Deep Space Link", region: "DSN", era: "X-Band", date: "14:32 UTC", condition: "Excellent", status: "Logged" },
  { id: "TX-002", name: "Lunar Relay Handshake Signal", site: "Artemis Lunar Relay", region: "Lunar", era: "S-Band", date: "09:15 UTC", condition: "Good", status: "Under Analysis" },
  { id: "TX-003", name: "Rover Command Uplink", site: "Perseverance Mars Uplink", region: "Mars", era: "UHF", date: "22:04 UTC", condition: "Degraded", status: "Recovered" },
  { id: "TX-004", name: "ISS Voice Comm Burst", site: "ISS Comms Array", region: "ISS", era: "S-Band", date: "11:47 UTC", condition: "Excellent", status: "Logged" },
  { id: "TX-005", name: "Gateway Beacon Ping", site: "Starlink Gateway Survey", region: "LEO", era: "Ka-Band", date: "03:29 UTC", condition: "Good", status: "Under Analysis" },
  { id: "TX-006", name: "Instrument Data Dump", site: "Europa Clipper Beacon", region: "DSN", era: "X-Band", date: "19:58 UTC", condition: "Good", status: "Logged" },
  { id: "TX-007", name: "Crew Health Telemetry", site: "ISS Comms Array", region: "ISS", era: "S-Band", date: "07:12 UTC", condition: "Excellent", status: "Broadcasted" },
  { id: "TX-008", name: "Navigation Beacon Sync", site: "Gateway Lunar Node", region: "Lunar", era: "Ka-Band", date: "16:40 UTC", condition: "Good", status: "Logged" },
];

const technicalReports = [
  { title: "Signal Attenuation Modelling for Deep Space X-Band Links", authors: "Voss, E. et al.", journal: "Journal of Spacecraft Communications", year: 2025, status: "Published", citations: 18 },
  { title: "Latency Optimisation in Lunar Relay Handshake Protocols", authors: "Watanabe, K., Reyes, S.", journal: "IEEE Aerospace Transactions", year: 2025, status: "Published", citations: 9 },
  { title: "Error Correction Schemes for Mars UHF Command Uplinks", authors: "Osei, A. et al.", journal: "Journal of Deep Space Engineering", year: 2025, status: "In Review", citations: 0 },
  { title: "Bandwidth Allocation in Multi-Constellation Gateway Networks", authors: "Nair, P., Chen, L.", journal: "Satellite Systems Review", year: 2024, status: "Published", citations: 27 },
  { title: "ISS Voice-Data Multiplexing: A Reliability Analysis", authors: "Carter, L., Osei, A.", journal: "Space Communications Quarterly", year: 2024, status: "Published", citations: 35 },
  { title: "Beacon Signal Drift in Extended Deep Space Missions", authors: "Bianchi, M. et al.", journal: "Interplanetary Networking Journal", year: 2025, status: "In Draft", citations: 0 },
];

const scheduleEvents = [
  { date: "Jun 21", event: "Voyager 1 — Extended contact window opens", site: "Goldstone DSN", type: "urgent" },
  { date: "Jun 25", event: "Artemis Lunar Relay — Handshake protocol test", site: "Madrid DSN", type: "normal" },
  { date: "Jul 2", event: "Perseverance — Command uplink cataloguing session", site: "Canberra DSN", type: "normal" },
  { date: "Jul 10", event: "Team debrief: Europa Clipper mission review", site: "Virtual", type: "meeting" },
  { date: "Jul 18", event: "ISS — Antenna array diagnostic pass", site: "Houston Mission Control", type: "normal" },
  { date: "Aug 5", event: "Starlink Gateway — Final network review", site: "Redmond Ops Centre", type: "normal" },
  { date: "Aug 14", event: "Annual signal engineers' symposium", site: "Pasadena, CA", type: "meeting" },
  { date: "Sep 1", event: "Gateway Lunar Node — Relay tests resume", site: "Goldstone DSN", type: "normal" },
  { date: "Oct 15", event: "ISS Comms — Phase 1 report submission deadline", site: "Houston Mission Control", type: "urgent" },
];

const budgetData = [
  { site: "Voyager 1 Deep Space Link", allocated: 2100000, spent: 1780000, region: "DSN" },
  { site: "Artemis Lunar Relay", allocated: 1450000, spent: 620000, region: "Lunar" },
  { site: "Perseverance Mars Uplink", allocated: 1980000, spent: 1980000, region: "Mars" },
  { site: "ISS Comms Array", allocated: 890000, spent: 540000, region: "ISS" },
  { site: "Starlink Gateway Survey", allocated: 670000, spent: 598000, region: "LEO" },
  { site: "Europa Clipper Beacon", allocated: 1320000, spent: 740000, region: "DSN" },
  { site: "Gateway Lunar Node", allocated: 1100000, spent: 410000, region: "Lunar" },
];

const publications = [
  { title: "Orbitalink Annual Network Review 2024", type: "Annual Report", year: 2024, pages: 128, downloads: 4210 },
  { title: "Handbook of Deep Space Signal Protocols", type: "Technical Manual", year: 2023, pages: 280, downloads: 8320 },
  { title: "Lunar Relay Systems: A Comparative Study", type: "Monograph", year: 2024, pages: 298, downloads: 2870 },
  { title: "Digital Signal Processing for Mission Control", type: "Field Guide", year: 2025, pages: 104, downloads: 6110 },
  { title: "Network Resilience in Multi-Mission Operations", type: "Proceedings", year: 2023, pages: 176, downloads: 2040 },
];

const liveFeed = [
  { icon: "📡", text: "New deep space contact established with Voyager 1 after signal dropout", time: "2h ago", type: "discovery" },
  { icon: "📶", text: "Lunar relay handshake protocol upgraded — latency reduced by 40%", time: "4h ago", type: "research" },
  { icon: "✅", text: "Perseverance uplink calibration completed — final report published", time: "Yesterday", type: "complete" },
  { icon: "⚠️", text: "Solar interference disrupting ISS S-Band link — engineers investigating", time: "Yesterday", type: "alert" },
  { icon: "🛰️", text: "Signal analysis reveals new orbital drift pattern in Starlink gateway", time: "2d ago", type: "update" },
];

const navItems = [
  { icon: "▦", label: "Dashboard", id: "dashboard" },
  { icon: "🛰️", label: "Missions", id: "excavations" },
  { icon: "📡", label: "Mission Control", id: "teams" },
  { icon: "📶", label: "Transmissions", id: "artifacts" },
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

const conditionColor = { Excellent: "#22c55e", Good: "#f59e0b", Degraded: "#ef4444" };
const paperStatusColor = { Published: "#22c55e", "In Review": "#f59e0b", "In Draft": "#8B9DAF" };
const scheduleTypeColor = { urgent: "#ef4444", normal: "#D4A574", meeting: "#8B9DAF" };

function fmt(n) { return "$" + n.toLocaleString(); }

// ─── PAGE COMPONENTS ───────────────────────────────────────────────

function DashboardPage({ navigate }) {
  return (
    <>
      <section className="stats-grid">
        {[
          { icon: "🛰️", delta: "+3 this month", value: "9", label: "Active Missions", bar: 72, accent: true },
          { icon: "📶", delta: "+128 this week", value: "18,432", label: "Transmissions Logged", bar: 64 },
          { icon: "💰", delta: "On track", value: "$9.5M", label: "Network Funding", bar: 88 },
          { icon: "🌐", delta: "+1 this quarter", value: "5", label: "Active Networks", bar: 90 },
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
            <div><h2 className="card-title">Active Missions</h2><p className="card-sub">Current communication operations overview</p></div>
          </div>
          <div className="table-wrapper">
            <table className="excavations-table">
              <thead><tr><th>Mission</th><th>Network</th><th>Link Type</th><th>Status</th><th>Progress</th><th>End Date</th><th>Budget</th></tr></thead>
              <tbody>
                {missionsData.slice(0, 5).map(t => (
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
          <div className="card-header"><div><h2 className="card-title">Live Feed</h2><p className="card-sub">Mission control updates</p></div></div>
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
          <div className="card-header"><div><h2 className="card-title">Mission Control</h2><p className="card-sub">Active engineers</p></div></div>
          <ul className="team-list">
            {missionControlTeam.slice(0, 4).map((m, i) => (
              <li key={i} className="team-item" onClick={() => navigate("/404")} style={{ cursor: "pointer" }}>
                <div className="member-avatar">{m.avatar}<span className={`online-dot dot-${m.status}`} /></div>
                <div className="member-info"><div className="member-name">{m.name}</div><div className="member-role">{m.role}</div></div>
                <div className="member-projects"><span className="proj-count">{m.experience}</span><span className="proj-label">yrs</span></div>
              </li>
            ))}
          </ul>
        </div>
        <div className="card">
          <div className="card-header"><div><h2 className="card-title">Upcoming Contact Windows</h2><p className="card-sub">Next 60 days</p></div></div>
          <ul className="milestone-list">
            {[
              { site: "Voyager 1 Deep Space Link", event: "Extended contact window — Phase 2", date: "Jun 21", done: false, urgent: true },
              { site: "Artemis Lunar Relay", event: "Handshake protocol test", date: "Jun 25", done: false, urgent: false },
              { site: "Perseverance Mars Uplink", event: "Command uplink cataloguing", date: "Jul 2", done: false, urgent: false },
              { site: "Starlink Gateway", event: "Final network review", date: "Aug 05", done: false, urgent: false },
              { site: "Perseverance Mars Uplink", event: "Final report submission", date: "Jun 14", done: true, urgent: false },
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
          <div className="card-header"><div><h2 className="card-title">Network Distribution</h2><p className="card-sub">By network</p></div></div>
          <div className="donut-chart" onClick={() => navigate("/404")} style={{ cursor: "pointer" }}>
            <svg viewBox="0 0 120 120" className="donut-svg">
              <circle cx="60" cy="60" r="48" fill="none" stroke="#1f1f2e" strokeWidth="16" />
              <circle cx="60" cy="60" r="48" fill="none" stroke="#D4A574" strokeWidth="16" strokeDasharray="70 212" strokeDashoffset="0" strokeLinecap="round" />
              <circle cx="60" cy="60" r="48" fill="none" stroke="#8B9DAF" strokeWidth="16" strokeDasharray="55 212" strokeDashoffset="-70" strokeLinecap="round" />
              <circle cx="60" cy="60" r="48" fill="none" stroke="#C1440E" strokeWidth="16" strokeDasharray="45 212" strokeDashoffset="-125" strokeLinecap="round" />
              <circle cx="60" cy="60" r="48" fill="none" stroke="#4A90D9" strokeWidth="16" strokeDasharray="25 212" strokeDashoffset="-170" strokeLinecap="round" />
              <text x="60" y="56" textAnchor="middle" className="donut-num">24</text>
              <text x="60" y="68" textAnchor="middle" className="donut-label">Links</text>
            </svg>
          </div>
          <ul className="legend-list">
            {[{ color: "#D4A574", label: "DSN", count: 8 }, { color: "#8B9DAF", label: "Lunar", count: 6 }, { color: "#C1440E", label: "Mars", count: 5 }, { color: "#4A90D9", label: "ISS", count: 3 }, { color: "#B8860B", label: "LEO", count: 2 }].map((l, i) => (
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
  const filtered = filter === "All" ? missionsData : missionsData.filter(e => e.status === filter);
  return (
    <>
      <section className="stats-grid">
        {[
          { icon: "🛰️", value: missionsData.length, label: "Total Missions", bar: 100 },
          { icon: "🟢", value: missionsData.filter(e => e.status === "Active").length, label: "Active Now", bar: 60, accent: true },
          { icon: "📡", value: missionsData.filter(e => e.status === "Field Work").length, label: "Field Ops", bar: 40 },
          { icon: "✅", value: missionsData.filter(e => e.status === "Completed").length, label: "Completed", bar: 20 },
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
          <div><h2 className="card-title">All Missions</h2><p className="card-sub">Full list of communication operations</p></div>
          <div className="filter-row" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {statuses.map(s => (
              <button key={s} className={`btn-outline ${filter === s ? "btn-active" : ""}`} onClick={() => setFilter(s)}
                style={filter === s ? { borderColor: "#D4A574", color: "#D4A574" } : {}}>{s}</button>
            ))}
          </div>
        </div>
        <div className="table-wrapper">
          <table className="excavations-table">
            <thead><tr><th>Mission</th><th>Network</th><th>Link Type</th><th>Status</th><th>Progress</th><th>Mission Lead</th><th>End Date</th><th>Budget</th></tr></thead>
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
          { icon: "👥", value: missionControlTeam.length, label: "Engineers", bar: 80 },
          { icon: "🟢", value: missionControlTeam.filter(m => m.status === "active").length, label: "Online Now", bar: 85, accent: true },
          { icon: "📋", value: missionControlTeam.reduce((a, m) => a + m.projects, 0), label: "Active Projects", bar: 70 },
          { icon: "🏅", value: Math.round(missionControlTeam.reduce((a, m) => a + m.experience, 0) / missionControlTeam.length), label: "Avg. Yrs Exp.", bar: 75 },
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
        <div className="card-header"><div><h2 className="card-title">Mission Control Engineers</h2><p className="card-sub">Full team directory</p></div></div>
        <div className="team-grid">
          {missionControlTeam.map((m, i) => (
            <div key={i} className="team-card"
              onClick={() => navigate("/404")}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(212,165,116,0.4)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "none"; }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
                <div className="member-avatar" style={{ width: 46, height: 46, fontSize: 14 }}>{m.avatar}<span className={`online-dot dot-${m.status}`} /></div>
                <div>
                  <div className="member-name" style={{ fontSize: 15 }}>{m.name}</div>
                  <div className="member-role">{m.role}</div>
                </div>
              </div>
              <div style={{ fontSize: 12.5, color: "rgba(245,245,247,0.55)", lineHeight: 1.9 }}>
                <div>🎓 {m.speciality}</div>
                <div>✉️ {m.email}</div>
                <div>📂 {m.projects} active project{m.projects !== 1 ? "s" : ""} · {m.experience} yrs experience</div>
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
  const filtered = transmissionsData.filter(a => a.name.toLowerCase().includes(search.toLowerCase()) || a.site.toLowerCase().includes(search.toLowerCase()));
  return (
    <>
      <section className="stats-grid">
        {[
          { icon: "📶", value: "18,432", label: "Total Logged", bar: 75, accent: true },
          { icon: "🔬", value: "312", label: "Under Analysis", bar: 55 },
          { icon: "📡", value: "156", label: "Broadcasted", bar: 30 },
          { icon: "🔧", value: "62", label: "Being Recovered", bar: 20 },
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
          <div><h2 className="card-title">Transmission Registry</h2><p className="card-sub">Signal logs across all networks</p></div>
          <div className="search-box" style={{ flex: "0 0 auto" }}>
            <span className="search-icon">🔍</span>
            <input placeholder="Search transmissions…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="table-wrapper">
          <table className="excavations-table">
            <thead><tr><th>ID</th><th>Transmission</th><th>Mission</th><th>Band</th><th>Timestamp</th><th>Signal Quality</th><th>Status</th></tr></thead>
            <tbody>
              {filtered.map(a => (
                <tr key={a.id} onClick={() => navigate("/404")} style={{ cursor: "pointer" }}>
                  <td className="type-col" style={{ fontSize: 11.5, fontFamily: "monospace" }}>{a.id}</td>
                  <td><div className="t-name">{a.name}</div><div className="t-sub">{a.region}</div></td>
                  <td className="date-col">{a.site}</td>
                  <td className="type-col" style={{ fontSize: 12 }}>{a.era}</td>
                  <td className="date-col">{a.date}</td>
                  <td><span style={{ color: conditionColor[a.condition], fontWeight: 700, fontSize: 12 }}>{a.condition}</span></td>
                  <td><span className="status-badge status-review" style={{ background: a.status === "Logged" ? "rgba(34,197,94,0.14)" : a.status === "Broadcasted" ? "rgba(212,165,116,0.14)" : "rgba(245,158,11,0.14)", color: a.status === "Logged" ? "#86efac" : a.status === "Broadcasted" ? "#e8c9a8" : "#fcd34d" }}>{a.status}</span></td>
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
          { icon: "📄", value: technicalReports.length, label: "Active Reports", bar: 80, accent: true },
          { icon: "✅", value: technicalReports.filter(p => p.status === "Published").length, label: "Published", bar: 70 },
          { icon: "🔍", value: technicalReports.filter(p => p.status === "In Review").length, label: "In Review", bar: 20 },
          { icon: "📊", value: technicalReports.reduce((a, p) => a + p.citations, 0), label: "Total Citations", bar: 60 },
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
        <div className="card-header"><div><h2 className="card-title">Technical Reports</h2><p className="card-sub">Active publications and submissions</p></div></div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {technicalReports.map((p, i) => (
            <div key={i} className="research-card"
              onClick={() => navigate("/404")}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(212,165,116,0.35)"; e.currentTarget.style.transform = "translateX(4px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "none"; }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 180 }}>
                  <div style={{ fontWeight: 700, color: "#fff", fontSize: 14, marginBottom: 4 }}>{p.title}</div>
                  <div style={{ fontSize: 12.5, color: "rgba(245,245,247,0.6)", marginBottom: 6 }}>{p.authors}</div>
                  <div style={{ fontSize: 12, color: "rgba(245,245,247,0.45)" }}>{p.journal} · {p.year}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, flexShrink: 0 }}>
                  <span style={{ background: paperStatusColor[p.status] + "22", color: paperStatusColor[p.status], borderRadius: 999, padding: "3px 10px", fontSize: 11.5, fontWeight: 700 }}>{p.status}</span>
                  {p.citations > 0 && <span style={{ fontSize: 12, color: "rgba(245,245,247,0.5)" }}>📊 {p.citations} citations</span>}
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
        <div className="card-header"><div><h2 className="card-title">Contact Schedule</h2><p className="card-sub">All upcoming contact windows and events</p></div></div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {scheduleEvents.map((ev, i) => (
            <div key={i} className="schedule-row"
              onClick={() => navigate("/404")}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.transform = "translateX(4px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.transform = "none"; }}>
              <div style={{ width: 50, flexShrink: 0, textAlign: "center" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: scheduleTypeColor[ev.type], textTransform: "uppercase", letterSpacing: "0.04em" }}>{ev.date.split(" ")[0]}</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>{ev.date.split(" ")[1]}</div>
              </div>
              <div style={{ width: 3, alignSelf: "stretch", borderRadius: 999, background: scheduleTypeColor[ev.type], opacity: 0.7, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, color: "#fff", fontSize: 13.5 }}>{ev.event}</div>
                <div style={{ fontSize: 12, color: "rgba(245,245,247,0.55)", marginTop: 3 }}>📍 {ev.site}</div>
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
                    <span style={{ fontWeight: 700, color: "#fff", fontSize: 13.5 }}>{b.site}</span>
                    <span className="region-tag" style={{ marginLeft: 10, color: siteAccents[b.region], borderColor: siteAccents[b.region], background: `${siteAccents[b.region]}1f`, fontSize: 11 }}>{b.region}</span>
                  </div>
                  <div style={{ textAlign: "right", fontSize: 12.5, color: "rgba(245,245,247,0.65)" }}>
                    <span style={{ color: "#fff", fontWeight: 700 }}>{fmt(b.spent)}</span> / {fmt(b.allocated)}
                    <span style={{ marginLeft: 10, color: pct > 80 ? "#fca5a5" : "#D4A574", fontWeight: 700 }}>{pct}%</span>
                  </div>
                </div>
                <div style={{ height: 8, background: "rgba(255,255,255,0.07)", borderRadius: 999, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: pct > 85 ? "linear-gradient(90deg,#ef4444,#f87171)" : "linear-gradient(90deg,#D4A574,#e8c9a8)", borderRadius: 999, transition: "width 1.5s ease" }} />
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
          { icon: "🗓️", value: "2025", label: "Latest Year", bar: 100 },
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
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(212,165,116,0.4)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "none"; }}>
              <div style={{ fontSize: 30, marginBottom: 12 }}>📖</div>
              <div style={{ fontWeight: 700, color: "#fff", fontSize: 14, marginBottom: 6, lineHeight: 1.4 }}>{pub.title}</div>
              <div style={{ fontSize: 12, color: "rgba(245,245,247,0.5)", marginBottom: 14 }}>{pub.type} · {pub.year} · {pub.pages} pages</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                <span style={{ fontSize: 12, color: "#D4A574", fontWeight: 700 }}>📥 {pub.downloads.toLocaleString()} downloads</span>
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
    <div onClick={() => onChange(!value)} style={{ width: 42, height: 24, borderRadius: 999, background: value ? "#D4A574" : "rgba(255,255,255,0.12)", cursor: "pointer", transition: "all 0.3s ease", position: "relative", flexShrink: 0 }}>
      <div style={{ position: "absolute", top: 3, left: value ? 20 : 3, width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: "left 0.3s ease", boxShadow: "0 1px 4px rgba(0,0,0,0.3)" }} />
    </div>
  );

  return (
    <>
      <div className="card">
        <div className="card-header"><div><h2 className="card-title">Account</h2><p className="card-sub">Your profile information</p></div></div>
        <div className="account-row" style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 20, flexWrap: "wrap" }}>
          <img src="https://placehold.co/64x64/1b1b29/f5f5f7?text=You" alt="avatar" style={{ width: 64, height: 64, borderRadius: "50%", border: "2px solid rgba(212,165,116,0.4)" }} />
          <div>
            <div style={{ fontWeight: 700, color: "#fff", fontSize: 16 }}>Dr. Alex Rivera</div>
            <div style={{ fontSize: 13, color: "rgba(245,245,247,0.55)", marginTop: 2 }}>Network Operations Director · alex.rivera@orbitalink.io</div>
            <div style={{ fontSize: 12, color: "#D4A574", marginTop: 4 }}>📡 7 years with Orbitalink</div>
          </div>
        </div>
        <button className="btn-outline" style={{ borderColor: "#D4A574", color: "#D4A574" }} onClick={() => navigate("/404")}>Edit Profile</button>
      </div>
      <div className="card">
        <div className="card-header"><div><h2 className="card-title">Preferences</h2><p className="card-sub">Notifications and display</p></div></div>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {[
            { label: "Push Notifications", sub: "Receive alerts for signal loss and contact window changes", value: notifications, set: setNotifications },
            { label: "Weekly Email Digest", sub: "Summary of mission activity sent every Monday", value: emailDigest, set: setEmailDigest },
            { label: "Dark Mode", sub: "Use dark colour scheme across the dashboard", value: darkMode, set: setDarkMode },
          ].map((item, i) => (
            <div key={i} className="pref-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 0", borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
              <div>
                <div style={{ fontWeight: 700, color: "#fff", fontSize: 13.5 }}>{item.label}</div>
                <div style={{ fontSize: 12.5, color: "rgba(245,245,247,0.5)", marginTop: 2 }}>{item.sub}</div>
              </div>
              <Toggle value={item.value} onChange={item.set} />
            </div>
          ))}
          <div className="pref-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 18 }}>
            <div>
              <div style={{ fontWeight: 700, color: "#fff", fontSize: 13.5 }}>Language</div>
              <div style={{ fontSize: 12.5, color: "rgba(245,245,247,0.5)", marginTop: 2 }}>Interface display language</div>
            </div>
            <select value={language} onChange={e => setLanguage(e.target.value)} style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "#fff", borderRadius: 8, padding: "7px 12px", fontSize: 13, outline: "none" }}>
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
  excavations: { title: "Missions", sub: "All active and completed communication missions.", component: ExcavationsPage },
  teams: { title: "Mission Control", sub: "Manage your engineers and network leads.", component: TeamsPage },
  artifacts: { title: "Transmissions", sub: "Registry of all logged signal transmissions.", component: ArtifactsPage },
  research: { title: "Research", sub: "Technical reports and academic output.", component: ResearchPage },
  schedule: { title: "Schedule", sub: "Contact windows, launch dates, and upcoming events.", component: SchedulePage },
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
            <img src={logo} alt="Orbitalink" className="brand-logo-img" />
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
        <button className="logout-full-btn" style={{ marginTop: "auto" }} onClick={()=>navigate("/login")}>↪ Logout</button>
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
              <input placeholder="Search missions, transmissions, engineers…" />
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