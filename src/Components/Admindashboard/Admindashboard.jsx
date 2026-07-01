import { useState, useEffect, useRef } from "react";
import "./AdminDashboard.css";
import logo from "../../assets/Stacklyimg1.webp"
import { useNavigate } from "react-router-dom";

const deptAccents = {
  "Network Ops": "#D4A574", Security: "#ef4444", Engineering: "#4A90D9",
  Support: "#8B9DAF", Compliance: "#22c55e",
};

const usersData = [
  { id: 1, name: "Sarah Kim", region: "Network Ops", site: "Houston HQ", type: "Super Admin", status: "Active", progress: 100, endDate: "2h ago", budget: "1,204", director: "System" },
  { id: 2, name: "David Osei", region: "Security", site: "Canberra DSN", type: "Security Admin", status: "Active", progress: 92, endDate: "5h ago", budget: "876", director: "Sarah Kim" },
  { id: 3, name: "Maria Lopez", region: "Engineering", site: "Redmond Ops", type: "Systems Engineer", status: "Suspended", progress: 40, endDate: "3 weeks ago", budget: "112", director: "Sarah Kim" },
  { id: 4, name: "James Whitfield", region: "Support", site: "Madrid DSN", type: "Support Agent", status: "Active", progress: 65, endDate: "1d ago", budget: "540", director: "David Osei" },
  { id: 5, name: "Aiko Tanaka", region: "Compliance", site: "Goldstone DSN", type: "Compliance Auditor", status: "Pending", progress: 20, endDate: "Never", budget: "0", director: "Sarah Kim" },
  { id: 6, name: "Noah Fischer", region: "Network Ops", site: "Houston HQ", type: "Network Operator", status: "Active", progress: 88, endDate: "30m ago", budget: "2,310", director: "Sarah Kim" },
  { id: 7, name: "Grace Muthoni", region: "Security", site: "Canberra DSN", type: "Security Analyst", status: "Inactive", progress: 10, endDate: "6 months ago", budget: "8", director: "David Osei" },
];

const adminTeam = [
  { name: "Sarah Kim", role: "Chief Systems Administrator", experience: 12, avatar: "SK", status: "active", projects: 4, speciality: "Infrastructure & Access Control", email: "s.kim@orbitalink.io" },
  { name: "David Osei", role: "Security Operations Lead", experience: 9, avatar: "DO", status: "active", projects: 3, speciality: "Threat Monitoring & Incident Response", email: "d.osei@orbitalink.io" },
  { name: "Maria Lopez", role: "Senior Systems Engineer", experience: 7, avatar: "ML", status: "away", projects: 2, speciality: "Server Infrastructure & Deployments", email: "m.lopez@orbitalink.io" },
  { name: "James Whitfield", role: "Support Team Lead", experience: 6, avatar: "JW", status: "active", projects: 2, speciality: "User Support & Onboarding", email: "j.whitfield@orbitalink.io" },
  { name: "Aiko Tanaka", role: "Compliance & Audit Manager", experience: 8, avatar: "AT", status: "active", projects: 1, speciality: "Regulatory Compliance & Access Reviews", email: "a.tanaka@orbitalink.io" },
  { name: "Noah Fischer", role: "Network Operations Admin", experience: 5, avatar: "NF", status: "active", projects: 2, speciality: "Uptime Monitoring & Network Configuration", email: "n.fischer@orbitalink.io" },
];

const auditLogsData = [
  { id: "AL-001", name: "Failed login attempt blocked", site: "Grace Muthoni", region: "Security", era: "Authentication", date: "08:12 UTC", condition: "High", status: "Flagged" },
  { id: "AL-002", name: "Admin role granted to new account", site: "Sarah Kim", region: "Network Ops", era: "Permission Change", date: "14:45 UTC", condition: "Medium", status: "Reviewed" },
  { id: "AL-003", name: "Bulk export of ground station telemetry", site: "Noah Fischer", region: "Network Ops", era: "Data Access", date: "02:30 UTC", condition: "Medium", status: "Resolved" },
  { id: "AL-004", name: "Firewall rule updated on DSN gateway", site: "David Osei", region: "Security", era: "System Config", date: "19:05 UTC", condition: "High", status: "Resolved" },
  { id: "AL-005", name: "Password reset requested", site: "James Whitfield", region: "Support", era: "Authentication", date: "11:22 UTC", condition: "Low", status: "Resolved" },
  { id: "AL-006", name: "Suspicious API key usage detected", site: "Aiko Tanaka", region: "Compliance", era: "Data Access", date: "23:58 UTC", condition: "High", status: "Flagged" },
  { id: "AL-007", name: "Scheduled backup completed", site: "Maria Lopez", region: "Engineering", era: "System Config", date: "04:00 UTC", condition: "Low", status: "Resolved" },
  { id: "AL-008", name: "User account suspended for policy violation", site: "Sarah Kim", region: "Network Ops", era: "Permission Change", date: "16:37 UTC", condition: "Medium", status: "Reviewed" },
];

const incidentsData = [
  { title: "Unauthorized VPN Access Attempt on Mission Control Network", authors: "Osei, D. et al.", journal: "VPN Gateway — Houston HQ", year: 2025, status: "Resolved", citations: 0 },
  { title: "Data Sync Failure Between Lunar Relay Nodes", authors: "Fischer, N., Lopez, M.", journal: "Lunar Relay Sync Service", year: 2025, status: "Investigating", citations: 3 },
  { title: "Elevated Privilege Bug in Role Management Panel", authors: "Kim, S., Tanaka, A.", journal: "Admin Console", year: 2025, status: "Resolved", citations: 12 },
  { title: "DDoS Attempt on Public Status Page", authors: "Osei, D.", journal: "Edge CDN", year: 2024, status: "Resolved", citations: 0 },
  { title: "Storage Quota Breach on Telemetry Archive", authors: "Lopez, M., Fischer, N.", journal: "Object Storage Cluster", year: 2024, status: "Resolved", citations: 8 },
  { title: "Compliance Audit Flag: Stale Admin Accounts", authors: "Tanaka, A.", journal: "Identity & Access Management", year: 2025, status: "Investigating", citations: 5 },
];

const maintenanceEvents = [
  { date: "Jun 21", event: "Scheduled failover test — Houston primary servers", site: "Houston HQ", type: "urgent" },
  { date: "Jun 25", event: "Security patch rollout — all ground stations", site: "Global", type: "normal" },
  { date: "Jul 2", event: "Database index rebuild — audit log store", site: "Redmond Ops", type: "normal" },
  { date: "Jul 10", event: "Admin sync meeting: Q3 access review", site: "Virtual", type: "meeting" },
  { date: "Jul 18", event: "SSL certificate renewal — API gateway", site: "Houston HQ", type: "normal" },
  { date: "Aug 5", event: "Load balancer firmware upgrade", site: "Canberra DSN", type: "normal" },
  { date: "Aug 14", event: "Quarterly security & compliance review", site: "Pasadena, CA", type: "meeting" },
  { date: "Sep 1", event: "Backup system stress test", site: "Goldstone DSN", type: "normal" },
  { date: "Oct 15", event: "Legacy user accounts deprecation deadline", site: "Global", type: "urgent" },
];

const resourceData = [
  { site: "Network Ops Infrastructure", allocated: 410000, spent: 305000, region: "Network Ops" },
  { site: "Security Monitoring & Response", allocated: 260000, spent: 188000, region: "Security" },
  { site: "Engineering & DevOps Tooling", allocated: 300000, spent: 300000, region: "Engineering" },
  { site: "Support Desk Systems", allocated: 90000, spent: 41000, region: "Support" },
  { site: "Compliance & Audit Platform", allocated: 120000, spent: 96000, region: "Compliance" },
  { site: "Network Ops Cloud Compute", allocated: 350000, spent: 210000, region: "Network Ops" },
  { site: "Security Identity Platform", allocated: 150000, spent: 132000, region: "Security" },
];

const apiIntegrations = [
  { title: "Ground Station Telemetry API", type: "REST API", year: 2024, pages: 42, downloads: 128400 },
  { title: "Slack Incident Alerts Webhook", type: "Webhook", year: 2025, pages: 6, downloads: 3210 },
  { title: "Single Sign-On (OAuth)", type: "OAuth Client", year: 2023, pages: 12, downloads: 54200 },
  { title: "Mission Data Export SDK", type: "SDK", year: 2025, pages: 28, downloads: 9870 },
  { title: "PagerDuty Escalation Integration", type: "Webhook", year: 2024, pages: 8, downloads: 1540 },
];

const liveFeed = [
  { icon: "🚨", text: "High-severity audit flag: suspicious API key usage detected", time: "2h ago", type: "alert" },
  { icon: "🔐", text: "New Super Admin role granted to Sarah Kim's team", time: "4h ago", type: "research" },
  { icon: "✅", text: "Scheduled backup completed across all storage clusters", time: "Yesterday", type: "complete" },
  { icon: "⚠️", text: "Failed login attempts spiked on Security Admin accounts", time: "Yesterday", type: "alert" },
  { icon: "🛰️", text: "Ground station telemetry API usage up 18% week-over-week", time: "2d ago", type: "update" },
];

const navItems = [
  { icon: "▦", label: "Dashboard", id: "dashboard" },
  { icon: "👤", label: "Users", id: "excavations" },
  { icon: "🛡️", label: "Admin Team", id: "teams" },
  { icon: "📋", label: "Audit Logs", id: "artifacts" },
  { icon: "🚨", label: "Incidents", id: "research" },
  { icon: "🗓️", label: "Maintenance", id: "schedule" },
  { icon: "📊", label: "Resource Usage", id: "budget" },
  { icon: "🔑", label: "API & Integrations", id: "publications" },
  { icon: "⚙️", label: "Settings", id: "settings" },
];

const statusColors = {
  Active: "status-complete", Pending: "status-field",
  Suspended: "status-active", Inactive: "status-review",
};

const conditionColor = { Low: "#22c55e", Medium: "#f59e0b", High: "#ef4444" };
const paperStatusColor = { Resolved: "#22c55e", Investigating: "#f59e0b", Open: "#8B9DAF" };
const scheduleTypeColor = { urgent: "#ef4444", normal: "#D4A574", meeting: "#8B9DAF" };

function fmt(n) { return "$" + n.toLocaleString(); }

// ─── PAGE COMPONENTS ───────────────────────────────────────────────

function DashboardPage({ navigate }) {
  return (
    <>
      <section className="stats-grid">
        {[
          { icon: "👤", delta: "+5 this month", value: "42", label: "Active Users", bar: 78, accent: true },
          { icon: "📡", delta: "+12% this week", value: "128,400", label: "API Calls Today", bar: 64 },
          { icon: "🟢", delta: "Stable", value: "99.98%", label: "System Uptime", bar: 96 },
          { icon: "🚨", delta: "2 flagged", value: "3", label: "Active Alerts", bar: 30 },
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
            <div><h2 className="card-title">Active Users</h2><p className="card-sub">Current account status overview</p></div>
          </div>
          <div className="table-wrapper">
            <table className="excavations-table">
              <thead><tr><th>User</th><th>Department</th><th>Role</th><th>Status</th><th>Access Level</th><th>Last Login</th><th>Sessions</th></tr></thead>
              <tbody>
                {usersData.slice(0, 5).map(t => (
                  <tr key={t.id} onClick={() => navigate("/404")} style={{ cursor: "pointer" }}>
                    <td><div className="t-name">{t.name}</div><div className="t-sub">{t.site} · Approved by {t.director}</div></td>
                    <td><span className="region-tag" style={{ color: deptAccents[t.region], borderColor: deptAccents[t.region], background: `${deptAccents[t.region]}1f` }}>{t.region}</span></td>
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
          <div className="card-header"><div><h2 className="card-title">Live Feed</h2><p className="card-sub">Audit & security updates</p></div></div>
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
          <div className="card-header"><div><h2 className="card-title">Admin Team</h2><p className="card-sub">Active administrators</p></div></div>
          <ul className="team-list">
            {adminTeam.slice(0, 4).map((m, i) => (
              <li key={i} className="team-item" onClick={() => navigate("/404")} style={{ cursor: "pointer" }}>
                <div className="member-avatar">{m.avatar}<span className={`online-dot dot-${m.status}`} /></div>
                <div className="member-info"><div className="member-name">{m.name}</div><div className="member-role">{m.role}</div></div>
                <div className="member-projects"><span className="proj-count">{m.experience}</span><span className="proj-label">yrs</span></div>
              </li>
            ))}
          </ul>
        </div>
        <div className="card">
          <div className="card-header"><div><h2 className="card-title">Scheduled Maintenance</h2><p className="card-sub">Next 60 days</p></div></div>
          <ul className="milestone-list">
            {[
              { site: "Houston HQ", event: "Scheduled failover test — primary servers", date: "Jun 21", done: false, urgent: true },
              { site: "Global", event: "Security patch rollout — all ground stations", date: "Jun 25", done: false, urgent: false },
              { site: "Redmond Ops", event: "Database index rebuild — audit log store", date: "Jul 2", done: false, urgent: false },
              { site: "Goldstone DSN", event: "Backup system stress test", date: "Sep 01", done: false, urgent: false },
              { site: "Houston HQ", event: "Q2 access review completed", date: "Jun 14", done: true, urgent: false },
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
          <div className="card-header"><div><h2 className="card-title">Access Distribution</h2><p className="card-sub">By department</p></div></div>
          <div className="donut-chart" onClick={() => navigate("/404")} style={{ cursor: "pointer" }}>
            <svg viewBox="0 0 120 120" className="donut-svg">
              <circle cx="60" cy="60" r="48" fill="none" stroke="#1f1f2e" strokeWidth="16" />
              <circle cx="60" cy="60" r="48" fill="none" stroke="#D4A574" strokeWidth="16" strokeDasharray="70 212" strokeDashoffset="0" strokeLinecap="round" />
              <circle cx="60" cy="60" r="48" fill="none" stroke="#ef4444" strokeWidth="16" strokeDasharray="50 212" strokeDashoffset="-70" strokeLinecap="round" />
              <circle cx="60" cy="60" r="48" fill="none" stroke="#4A90D9" strokeWidth="16" strokeDasharray="40 212" strokeDashoffset="-120" strokeLinecap="round" />
              <circle cx="60" cy="60" r="48" fill="none" stroke="#8B9DAF" strokeWidth="16" strokeDasharray="30 212" strokeDashoffset="-160" strokeLinecap="round" />
              <text x="60" y="56" textAnchor="middle" className="donut-num">42</text>
              <text x="60" y="68" textAnchor="middle" className="donut-label">Users</text>
            </svg>
          </div>
          <ul className="legend-list">
            {[{ color: "#D4A574", label: "Network Ops", count: 14 }, { color: "#ef4444", label: "Security", count: 10 }, { color: "#4A90D9", label: "Engineering", count: 8 }, { color: "#8B9DAF", label: "Support", count: 6 }, { color: "#22c55e", label: "Compliance", count: 4 }].map((l, i) => (
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
  const statuses = ["All", "Active", "Pending", "Suspended", "Inactive"];
  const filtered = filter === "All" ? usersData : usersData.filter(e => e.status === filter);
  return (
    <>
      <section className="stats-grid">
        {[
          { icon: "👤", value: usersData.length, label: "Total Users", bar: 100 },
          { icon: "🟢", value: usersData.filter(e => e.status === "Active").length, label: "Active Now", bar: 60, accent: true },
          { icon: "🕓", value: usersData.filter(e => e.status === "Pending").length, label: "Pending Approval", bar: 20 },
          { icon: "⛔", value: usersData.filter(e => e.status === "Suspended" || e.status === "Inactive").length, label: "Suspended / Inactive", bar: 30 },
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
          <div><h2 className="card-title">All Users</h2><p className="card-sub">Full list of system accounts</p></div>
          <div className="filter-row" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {statuses.map(s => (
              <button key={s} className={`btn-outline ${filter === s ? "btn-active" : ""}`} onClick={() => setFilter(s)}
                style={filter === s ? { borderColor: "#D4A574", color: "#D4A574" } : {}}>{s}</button>
            ))}
          </div>
        </div>
        <div className="table-wrapper">
          <table className="excavations-table">
            <thead><tr><th>User</th><th>Department</th><th>Role</th><th>Status</th><th>Access Level</th><th>Approved By</th><th>Last Login</th><th>Sessions</th></tr></thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t.id} onClick={() => navigate("/404")} style={{ cursor: "pointer" }}>
                  <td><div className="t-name">{t.name}</div><div className="t-sub">{t.site}</div></td>
                  <td><span className="region-tag" style={{ color: deptAccents[t.region], borderColor: deptAccents[t.region], background: `${deptAccents[t.region]}1f` }}>{t.region}</span></td>
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
          { icon: "👥", value: adminTeam.length, label: "Administrators", bar: 80 },
          { icon: "🟢", value: adminTeam.filter(m => m.status === "active").length, label: "Online Now", bar: 85, accent: true },
          { icon: "📋", value: adminTeam.reduce((a, m) => a + m.projects, 0), label: "Active Projects", bar: 70 },
          { icon: "🏅", value: Math.round(adminTeam.reduce((a, m) => a + m.experience, 0) / adminTeam.length), label: "Avg. Yrs Exp.", bar: 75 },
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
        <div className="card-header"><div><h2 className="card-title">Administrators & Support Staff</h2><p className="card-sub">Full team directory</p></div></div>
        <div className="team-grid">
          {adminTeam.map((m, i) => (
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
  const filtered = auditLogsData.filter(a => a.name.toLowerCase().includes(search.toLowerCase()) || a.site.toLowerCase().includes(search.toLowerCase()));
  return (
    <>
      <section className="stats-grid">
        {[
          { icon: "📋", value: "12,847", label: "Total Logged Events", bar: 75, accent: true },
          { icon: "🚩", value: "18", label: "Flagged Events", bar: 25 },
          { icon: "🔴", value: "6", label: "High Severity", bar: 15 },
          { icon: "✅", value: "12,780", label: "Resolved", bar: 92 },
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
          <div><h2 className="card-title">Audit Log Registry</h2><p className="card-sub">System-wide activity and security events</p></div>
          <div className="search-box" style={{ flex: "0 0 auto" }}>
            <span className="search-icon">🔍</span>
            <input placeholder="Search audit logs…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="table-wrapper">
          <table className="excavations-table">
            <thead><tr><th>ID</th><th>Event</th><th>User</th><th>Category</th><th>Timestamp</th><th>Severity</th><th>Status</th></tr></thead>
            <tbody>
              {filtered.map(a => (
                <tr key={a.id} onClick={() => navigate("/404")} style={{ cursor: "pointer" }}>
                  <td className="type-col" style={{ fontSize: 11.5, fontFamily: "monospace" }}>{a.id}</td>
                  <td><div className="t-name">{a.name}</div><div className="t-sub">{a.region}</div></td>
                  <td className="date-col">{a.site}</td>
                  <td className="type-col" style={{ fontSize: 12 }}>{a.era}</td>
                  <td className="date-col">{a.date}</td>
                  <td><span style={{ color: conditionColor[a.condition], fontWeight: 700, fontSize: 12 }}>{a.condition}</span></td>
                  <td><span className="status-badge status-review" style={{ background: a.status === "Resolved" ? "rgba(34,197,94,0.14)" : a.status === "Reviewed" ? "rgba(212,165,116,0.14)" : "rgba(245,158,11,0.14)", color: a.status === "Resolved" ? "#86efac" : a.status === "Reviewed" ? "#e8c9a8" : "#fcd34d" }}>{a.status}</span></td>
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
          { icon: "🚨", value: incidentsData.length, label: "Open Incidents", bar: 80, accent: true },
          { icon: "✅", value: incidentsData.filter(p => p.status === "Resolved").length, label: "Resolved", bar: 70 },
          { icon: "🔍", value: incidentsData.filter(p => p.status === "Investigating").length, label: "Investigating", bar: 20 },
          { icon: "👥", value: incidentsData.reduce((a, p) => a + p.citations, 0), label: "Users Affected", bar: 60 },
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
        <div className="card-header"><div><h2 className="card-title">Incident Reports</h2><p className="card-sub">Security and operational incident tracking</p></div></div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {incidentsData.map((p, i) => (
            <div key={i} className="research-card"
              onClick={() => navigate("/404")}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(212,165,116,0.35)"; e.currentTarget.style.transform = "translateX(4px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "none"; }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 180 }}>
                  <div style={{ fontWeight: 700, color: "#fff", fontSize: 14, marginBottom: 4 }}>{p.title}</div>
                  <div style={{ fontSize: 12.5, color: "rgba(245,245,247,0.6)", marginBottom: 6 }}>Reported by {p.authors}</div>
                  <div style={{ fontSize: 12, color: "rgba(245,245,247,0.45)" }}>{p.journal} · {p.year}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, flexShrink: 0 }}>
                  <span style={{ background: paperStatusColor[p.status] + "22", color: paperStatusColor[p.status], borderRadius: 999, padding: "3px 10px", fontSize: 11.5, fontWeight: 700 }}>{p.status}</span>
                  {p.citations > 0 && <span style={{ fontSize: 12, color: "rgba(245,245,247,0.5)" }}>👥 {p.citations} users affected</span>}
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
        <div className="card-header"><div><h2 className="card-title">Maintenance Schedule</h2><p className="card-sub">All upcoming maintenance windows and events</p></div></div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {maintenanceEvents.map((ev, i) => (
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
  const totalAllocated = resourceData.reduce((a, b) => a + b.allocated, 0);
  const totalSpent = resourceData.reduce((a, b) => a + b.spent, 0);
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
        <div className="card-header"><div><h2 className="card-title">Infrastructure Budget by Department</h2><p className="card-sub">Allocation vs spend</p></div></div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {resourceData.map((b, i) => {
            const pct = Math.round((b.spent / b.allocated) * 100);
            return (
              <div key={i} onClick={() => navigate("/404")} style={{ cursor: "pointer" }}>
                <div className="budget-row-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, flexWrap: "wrap", gap: 6 }}>
                  <div>
                    <span style={{ fontWeight: 700, color: "#fff", fontSize: 13.5 }}>{b.site}</span>
                    <span className="region-tag" style={{ marginLeft: 10, color: deptAccents[b.region], borderColor: deptAccents[b.region], background: `${deptAccents[b.region]}1f`, fontSize: 11 }}>{b.region}</span>
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
          { icon: "🔑", value: apiIntegrations.length, label: "Integrations", bar: 80, accent: true },
          { icon: "📡", value: apiIntegrations.reduce((a, p) => a + p.downloads, 0).toLocaleString(), label: "Total Calls / mo", bar: 90 },
          { icon: "🔌", value: apiIntegrations.reduce((a, p) => a + p.pages, 0).toLocaleString(), label: "Total Endpoints", bar: 65 },
          { icon: "🗓️", value: "2025", label: "Latest Added", bar: 100 },
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
        <div className="card-header"><div><h2 className="card-title">API & Integrations</h2><p className="card-sub">Connected services and access points</p></div></div>
        <div className="pub-grid">
          {apiIntegrations.map((pub, i) => (
            <div key={i} className="pub-card"
              onClick={() => navigate("/404")}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(212,165,116,0.4)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "none"; }}>
              <div style={{ fontSize: 30, marginBottom: 12 }}>🔌</div>
              <div style={{ fontWeight: 700, color: "#fff", fontSize: 14, marginBottom: 6, lineHeight: 1.4 }}>{pub.title}</div>
              <div style={{ fontSize: 12, color: "rgba(245,245,247,0.5)", marginBottom: 14 }}>{pub.type} · Added {pub.year} · {pub.pages} endpoints</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                <span style={{ fontSize: 12, color: "#D4A574", fontWeight: 700 }}>📡 {pub.downloads.toLocaleString()} calls/mo</span>
                <button className="btn-outline" style={{ padding: "5px 12px", fontSize: 11.5 }} onClick={(e) => { e.stopPropagation(); navigate("/404"); }}>Manage</button>
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
            <div style={{ fontWeight: 700, color: "#fff", fontSize: 16 }}>Sarah Kim</div>
            <div style={{ fontSize: 13, color: "rgba(245,245,247,0.55)", marginTop: 2 }}>Chief Systems Administrator · s.kim@orbitalink.io</div>
            <div style={{ fontSize: 12, color: "#D4A574", marginTop: 4 }}>📡 12 years with Orbitalink</div>
          </div>
        </div>
        <button className="btn-outline" style={{ borderColor: "#D4A574", color: "#D4A574" }} onClick={() => navigate("/404")}>Edit Profile</button>
      </div>
      <div className="card">
        <div className="card-header"><div><h2 className="card-title">Preferences</h2><p className="card-sub">Notifications and display</p></div></div>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {[
            { label: "Push Notifications", sub: "Receive alerts for security incidents and failed logins", value: notifications, set: setNotifications },
            { label: "Weekly Email Digest", sub: "Summary of admin activity sent every Monday", value: emailDigest, set: setEmailDigest },
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
          <button className="btn-outline" style={{ borderColor: "rgba(239,68,68,0.4)", color: "#fca5a5" }} onClick={() => navigate("/404")}>Revoke All Sessions</button>
        </div>
      </div>
    </>
  );
}

const pageMap = {
  dashboard: { title: "Dashboard", sub: "", component: DashboardPage },
  excavations: { title: "Users", sub: "All registered system accounts and access levels.", component: ExcavationsPage },
  teams: { title: "Admin Team", sub: "Manage your administrators and support staff.", component: TeamsPage },
  artifacts: { title: "Audit Logs", sub: "Registry of all system and security events.", component: ArtifactsPage },
  research: { title: "Incidents", sub: "Security and operational incident tracking.", component: ResearchPage },
  schedule: { title: "Maintenance", sub: "Maintenance windows, patches, and upcoming events.", component: SchedulePage },
  budget: { title: "Resource Usage", sub: "Infrastructure budget allocation and spend.", component: BudgetPage },
  publications: { title: "API & Integrations", sub: "Connected services, keys, and webhooks.", component: PublicationsPage },
  settings: { title: "Settings", sub: "Account preferences and configuration.", component: SettingsPage },
};

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("dashboard");
  const mainRef = useRef(null);

  const currentPage = pageMap[activeNav];
  const PageComponent = currentPage.component;

  useEffect(() => {
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
              {item.id === "excavations" && <span className="nav-badge">{usersData.length}</span>}
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
        <button className="logout-full-btn" style={{ marginTop: "auto" }} onClick={() => navigate("/login")}>↪ Logout</button>
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
              <input placeholder="Search users, logs, integrations…" />
            </div>
            <button className="icon-btn" aria-label="Notifications" onClick={() => navigate("/404")}>🔔<span className="notif-dot" /></button>
          </div>
        </header>

        <div className="content-area">
          <PageComponent navigate={navigate} />
        </div>
      </main>
    </div>
  );
}