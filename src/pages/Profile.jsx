import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { fetchProfile, updateProfile, changePassword } from "../api/profileApi";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(null);
  const [changePasswordMode, setChangePasswordMode] = useState(false);
  const [password, setPassword] = useState({
    old_password: "",
    new_password: "",
  });

  useEffect(() => {
    fetchProfile().then((data) => {
      setProfile(data);
      setForm(data.profile);
    });
  }, []);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      if(changePasswordMode){
        await changePassword(password)
        setChangePasswordMode(false)
      }else{

        const updated = await updateProfile(form);
        setProfile((prev)=>({...prev, profile:updated}));
        setEditing(false);
      }
    } catch(error) {
      console.error("failed ", error)
      alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (!profile || !form) return <p>Loading profile...</p>;
  if (profile) {
    console.log("profile data:", profile);
  }

  return (
    <MainLayout>
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "20px",
        }}
      >
        <h2 style={{ marginBottom: "25px" }}>My Profile</h2>

        {/* ================= ACCOUNT INFO ================= */}
        <div style={cardStyle}>
          <h3 style={sectionTitle}>Account Information</h3>

          <InfoRow label="Username" value={profile.username} />
          <InfoRow label="Email" value={profile.email} />
          <InfoRow
            label="Account Status"
            value={profile.is_activated ? "Activated" : "Not Activated"}
          />
          <InfoRow label="Position" value={profile.position} />
        </div>

        {/* ================= PERSONAL INFO ================= */}
        <div style={cardStyle}>
          <h3 style={sectionTitle}>Personal Information</h3>

          <EditableRow
            label="Full Name"
            value={form.full_name}
            editing={editing}
            onChange={(v) => handleChange("full_name", v)}
          />

          <EditableRow
            label="Phone"
            value={form.phone}
            editing={editing}
            onChange={(v) => handleChange("phone", v)}
          />

          <EditableRow
            label="Address"
            value={form.address}
            editing={editing}
            onChange={(v) => handleChange("address", v)}
          />

          <EditableRow
            label="City"
            value={form.city}
            editing={editing}
            onChange={(v) => handleChange("city", v)}
          />

          <EditableRow
            label="State"
            value={form.state}
            editing={editing}
            onChange={(v) => handleChange("state", v)}
          />

          <EditableRow
            label="Pincode"
            value={form.pincode}
            editing={editing}
            onChange={(v) => handleChange("pincode", v)}
          />
        </div>
        {changePasswordMode && (
          <form onSubmit={handleSave}>
            <h3>Change password</h3>
            <div>
              <label htmlFor="">Enter old password</label>
              <input type="password"  name="old_password" value={password.old_password} onChange={(e) => setPassword({ ...password, old_password: e.target.value })} />
            </div>
            <div>
              <label htmlFor="">Enter new password</label>
              <input type="password" name="new_password" value={password.new_password} onChange={(e) => setPassword({ ...password, new_password: e.target.value })} />
            </div>
            <button>submit</button>
          </form>
        )}

        {/* ================= ACTIONS ================= */}
        <div style={{ marginTop: "20px", display: "flex", gap: "12px" }}>
          <button onClick={() => setChangePasswordMode(!changePasswordMode)}>
            ChangePassword
          </button>
          {!editing ? (
            <button style={primaryBtn} onClick={() => setEditing(true)}>
              Edit Profile
            </button>
          ) : (
            <>
              <button style={primaryBtn} onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </button>

              <button
                style={secondaryBtn}
                onClick={() => {
                  setForm(profile.profile);
                  setEditing(false);
                }}
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

/* ================= UI COMPONENTS ================= */

function InfoRow({ label, value }) {
  return (
    <div style={rowStyle}>
      <span style={labelStyle}>{label}</span>
      <span>{value || "-"}</span>
    </div>
  );
}

function EditableRow({ label, value, editing, onChange }) {
  return (
    <div style={rowStyle}>
      <span style={labelStyle}>{label}</span>
      {editing ? (
        <input
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          style={inputStyle}
        />
      ) : (
        <span>{value || "-"}</span>
      )}
    </div>
  );
}

/* ================= STYLES ================= */

const cardStyle = {
  background: "#fff",
  border: "1px solid #e5e5e5",
  borderRadius: "8px",
  padding: "20px",
  marginBottom: "25px",
};

const sectionTitle = {
  marginBottom: "15px",
};

const rowStyle = {
  display: "grid",
  gridTemplateColumns: "180px 1fr",
  alignItems: "center",
  marginBottom: "12px",
};

const labelStyle = {
  fontWeight: "600",
  color: "#555",
};

const inputStyle = {
  padding: "8px",
  border: "1px solid #ccc",
  borderRadius: "4px",
  width: "100%",
};

const primaryBtn = {
  padding: "10px 16px",
  background: "#000",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

const secondaryBtn = {
  padding: "10px 16px",
  background: "#fff",
  color: "#000",
  border: "1px solid #ccc",
  borderRadius: "4px",
  cursor: "pointer",
};
