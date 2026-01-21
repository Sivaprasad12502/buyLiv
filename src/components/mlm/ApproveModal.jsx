import { useEffect, useState } from "react";
import {
  fetchAvailableParents,
  approveRequest,
  rejectRequest,
} from "../../api/mlmApi";
import './ApproveModal.scss'

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
    <div className="approve-modal-overlay" onClick={onClose}>
      <div className="approve-modal" onClick={(e) => e.stopPropagation()}>
        <div className="approve-modal__header">
          <h3>Approve / Reject Request</h3>
          <button className="close-btn" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="approve-modal__user-info">
          <strong>{request.username}</strong>
          <span>{request.email}</span>
        </div>

        {error && <div className="approve-modal__error">{error}</div>}

        <div className="approve-modal__form">
          <div className="form-group">
            <label>Select Parent</label>
            <select
              value={parentId}
              onChange={(e) => {
                setParentId(e.target.value);
                setPosition("");
              }}
            >
              <option value="">-- Select parent --</option>
              {parents.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.username}
                </option>
              ))}
            </select>
          </div>

          {selectedParent && (
            <div className="form-group">
              <label>Select Position</label>
              <div className="position-buttons">
                {selectedParent.left_available && (
                  <button
                    className={`position-btn ${position === "LEFT" ? "active" : ""}`}
                    onClick={() => setPosition("LEFT")}
                    type="button"
                  >
                    <span>LEFT</span>
                  </button>
                )}
                {selectedParent.right_available && (
                  <button
                    className={`position-btn ${position === "RIGHT" ? "active" : ""}`}
                    onClick={() => setPosition("RIGHT")}
                    type="button"
                  >
                    <span>RIGHT</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="approve-modal__actions">
          <button
            onClick={onClose}
            className="btn btn-cancel"
            disabled={loading}
          >
            Cancel
          </button>

          <button
            onClick={handleReject}
            className="btn btn-reject"
            disabled={loading}
          >
            {loading ? "Processing..." : "Reject"}
          </button>

          <button
            onClick={handleApprove}
            className="btn btn-approve"
            disabled={loading || !parentId || !position}
          >
            {loading ? "Processing..." : "Approve"}
          </button>
        </div>
      </div>
    </div>
  );
}