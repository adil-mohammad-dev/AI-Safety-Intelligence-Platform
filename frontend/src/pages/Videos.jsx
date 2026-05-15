import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Videos() {
  const navigate = useNavigate();

  const [videos, setVideos] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const fetchVideos = async () => {
    try {
      const response = await api.get("/videos/");
      setVideos(response.data);
    } catch (error) {
      navigate("/login");
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      setMessage("Please select a video file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setLoading(true);

      await api.post("/videos/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage("Video uploaded successfully.");
      setSelectedFile(null);
      fetchVideos();
    } catch (error) {
      setMessage("Video upload failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async (videoId) => {
    try {
      setLoading(true);

      const response = await api.post(`/videos/${videoId}/analyze`);

      const summary = response.data.summary;

setAnalysisResult({
  primary: summary.detection_engine.primary,
  fallback: summary.detection_engine.fallback,
  finalPersonsDetected: summary.detection_engine.final_persons_detected,
  restrictedZoneViolation: summary.restricted_zone_violation,
  incidentCreated: summary.incident_created,
  incidentId: response.data.incident ? response.data.incident.id : null,
});

setMessage("Video analysis completed successfully.");

      fetchVideos();
    } catch (error) {
      setMessage("Video analysis failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <aside style={styles.sidebar}>
        <h2>AI Safety</h2>

        <button style={styles.navBtn} onClick={() => navigate("/dashboard")}>
          Dashboard
        </button>

        <button style={styles.navBtn}>Videos</button>

        <button style={styles.navBtn} onClick={() => navigate("/incidents")}>
          Incidents
        </button>

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
        <h1>Video Analysis</h1>
        <p>Upload workplace safety footage and run AI-powered analysis.</p>

        <section style={styles.panel}>
          <h2>Upload Video</h2>

          <form onSubmit={handleUpload} style={styles.uploadBox}>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setSelectedFile(e.target.files[0])}
            />

            <button style={styles.primaryBtn} type="submit" disabled={loading}>
              {loading ? "Processing..." : "Upload Video"}
            </button>
          </form>

          {message && <p style={styles.message}>{message}</p>}
          {analysisResult && (
  <div style={styles.resultCard}>
    <h3>Analysis Result</h3>

    <div style={styles.resultGrid}>
      <ResultItem label="Primary Engine" value={analysisResult.primary} />
      <ResultItem label="Fallback Engine" value={analysisResult.fallback} />
      <ResultItem
        label="Final Persons Detected"
        value={analysisResult.finalPersonsDetected}
      />
      <ResultItem
        label="Restricted-Zone Violation"
        value={analysisResult.restrictedZoneViolation ? "Yes" : "No"}
      />
      <ResultItem
        label="Incident Created"
        value={analysisResult.incidentCreated ? "Yes" : "No"}
      />
      <ResultItem
        label="Incident ID"
        value={analysisResult.incidentId || "N/A"}
      />
    </div>
  </div>
)}
        </section>

        <section style={styles.panel}>
          <h2>Uploaded Videos</h2>

          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>File Name</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Uploaded At</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>

              <tbody>
                {videos.map((video) => (
                  <tr key={video.id}>
                    <td style={styles.td}>{video.id}</td>

                    <td style={styles.fileNameTd}>{video.file_name}</td>

                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.statusBadge,
                          background:
                            video.status === "completed"
                              ? "#16a34a"
                              : video.status === "processing"
                              ? "#f59e0b"
                              : "#2563eb",
                        }}
                      >
                        {video.status}
                      </span>
                    </td>

                    <td style={styles.dateTd}>
                      {new Date(video.uploaded_at).toLocaleString()}
                    </td>

                    <td style={styles.actionsTd}>
                      <button
                        style={styles.actionBtn}
                        onClick={() => handleAnalyze(video.id)}
                        disabled={loading}
                      >
                        Analyze
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
function ResultItem({ label, value }) {
  return (
    <div style={styles.resultItem}>
      <p style={styles.resultLabel}>{label}</p>
      <h4 style={styles.resultValue}>{value}</h4>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    background: "#f4f6f9",
    color: "#1f2937",
  },

  sidebar: {
    width: "230px",
    minWidth: "230px",
    background: "#0f2a44",
    color: "#fff",
    padding: "25px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  navBtn: {
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    background: "#173b5c",
    color: "#fff",
    cursor: "pointer",
    textAlign: "left",
  },

  logoutBtn: {
    marginTop: "auto",
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    background: "#dc2626",
    color: "#fff",
    cursor: "pointer",
  },

  main: {
    flex: 1,
    padding: "30px",
    overflowX: "hidden",
  },

  panel: {
  background: "#fff",
  padding: "26px",
  borderRadius: "18px",
  boxShadow: "0 14px 35px rgba(15, 42, 68, 0.10)",
  marginTop: "22px",
  border: "1px solid #eef2f7",
},

  uploadBox: {
    display: "flex",
    gap: "15px",
    alignItems: "center",
    flexWrap: "wrap",
  },

  primaryBtn: {
  padding: "11px 18px",
  border: "none",
  borderRadius: "10px",
  background: "linear-gradient(135deg, #0f2a44, #174a73)",
  color: "#fff",
  cursor: "pointer",
  fontWeight: "700",
  boxShadow: "0 8px 18px rgba(15, 42, 68, 0.25)",
},

  tableWrapper: {
    width: "100%",
    overflowX: "auto",
    paddingBottom: "10px",
  },

  table: {
    width: "100%",
    minWidth: "900px",
    borderCollapse: "collapse",
  },

  th: {
    textAlign: "left",
    padding: "12px",
    borderBottom: "1px solid #ddd",
    whiteSpace: "nowrap",
  },

  td: {
    padding: "12px",
    borderBottom: "1px solid #eee",
    verticalAlign: "top",
    whiteSpace: "nowrap",
  },

  fileNameTd: {
    padding: "12px",
    borderBottom: "1px solid #eee",
    verticalAlign: "top",
    minWidth: "350px",
    maxWidth: "420px",
    wordBreak: "break-word",
  },

  dateTd: {
    padding: "12px",
    borderBottom: "1px solid #eee",
    verticalAlign: "top",
    minWidth: "190px",
  },

  actionsTd: {
    padding: "12px",
    borderBottom: "1px solid #eee",
    verticalAlign: "top",
    minWidth: "120px",
  },

  statusBadge: {
    color: "#fff",
    padding: "5px 10px",
    borderRadius: "20px",
    fontSize: "13px",
    whiteSpace: "nowrap",
  },

  actionBtn: {
  padding: "8px 14px",
  border: "none",
  borderRadius: "8px",
  background: "#2563eb",
  color: "#fff",
  cursor: "pointer",
  fontWeight: "700",
},

  resultCard: {
  marginTop: "22px",
  padding: "24px",
  borderRadius: "16px",
  background: "#f8fafc",
  border: "1px solid #dbeafe",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.8)",
},

resultGrid: {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "16px",
  marginTop: "18px",
},

resultItem: {
  background: "linear-gradient(135deg, #ffffff, #f8fafc)",
  padding: "18px",
  borderRadius: "14px",
  border: "1px solid #e5e7eb",
  boxShadow: "0 8px 18px rgba(15, 42, 68, 0.08)",
},

resultLabel: {
  margin: 0,
  fontSize: "13px",
  color: "#64748b",
  fontWeight: "600",
  textTransform: "uppercase",
  letterSpacing: "0.4px",
},

resultValue: {
  margin: "8px 0 0",
  fontSize: "19px",
  color: "#0f2a44",
  fontWeight: "800",
},

  message: {
    marginTop: "15px",
    color: "#0f766e",
  },
};

export default Videos;