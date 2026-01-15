import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { fetchPendingRequests } from "../api/mlmApi";
import ApproveModal from "../components/mlm/ApproveModal";

export default function ApprovalRequests() {
  const [requests, setRequests] = useState([]);
  const [activeRequest, setActiveRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadRequests = () => {
    setLoading(true);
    fetchPendingRequests()
      .then(setRequests)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadRequests();
  }, []);

  return (
    <MainLayout>
      <h2 style={{ marginBottom: 20 }}>
        Pending Registration Requests
      </h2>

      {loading && <p>Loading requests...</p>}

      {!loading && requests.length === 0 && (
        <p>No pending requests.</p>
      )}

      {!loading &&
        requests.map((req) => (
          <div key={req.id} style={card}>
            <div style={info}>
              <strong>{req.username}</strong>
              <p style={muted}>{req.email}</p>
              <p>
                Sponsor: <b>{req.sponsor}</b>
              </p>
              <small style={muted}>
                {new Date(req.created_at).toLocaleString()}
              </small>
            </div>

            <button
              style={actionBtn}
              onClick={() => setActiveRequest(req)}
            >
              Review
            </button>
          </div>
        ))}

      {activeRequest && (
        <ApproveModal
          request={activeRequest}
          onClose={() => setActiveRequest(null)}
          onSuccess={() => {
            setActiveRequest(null);
            loadRequests(); // ✅ SAFE refresh
          }}
        />
      )}
    </MainLayout>
  );
}

/* ================= STYLES ================= */

const card = {
  border: "1px solid #e5e5e5",
  padding: 16,
  borderRadius: 10,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 16,
  marginBottom: 12,
  flexWrap: "wrap", // ✅ mobile friendly
};

const info = {
  minWidth: 220,
};

const muted = {
  color: "#666",
  fontSize: 14,
  margin: "4px 0",
};

const actionBtn = {
  background: "#000",
  color: "#fff",
  border: "none",
  padding: "10px 16px",
  cursor: "pointer",
  borderRadius: 6,
};