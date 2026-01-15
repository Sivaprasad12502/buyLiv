import { useEffect, useState } from "react";
import {
  fetchAvailableParents,
  approveRequest,
  rejectRequest,
} from "../../api/mlmApi";

export default function ApproveModal({ request, onClose, onSuccess }) {
  const [parents, setParents] = useState([]);
  const [parentId, setParentId] = useState("");
  const [position, setPosition] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // ✅ FIX

  useEffect(() => {
    fetchAvailableParents().then(setParents);
  }, []);

  const selectedParent = parents.find(
    (p) => p.id === Number(parentId)
  );

  /* ================= APPROVE ================= */
  const handleApprove = async () => {
    setError("");

    if (!parentId || !position) {
      setError("Select parent and position");
      return;
    }

    try {
      setLoading(true);
      await approveRequest(request.id, {
        parent_id: parentId,
        position,
      });
      onSuccess();
    } catch (err) {
      setError(
        err?.response?.data?.detail || "Approval failed"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= REJECT ================= */
  const handleReject = async () => {
    const confirmReject = window.confirm(
      `Reject registration for ${request.username}?`
    );
    if (!confirmReject) return;

    try {
      setLoading(true);
      await rejectRequest(request.id);
      onSuccess();
    } catch (err) {
      setError(
        err?.response?.data?.detail || "Rejection failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={overlay}>
      <div style={modal}>
        <h3>Approve / Reject</h3>

        <p style={{ fontSize: 14, marginBottom: 10 }}>
          <strong>{request.username}</strong>
          <br />
          {request.email}
        </p>

        {error && <p style={errorText}>{error}</p>}

        {/* ================= APPROVE SECTION ================= */}
        <label style={label}>Parent</label>
        <select
          value={parentId}
          onChange={(e) => {
            setParentId(e.target.value);
            setPosition("");
          }}
          style={select}
        >
          <option value="">Select parent</option>
          {parents.map((p) => (
            <option key={p.id} value={p.id}>
              {p.username}
            </option>
          ))}
        </select>

        {selectedParent && (
          <>
            <label style={{ ...label, marginTop: 12 }}>
              Position
            </label>
            <div style={{ display: "flex", gap: 10 }}>
              {selectedParent.left_available && (
                <button
                  style={posBtn(position === "LEFT")}
                  onClick={() => setPosition("LEFT")}
                >
                  LEFT
                </button>
              )}
              {selectedParent.right_available && (
                <button
                  style={posBtn(position === "RIGHT")}
                  onClick={() => setPosition("RIGHT")}
                >
                  RIGHT
                </button>
              )}
            </div>
          </>
        )}

        {/* ================= ACTIONS ================= */}
        <div style={actions}>
          <button
            onClick={onClose}
            style={cancelBtn}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            onClick={handleReject}
            style={rejectBtn}
            disabled={loading}
          >
            Reject
          </button>

          <button
            onClick={handleApprove}
            style={approveBtn}
            disabled={loading}
          >
            Approve
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.45)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const modal = {
  background: "#fff",
  padding: 24,
  borderRadius: 10,
  width: 420,
};

const label = {
  display: "block",
  fontSize: 13,
  marginBottom: 6,
};

const select = {
  width: "100%",
  padding: "8px 10px",
  borderRadius: 6,
  border: "1px solid #ccc",
};

const posBtn = (active) => ({
  padding: "8px 14px",
  border: active ? "2px solid #000" : "1px solid #ccc",
  background: "#fff",
  cursor: "pointer",
});

const actions = {
  marginTop: 24,
  display: "flex",
  justifyContent: "flex-end",
  gap: 10,
};

const cancelBtn = {
  padding: "10px 14px",
  border: "1px solid #ccc",
  background: "#fff",
};

const rejectBtn = {
  padding: "10px 14px",
  border: "none",
  background: "#dc2626",
  color: "#fff",
};

const approveBtn = {
  padding: "10px 14px",
  border: "none",
  background: "#000",
  color: "#fff",
};

const errorText = {
  color: "red",
  marginBottom: 10,
};