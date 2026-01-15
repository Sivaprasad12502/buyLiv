import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import "./PlacementModal.scss";

export default function PlacementModal({ parentId, position, onClose }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ================= USERNAME AVAILABILITY STATE ================= */
  const [usernameStatus, setUsernameStatus] = useState("idle");
  // idle | checking | available | unavailable
  const [usernameSuggestions, setUsernameSuggestions] = useState([]);

  const [form, setForm] = useState({
    username: "",
    password: "",
    email: "",
    phone: "",
    pan_number: "",
    pan_image: null,
    address: "",
    city: "",
    state: "",
    country: "India",
    pincode: "",
  });

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  /* ================= USERNAME CHECK (NEW LOGIC) ================= */
  useEffect(() => {
    if (!form.username || form.username.length < 3) {
      setUsernameStatus("idle");
      setUsernameSuggestions([]);
      return;
    }

    const delay = setTimeout(async () => {
      try {
        setUsernameStatus("checking");

        const res = await axiosClient.get(
          `/accounts/username/check/?username=${form.username}`
        );

        if (res.data.available) {
          setUsernameStatus("available");
          setUsernameSuggestions([]);
          handleChange("username", res.data.username);
        } else {
          setUsernameStatus("unavailable");
          setUsernameSuggestions(res.data.suggestions || []);
        }
      } catch {
        setUsernameStatus("unavailable");
      }
    }, 400);

    return () => clearTimeout(delay);
  }, [form.username]);

  const handleSubmit = async () => {
    setError("");

    /* ================= EXISTING VALIDATION (UNCHANGED) ================= */

    if (!form.username) return setError("Username is required");

    if (usernameStatus !== "available")
      return setError("Please choose an available username");

    if (!form.password || form.password.length !== 6)
      return setError("Password must be exactly 6 characters");

    if (!form.email || !form.email.includes("@"))
      return setError("Valid email is required");

    if (!form.phone || !/^\d{10,15}$/.test(form.phone))
      return setError("Valid phone number is required");

    if (!form.pan_number) return setError("PAN number is required");

    if (!form.pan_image) return setError("PAN card image is mandatory");

    try {
      setLoading(true);

      const payload = new FormData();
      payload.append("parent_id", parentId);
      payload.append("position", position);
      payload.append("username", form.username);
      payload.append("password", form.password);
      payload.append("email", form.email.toLowerCase());
      payload.append("phone", form.phone);
      payload.append("pan_number", form.pan_number.toUpperCase());
      payload.append("pan_image", form.pan_image);
      payload.append("address", form.address);
      payload.append("city", form.city);
      payload.append("state", form.state);
      payload.append("country", form.country);
      payload.append("pincode", form.pincode);

      await axiosClient.post("/mlm/tree/place-user/", payload);

      onClose();
      window.location.reload();
    } catch (err) {
      setError(
        err?.response?.data?.error ||
          err?.response?.data?.detail ||
          "Failed to place user"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="placement-overlay">
      <div className="placement-modal">
        <div className="modal-header">
          <h3>Place User ({position})</h3>

          <p>
            <span>*</span> Mandatory fields
          </p>
        </div>

        {error && <p className=".error-text">{error}</p>}
        <div className="modal-body">
          <div className="form-grid">
            {/* USERNAME (ENHANCED ONLY) */}
            <div>
              <label className="form-label">
                Username <span>*</span>
              </label>
              <input
                value={form.username}
                onChange={(e) => handleChange("username", e.target.value)}
                className="form-input"
              />

              {usernameStatus === "checking" && (
                <p className="username-hint">Checking availability…</p>
              )}

              {usernameStatus === "available" && (
                <p className="username-success">✔ Username available</p>
              )}

              {usernameStatus === "unavailable" && (
                <>
                  <p className="username-error">Username not available</p>
                  <div className="username-suggestions">
                    <p className="available-usernames">Available user names</p>
                    {usernameSuggestions.map((s) => (
                      <span
                        key={s}
                        style={suggestionChip}
                        onClick={() => handleChange("username", s)}
                        className="chip"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* REST OF FIELDS (UNCHANGED) */}
            <Input
              required
              label="Password"
              type="password"
              onChange={(v) => handleChange("password", v)}
            />
            <Input
              required
              label="Email"
              onChange={(v) => handleChange("email", v)}
            />

            <Input
              required
              label="Phone"
              onChange={(v) => handleChange("phone", v)}
            />
            <Input
              required
              label="PAN Number"
              onChange={(v) => handleChange("pan_number", v)}
            />

            <Input
              label="Address"
              onChange={(v) => handleChange("address", v)}
            />
            <Input label="City" onChange={(v) => handleChange("city", v)} />
            <Input label="State" onChange={(v) => handleChange("state", v)} />
            <Input
              label="Pincode"
              onChange={(v) => handleChange("pincode", v)}
            />
          </div>
          <div className="file-input">
            <div>
              
            </div>
            <label className="form-label">
              PAN Image <span style={star}>*</span>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleChange("pan_image", e.target.files[0])}
            />
            <img
              src={form.pan_image ? URL.createObjectURL(form.pan_image) : ""}
              alt="PAN"
            />
          </div>
        </div>

        <div className="modal-actions">
          <button onClick={onClose} className="btn-cancel">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || usernameStatus !== "available"}
            className="btn-submit"
          >
            {loading ? "Placing..." : "Place User"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= INPUT ================= */

function Input({ label, type = "text", required = false, onChange }) {
  return (
    <div>
      <label className="form-label">
        {label} {required && <span className="star">*</span>}
      </label>
      {label === "Email" && (
        <p style={hint}>ℹ️ Each email can be used for a maximum of 3 users</p>
      )}
      <input
        type={type}
        onChange={(e) => onChange(e.target.value)}
        className="form-input"
      />
    </div>
  );
}

/* ================= STYLES (UNCHANGED) ================= */

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
  padding: "24px",
  borderRadius: "12px",
  width: "100%",
  maxWidth: "540px",
  maxHeight: "90vh",
  overflowY: "auto",
};

const title = { marginBottom: "6px" };
const mandatoryNote = { fontSize: "12px", color: "#666", marginBottom: "10px" };
const grid = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" };
const actions = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "12px",
  marginTop: "22px",
};

const cancelBtn = {
  padding: "10px 16px",
  border: "1px solid #ccc",
  background: "#fff",
};
const submitBtn = {
  padding: "10px 18px",
  background: "#000",
  color: "#fff",
  border: "none",
};

const errorText = { color: "#b91c1c", marginBottom: "10px", fontSize: "13px" };
const errorSmall = { color: "#b91c1c", fontSize: "12px" };
const success = { color: "#16a34a", fontSize: "12px" };
const hint = { color: "#6b7280", fontSize: "12px" };

const labelStyle = { fontSize: "13px", marginBottom: "4px", display: "block" };
const star = { color: "#dc2626", fontWeight: "700" };
const input = {
  width: "100%",
  padding: "9px 10px",
  borderRadius: "6px",
  border: "1px solid #ddd",
};
const fileInput = { width: "100%", fontSize: "13px" };

const suggestions = {
  display: "flex",
  gap: "8px",
  flexWrap: "wrap",
  marginTop: "6px",
};
const suggestionChip = {
  padding: "4px 8px",
  background: "#f3f4f6",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "12px",
};
