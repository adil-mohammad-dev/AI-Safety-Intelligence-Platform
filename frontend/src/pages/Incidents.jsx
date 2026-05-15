import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Incidents() {
  const navigate = useNavigate();

  const [incidents, setIncidents] = useState([]);
  const [message, setMessage] = useState("");

  const fetchIncidents = async () => {
    try {
      const response = await api.get("/incidents/");
      setIncidents(response.data);
    } catch (error) {
      navigate("/login");
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  const handleResolve = async (incidentId) => {
    try {
      await api.patch(`/incidents/${incidentId}/resolve`);
      setMessage(`Incident #${incidentId} marked as resolved.`);
      fetchIncidents();
    } catch (error) {
      setMessage("Failed to resolve incident.");
    }
  };

  const handleGenerateReport = async (incidentId) => {
    try {
      await api.post(`/reports/incidents/${incidentId}/generate`);
      navigate(`/reports/${incidentId}`);
    } catch (error) {
      setMessage("Failed to generate report.");
    }
  };

  const totalIncidents = incidents.length;
  const openIncidents = incidents.filter((item) => item.status === "open").length;
  const highSeverity = incidents.filter((item) => item.severity === "high").length;
  const resolvedIncidents = incidents.filter(
    (item) => item.status === "resolved"
  ).length;

  return (
    <div style={styles.page}>
      <aside style={styles.sidebar}>
        <div>
          <h2 style={styles.logo}>AI Safety</h2>
          <p style={styles.logoSub}>Intelligence Platform</p>
        </div>

        <nav style={styles.nav}>
          <button style={styles.navBtn} onClick={() => navigate("/dashboard")}>
            Dashboard
          </button>

          <button style={styles.navBtn} onClick={() => navigate("/videos")}>
            Videos
          </button>

          <button style={styles.activeNavBtn}>Incidents</button>
        </nav>

        <button
          style={styles.logoutBtn}
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/login");
          }}
        >
          Logout
        </button>
      </aside>

      <main style={styles.main}>
        <header style={styles.header}>
          <div>
            <p style={styles.headerLabel}>Safety Operations</p>
            <h1 style={styles.title}>Incident Management</h1>
            <p style={styles.subtitle}>
              Review detected safety incidents, resolve operational risks, and
              generate AI-powered incident reports.
            </p>
          </div>

          <div style={styles.headerBadge}>
            <span style={styles.liveDot}></span>
            Incident Center
          </div>
        </header>

        <section style={styles.cards}>
          <MetricCard title="Total Incidents" value={totalIncidents} />
          <MetricCard title="Open Incidents" value={openIncidents} />
          <MetricCard title="High Severity" value={highSeverity} />
          <MetricCard title="Resolved" value={resolvedIncidents} />
        </section>

        {message && <p style={styles.message}>{message}</p>}

        <section style={styles.panel}>
          <div style={styles.panelHeader}>
            <div>
              <h2 style={styles.panelTitle}>All Incidents</h2>
              <p style={styles.panelSub}>
                Detected events created from video analysis and restricted-zone
                rule evaluation.
              </p>
            </div>

            <button style={styles.refreshBtn} onClick={fetchIncidents}>
              Refresh
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
                  <th style={styles.th}>Description</th>
                  <th style={styles.th}>Created At</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {incidents.map((incident) => (
                  <tr key={incident.id}>
                    <td style={styles.td}>
                      <strong>#{incident.id}</strong>
                    </td>

                    <td style={styles.typeTd}>{incident.incident_type}</td>

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

                    <td style={styles.descriptionTd}>
                      {incident.description}
                    </td>

                    <td style={styles.dateTd}>
                      {new Date(incident.created_at).toLocaleString()}
                    </td>

                    <td style={styles.actionsTd}>
                      {incident.status !== "resolved" && (
                        <button
                          style={styles.resolveBtn}
                          onClick={() => handleResolve(incident.id)}
                        >
                          Resolve
                        </button>
                      )}

                      <button
                        style={styles.reportBtn}
                        onClick={() => handleGenerateReport(incident.id)}
                      >
                        Report
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

function MetricCard({ title, value }) {
  return (
    <div style={styles.metricCard}>
      <p style={styles.metricTitle}>{title}</p>
      <h2 style={styles.metricValue}>{value}</h2>
    </div>
  );
}

const styles = {
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

  metricCard: {
    background: "#ffffff",
    padding: "24px",
    borderRadius: "18px",
    boxShadow: "0 12px 28px rgba(15, 42, 68, 0.10)",
    border: "1px solid #eef2f7",
  },

  metricTitle: {
    fontSize: "13px",
    color: "#64748b",
    margin: 0,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: "0.4px",
  },

  metricValue: {
    fontSize: "34px",
    color: "#0f2a44",
    margin: "12px 0 0",
    letterSpacing: "-0.6px",
  },

  message: {
    color: "#0f766e",
    background: "#ecfdf5",
    border: "1px solid #a7f3d0",
    padding: "12px 14px",
    borderRadius: "12px",
    marginBottom: "18px",
    fontWeight: "600",
  },

  panel: {
    background: "#ffffff",
    padding: "24px",
    borderRadius: "18px",
    boxShadow: "0 12px 28px rgba(15, 42, 68, 0.10)",
    border: "1px solid #eef2f7",
    maxWidth: "100%",
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

  refreshBtn: {
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
    paddingBottom: "10px",
  },

  table: {
    width: "100%",
    minWidth: "1120px",
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
    whiteSpace: "nowrap",
  },

  td: {
    padding: "15px 10px",
    borderBottom: "1px solid #f1f5f9",
    fontSize: "14px",
    color: "#111827",
    verticalAlign: "top",
    whiteSpace: "nowrap",
  },

  typeTd: {
    padding: "15px 10px",
    borderBottom: "1px solid #f1f5f9",
    fontSize: "14px",
    color: "#111827",
    verticalAlign: "top",
    whiteSpace: "nowrap",
    minWidth: "190px",
  },

  descriptionTd: {
    padding: "15px 10px",
    borderBottom: "1px solid #f1f5f9",
    fontSize: "14px",
    color: "#111827",
    verticalAlign: "top",
    minWidth: "330px",
    maxWidth: "430px",
    lineHeight: "1.5",
  },

  dateTd: {
    padding: "15px 10px",
    borderBottom: "1px solid #f1f5f9",
    fontSize: "14px",
    color: "#111827",
    verticalAlign: "top",
    minWidth: "190px",
  },

  actionsTd: {
    padding: "15px 10px",
    borderBottom: "1px solid #f1f5f9",
    verticalAlign: "top",
    minWidth: "160px",
  },

  badge: {
    padding: "5px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    textTransform: "capitalize",
    fontWeight: "800",
    whiteSpace: "nowrap",
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
    whiteSpace: "nowrap",
  },

  resolvedBadge: {
    background: "#dcfce7",
    color: "#166534",
  },

  openBadge: {
    background: "#dbeafe",
    color: "#1e40af",
  },

  resolveBtn: {
    padding: "8px 12px",
    border: "none",
    borderRadius: "8px",
    background: "#16a34a",
    color: "#fff",
    cursor: "pointer",
    marginRight: "8px",
    marginBottom: "6px",
    fontWeight: "700",
  },

  reportBtn: {
    padding: "8px 12px",
    border: "none",
    borderRadius: "8px",
    background: "#2563eb",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "700",
  },
};

export default Incidents;