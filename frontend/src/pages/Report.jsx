import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function formatAIReport(text) {
  if (!text) return null;

  return text.split("\n").map((line, index) => {
    const cleanLine = line.replaceAll("**", "").trim();

    if (!cleanLine) {
      return <div key={index} style={styles.smallGap}></div>;
    }

    const inlineSections = [
      "Risk Analysis:",
      "Recommended Action:",
      "Status Note:",
      "Incident Summary:",
      "Incident Type:",
      "Severity:",
      "Final Note:",
    ];

    const matchedInlineSection = inlineSections.find((section) =>
      cleanLine.startsWith(section)
    );

    if (matchedInlineSection) {
      const remainingText = cleanLine.replace(matchedInlineSection, "").trim();

      return (
        <p key={index} style={styles.reportText}>
          <strong style={styles.inlineHeading}>{matchedInlineSection}</strong>{" "}
          {remainingText}
        </p>
      );
    }

    if (
      cleanLine.endsWith(":") ||
      cleanLine.startsWith("Incident Report") ||
      cleanLine.startsWith("Incident ID") ||
      cleanLine.startsWith("Date") ||
      cleanLine.startsWith("Time") ||
      cleanLine.startsWith("AI Summary") ||
      cleanLine.startsWith("Recommendations") ||
      cleanLine.startsWith("Responsible Person") ||
      cleanLine.startsWith("Review Date") ||
      cleanLine.startsWith("Review Status")
    ) {
      return (
        <h3 key={index} style={styles.aiHeading}>
          {cleanLine}
        </h3>
      );
    }

    if (/^\d+\./.test(cleanLine)) {
      return (
        <p key={index} style={styles.numberedPoint}>
          {cleanLine}
        </p>
      );
    }

    if (cleanLine.startsWith("-")) {
      return (
        <p key={index} style={styles.bulletPoint}>
          {cleanLine}
        </p>
      );
    }

    return (
      <p key={index} style={styles.reportText}>
        {cleanLine}
      </p>
    );
  });
}

function Report() {
  const navigate = useNavigate();
  const { incidentId } = useParams();

  const [report, setReport] = useState(null);
  const [error, setError] = useState("");

  const fetchReport = async () => {
    try {
      const response = await api.get(`/reports/incidents/${incidentId}`);
      setReport(response.data);
    } catch (error) {
      setError("Report not found. Please generate it from the incidents page.");
    }
  };

  useEffect(() => {
    fetchReport();
  }, [incidentId]);

  const handleDownload = () => {
    if (!report) return;

    const cleanSummary = report.ai_summary.replaceAll("**", "");

    const reportText = `
AI SAFETY INCIDENT REPORT

Report ID: ${report.id}
Incident ID: ${report.incident_id}
Created At: ${new Date(report.created_at).toLocaleString()}

AI Summary:
${cleanSummary}

Risk Analysis:
${report.risk_analysis}

Recommended Action:
${report.recommended_action}
`;

    const blob = new Blob([reportText], {
      type: "text/plain",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `incident-report-${report.incident_id}.txt`;
    link.click();

    URL.revokeObjectURL(url);
  };

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

          <button style={styles.navBtn} onClick={() => navigate("/incidents")}>
            Incidents
          </button>
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
            <p style={styles.headerLabel}>AI Incident Intelligence</p>
            <h1 style={styles.title}>AI Incident Report</h1>
            <p style={styles.subtitle}>
              Review AI-generated safety summaries, risk analysis, and
              recommended actions based on detected incident data.
            </p>
          </div>

          <div style={styles.headerBadge}>
            <span style={styles.liveDot}></span>
            Report Ready
          </div>
        </header>

        {error && <p style={styles.error}>{error}</p>}

        {!report && !error && (
          <section style={styles.panel}>
            <p>Loading report...</p>
          </section>
        )}

        {report && (
          <>
            <section style={styles.cards}>
              <InfoCard title="Report ID" value={`#${report.id}`} />
              <InfoCard title="Incident ID" value={`#${report.incident_id}`} />
              <InfoCard
                title="Generated At"
                value={new Date(report.created_at).toLocaleString()}
              />
            </section>

            <section style={styles.panel}>
              <div style={styles.reportHeader}>
                <div>
                  <h2 style={styles.panelTitle}>
                    Incident Report #{report.incident_id}
                  </h2>
                  <p style={styles.panelSub}>
                    AI-generated incident intelligence report for safety review.
                  </p>
                </div>

                <button style={styles.downloadBtn} onClick={handleDownload}>
                  Download Report
                </button>
              </div>

              <div style={styles.reportBox}>
                <h3 style={styles.sectionTitle}>AI Generated Report</h3>

                <div style={styles.aiReportContent}>
                  {formatAIReport(report.ai_summary)}
                </div>
              </div>

              <div style={styles.reportGrid}>
                <div style={styles.smallReportBox}>
                  <h3 style={styles.sectionTitle}>Risk Analysis</h3>
                  <p style={styles.reportText}>{report.risk_analysis}</p>
                </div>

                <div style={styles.smallReportBox}>
                  <h3 style={styles.sectionTitle}>Recommended Action</h3>
                  <p style={styles.reportText}>{report.recommended_action}</p>
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

function InfoCard({ title, value }) {
  return (
    <div style={styles.infoCard}>
      <p style={styles.infoTitle}>{title}</p>
      <h2 style={styles.infoValue}>{value}</h2>
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
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "18px",
    marginBottom: "26px",
  },

  infoCard: {
    background: "#ffffff",
    padding: "24px",
    borderRadius: "18px",
    boxShadow: "0 12px 28px rgba(15, 42, 68, 0.10)",
    border: "1px solid #eef2f7",
  },

  infoTitle: {
    fontSize: "13px",
    color: "#64748b",
    margin: 0,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: "0.4px",
  },

  infoValue: {
    fontSize: "22px",
    color: "#0f2a44",
    margin: "12px 0 0",
    lineHeight: "1.3",
  },

  panel: {
    background: "#ffffff",
    padding: "26px",
    borderRadius: "18px",
    boxShadow: "0 12px 28px rgba(15, 42, 68, 0.10)",
    border: "1px solid #eef2f7",
    maxWidth: "100%",
  },

  reportHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "18px",
    borderBottom: "1px solid #e5e7eb",
    paddingBottom: "18px",
    marginBottom: "24px",
  },

  panelTitle: {
    margin: "0 0 6px",
    color: "#0f2a44",
    fontSize: "24px",
  },

  panelSub: {
    margin: 0,
    color: "#64748b",
    fontSize: "14px",
    lineHeight: "1.5",
  },

  reportBox: {
    marginBottom: "24px",
  },

  sectionTitle: {
    color: "#0f2a44",
    fontSize: "21px",
    marginBottom: "12px",
  },

  aiReportContent: {
    background: "#f8fafc",
    padding: "22px 24px",
    borderRadius: "14px",
    lineHeight: "1.6",
    border: "1px solid #e5e7eb",
  },

  smallGap: {
    height: "10px",
  },

  aiHeading: {
    marginTop: "12px",
    marginBottom: "6px",
    color: "#0f2a44",
    fontSize: "19px",
    fontWeight: "800",
  },

  inlineHeading: {
    color: "#0f2a44",
    fontWeight: "800",
  },

  reportText: {
    margin: "6px 0 10px",
    fontSize: "15.5px",
    color: "#1f2937",
    lineHeight: "1.6",
  },

  numberedPoint: {
    margin: "8px 0 8px 18px",
    fontSize: "15.5px",
    color: "#1f2937",
    lineHeight: "1.6",
  },

  bulletPoint: {
    margin: "6px 0 6px 18px",
    fontSize: "15.5px",
    color: "#1f2937",
    lineHeight: "1.6",
  },

  reportGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
  },

  smallReportBox: {
    background: "#f8fafc",
    padding: "20px",
    borderRadius: "14px",
    border: "1px solid #e5e7eb",
  },

  downloadBtn: {
    padding: "10px 16px",
    border: "none",
    borderRadius: "10px",
    background: "#0f2a44",
    color: "#fff",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },

  error: {
    color: "#991b1b",
    background: "#fee2e2",
    border: "1px solid #fecaca",
    padding: "12px 14px",
    borderRadius: "12px",
    marginTop: "20px",
    fontWeight: "700",
  },
};

export default Report;