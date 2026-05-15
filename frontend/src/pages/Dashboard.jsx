import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Dashboard() {
  const navigate = useNavigate();

  const [summary, setSummary] = useState(null);
  const [recentIncidents, setRecentIncidents] = useState([]);
  const [severity, setSeverity] = useState(null);

  const fetchDashboardData = async () => {
    try {
      const summaryRes = await api.get("/dashboard/summary");
      const incidentsRes = await api.get("/dashboard/recent-incidents");
      const severityRes = await api.get("/dashboard/severity-breakdown");

      setSummary(summaryRes.data);
      setRecentIncidents(incidentsRes.data);
      setSeverity(severityRes.data);
    } catch (error) {
      console.error(error);
      navigate("/login");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (!summary || !severity) {
    return (
      <div style={styles.loadingPage}>
        <h2>Loading dashboard...</h2>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <aside style={styles.sidebar}>
        <div>
          <h2 style={styles.logo}>AI Safety</h2>
          <p style={styles.logoSub}>Intelligence Platform</p>
        </div>

        <nav style={styles.nav}>
          <button style={styles.activeNavBtn}>Dashboard</button>

          <button style={styles.navBtn} onClick={() => navigate("/videos")}>
            Videos
          </button>

          <button style={styles.navBtn} onClick={() => navigate("/incidents")}>
            Incidents
          </button>
        </nav>

        <button style={styles.logoutBtn} onClick={handleLogout}>
          Logout
        </button>
      </aside>

      <main style={styles.main}>
        <header style={styles.header}>
          <div>
            <p style={styles.headerLabel}>Operations Monitoring</p>
            <h1 style={styles.title}>Safety Intelligence Dashboard</h1>
            <p style={styles.subtitle}>
              Monitor video analysis, safety incidents, severity trends, and
              restricted-zone risk events from one centralized dashboard.
            </p>
          </div>

          <div style={styles.headerBadge}>
            <span style={styles.liveDot}></span>
            System Active
          </div>
        </header>

        <section style={styles.cards}>
          <Card title="Total Videos" value={summary.total_videos} />
          <Card title="Completed Analyses" value={summary.completed_analyses} />
          <Card title="Total Incidents" value={summary.total_incidents} />
          <Card title="High Severity" value={summary.high_severity_incidents} />
          <Card title="Open Incidents" value={summary.open_incidents} />
        </section>

        <section style={styles.sectionGrid}>
          <div style={styles.panel}>
            <div style={styles.panelHeader}>
              <div>
                <h2 style={styles.panelTitle}>Recent Incidents</h2>
                <p style={styles.panelSub}>
                  Latest detected safety events from uploaded video analysis.
                </p>
              </div>

              <button
                style={styles.smallBtn}
                onClick={() => navigate("/incidents")}
              >
                View All
              </button>
            </div>

            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>ID</th>
                    <th style={styles.th}>Type</th>
                    <th style={styles.th}>Severity</th>
                    <th style={styles.th}>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {recentIncidents.map((incident) => (
                    <tr key={incident.id}>
                      <td style={styles.td}>#{incident.id}</td>
                      <td style={styles.td}>{incident.incident_type}</td>

                      <td style={styles.td}>
                        <span
                          style={{
                            ...styles.badge,
                            ...(incident.severity === "high"
                              ? styles.highBadge
                              : incident.severity === "medium"
                              ? styles.mediumBadge
                              : styles.lowBadge),
                          }}
                        >
                          {incident.severity}
                        </span>
                      </td>

                      <td style={styles.td}>
                        <span
                          style={{
                            ...styles.statusBadge,
                            ...(incident.status === "resolved"
                              ? styles.resolvedBadge
                              : styles.openBadge),
                          }}
                        >
                          {incident.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div style={styles.severityPanel}>
            <h2 style={styles.panelTitle}>Severity Breakdown</h2>
            <p style={styles.panelSub}>
              Distribution of incidents by operational risk level.
            </p>

            <div style={styles.severityList}>
              <SeverityRow label="Low" value={severity.low} type="low" />
              <SeverityRow label="Medium" value={severity.medium} type="medium" />
              <SeverityRow label="High" value={severity.high} type="high" />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div style={styles.card}>
      <p style={styles.cardTitle}>{title}</p>
      <h2 style={styles.cardValue}>{value}</h2>
    </div>
  );
}

function SeverityRow({ label, value, type }) {
  const colorStyle =
    type === "high"
      ? styles.severityHigh
      : type === "medium"
      ? styles.severityMedium
      : styles.severityLow;

  return (
    <div style={styles.severityRow}>
      <span style={styles.severityLabel}>{label}</span>
      <strong style={{ ...styles.severityValue, ...colorStyle }}>{value}</strong>
    </div>
  );
}

const styles = {
  loadingPage: {
    width: "100%",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f4f7fb",
  },

  page: {
    width: "100%",
    minHeight: "100vh",
    display: "flex",
    background: "#f4f7fb",
    color: "#111827",
  },

  sidebar: {
    width: "260px",
    minHeight: "100vh",
    background: "#0f2a44",
    color: "#ffffff",
    padding: "28px 22px",
    display: "flex",
    flexDirection: "column",
    position: "fixed",
    left: 0,
    top: 0,
    bottom: 0,
    boxShadow: "8px 0 24px rgba(15, 42, 68, 0.14)",
  },

  logo: {
    fontSize: "27px",
    marginBottom: "6px",
    letterSpacing: "-0.5px",
  },

  logoSub: {
    fontSize: "13px",
    color: "#b8c7d6",
    margin: 0,
  },

  nav: {
    marginTop: "35px",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },

  navBtn: {
    width: "100%",
    padding: "13px 15px",
    border: "none",
    borderRadius: "10px",
    background: "#173b5c",
    color: "#ffffff",
    cursor: "pointer",
    textAlign: "left",
    fontSize: "15px",
    fontWeight: "600",
  },

  activeNavBtn: {
    width: "100%",
    padding: "13px 15px",
    border: "none",
    borderRadius: "10px",
    background: "#2563eb",
    color: "#ffffff",
    cursor: "pointer",
    textAlign: "left",
    fontSize: "15px",
    fontWeight: "700",
    boxShadow: "0 8px 18px rgba(37, 99, 235, 0.28)",
  },

  logoutBtn: {
    marginTop: "auto",
    width: "100%",
    padding: "13px 15px",
    border: "none",
    borderRadius: "10px",
    background: "#dc2626",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "700",
  },

  main: {
    marginLeft: "260px",
    width: "calc(100% - 260px)",
    minHeight: "100vh",
    padding: "34px",
    overflowX: "hidden",
  },

  header: {
    marginBottom: "28px",
    padding: "28px",
    borderRadius: "22px",
    background: "linear-gradient(135deg, #0f2a44, #174a73)",
    color: "#ffffff",
    boxShadow: "0 18px 40px rgba(15, 42, 68, 0.20)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
  },

  headerLabel: {
    margin: "0 0 8px",
    color: "#bfdbfe",
    fontSize: "13px",
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: "0.8px",
  },

  title: {
    fontSize: "34px",
    color: "#ffffff",
    margin: "0 0 10px",
    letterSpacing: "-0.8px",
  },

  subtitle: {
    fontSize: "16px",
    color: "#dbeafe",
    margin: 0,
    maxWidth: "760px",
    lineHeight: "1.6",
  },

  headerBadge: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "rgba(255,255,255,0.12)",
    padding: "10px 14px",
    borderRadius: "999px",
    border: "1px solid rgba(255,255,255,0.18)",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },

  liveDot: {
    width: "10px",
    height: "10px",
    borderRadius: "999px",
    background: "#22c55e",
    display: "inline-block",
  },

  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
    gap: "18px",
    marginBottom: "26px",
  },

  card: {
    background: "#ffffff",
    padding: "24px",
    borderRadius: "18px",
    boxShadow: "0 12px 28px rgba(15, 42, 68, 0.10)",
    border: "1px solid #eef2f7",
  },

  cardTitle: {
    fontSize: "13px",
    color: "#64748b",
    margin: 0,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: "0.4px",
  },

  cardValue: {
    fontSize: "34px",
    color: "#0f2a44",
    margin: "12px 0 0",
    letterSpacing: "-0.6px",
  },

  sectionGrid: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "22px",
    alignItems: "start",
  },

  panel: {
    background: "#ffffff",
    padding: "24px",
    borderRadius: "18px",
    boxShadow: "0 12px 28px rgba(15, 42, 68, 0.10)",
    border: "1px solid #eef2f7",
    minWidth: 0,
  },

  severityPanel: {
    background: "#ffffff",
    padding: "24px",
    borderRadius: "18px",
    boxShadow: "0 12px 28px rgba(15, 42, 68, 0.10)",
    border: "1px solid #eef2f7",
    minWidth: 0,
  },

  panelHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "16px",
    marginBottom: "18px",
  },

  panelTitle: {
    margin: "0 0 6px",
    color: "#0f2a44",
    fontSize: "22px",
  },

  panelSub: {
    margin: 0,
    color: "#64748b",
    fontSize: "14px",
    lineHeight: "1.5",
  },

  smallBtn: {
    padding: "9px 14px",
    border: "none",
    borderRadius: "10px",
    background: "#0f2a44",
    color: "#ffffff",
    cursor: "pointer",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },

  tableWrapper: {
    width: "100%",
    overflowX: "auto",
  },

  table: {
    width: "100%",
    minWidth: "650px",
    borderCollapse: "collapse",
  },

  th: {
    textAlign: "left",
    padding: "14px 10px",
    borderBottom: "1px solid #e5e7eb",
    color: "#475569",
    fontSize: "13px",
    textTransform: "uppercase",
    letterSpacing: "0.4px",
  },

  td: {
    padding: "15px 10px",
    borderBottom: "1px solid #f1f5f9",
    fontSize: "14px",
    color: "#111827",
  },

  badge: {
    padding: "5px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    textTransform: "capitalize",
    fontWeight: "800",
  },

  highBadge: {
    background: "#fee2e2",
    color: "#991b1b",
  },

  mediumBadge: {
    background: "#fef3c7",
    color: "#92400e",
  },

  lowBadge: {
    background: "#dcfce7",
    color: "#166534",
  },

  statusBadge: {
    padding: "5px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    textTransform: "capitalize",
    fontWeight: "800",
  },

  resolvedBadge: {
    background: "#dcfce7",
    color: "#166534",
  },

  openBadge: {
    background: "#dbeafe",
    color: "#1e40af",
  },

  severityList: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    marginTop: "18px",
  },

  severityRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px",
    borderRadius: "14px",
    background: "#f8fafc",
    border: "1px solid #e5e7eb",
  },

  severityLabel: {
    color: "#334155",
    fontWeight: "700",
  },

  severityValue: {
    fontSize: "22px",
  },

  severityLow: {
    color: "#166534",
  },

  severityMedium: {
    color: "#92400e",
  },

  severityHigh: {
    color: "#991b1b",
  },
};

export default Dashboard;