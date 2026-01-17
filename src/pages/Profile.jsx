import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { fetchProfile, updateProfile, changePassword } from "../api/profileApi";
import { 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiEdit3, 
  FiSave, 
  FiX, 
  FiLock,
  FiCheckCircle,
  FiAlertCircle,
  FiKey
} from "react-icons/fi";
import { BiUserCircle } from "react-icons/bi";
import './Profile.scss'
import Loading from "../components/Loader/Loading";

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

  if (!profile || !form) return (
    <Loading/>
  );

  if (profile) {
    console.log("profile data:", profile);
  }

  return (
    <MainLayout>
      <div className="profile-page">
        <div className="profile-container">
          
          {/* Header Section */}
          <div className="profile-header">
            <div className="header-content">
              <BiUserCircle className="profile-avatar" />
              <div className="header-info">
                <h1>My Profile</h1>
                <p>Manage your account information and settings</p>
              </div>
            </div>
          </div>

          {/* Account Information Card */}
          <div className="profile-card">
            <div className="card-header">
              <div className="header-title">
                <FiUser className="section-icon" />
                <h2>Account Information</h2>
              </div>
            </div>
            <div className="card-body">
              <InfoRow icon={FiUser} label="Username" value={profile.username} />
              <InfoRow icon={FiMail} label="Email" value={profile.email} />
              <InfoRow 
                icon={profile.is_activated ? FiCheckCircle : FiAlertCircle}
                label="Account Status" 
                value={profile.is_activated ? "Activated" : "Not Activated"}
                isStatus={true}
                isActivated={profile.is_activated}
              />
              <InfoRow icon={FiMapPin} label="Position" value={profile.position} />
            </div>
          </div>

          {/* Personal Information Card */}
          <div className="profile-card">
            <div className="card-header">
              <div className="header-title">
                <BiUserCircle className="section-icon" />
                <h2>Personal Information</h2>
              </div>
              {!editing && !changePasswordMode && (
                <button className="edit-btn" onClick={() => setEditing(true)}>
                  <FiEdit3 />
                  Edit Profile
                </button>
              )}
            </div>
            <div className="card-body">
              <EditableRow
                icon={FiUser}
                label="Full Name"
                value={form.full_name}
                editing={editing}
                onChange={(v) => handleChange("full_name", v)}
              />
              <EditableRow
                icon={FiPhone}
                label="Phone"
                value={form.phone}
                editing={editing}
                onChange={(v) => handleChange("phone", v)}
              />
              <EditableRow
                icon={FiMapPin}
                label="Address"
                value={form.address}
                editing={editing}
                onChange={(v) => handleChange("address", v)}
                isTextarea={true}
              />
              <EditableRow
                icon={FiMapPin}
                label="City"
                value={form.city}
                editing={editing}
                onChange={(v) => handleChange("city", v)}
              />
              <EditableRow
                icon={FiMapPin}
                label="State"
                value={form.state}
                editing={editing}
                onChange={(v) => handleChange("state", v)}
              />
              <EditableRow
                icon={FiMapPin}
                label="Pincode"
                value={form.pincode}
                editing={editing}
                onChange={(v) => handleChange("pincode", v)}
              />
            </div>

            {editing && (
              <div className="card-actions">
                <button className="save-btn" onClick={handleSave} disabled={saving}>
                  <FiSave />
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  className="cancel-btn"
                  onClick={() => {
                    setForm(profile.profile);
                    setEditing(false);
                  }}
                >
                  <FiX />
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Change Password Card */}
          {changePasswordMode ? (
            <div className="profile-card password-card">
              <div className="card-header">
                <div className="header-title">
                  <FiLock className="section-icon" />
                  <h2>Change Password</h2>
                </div>
              </div>
              <form onSubmit={handleSave} className="card-body">
                <div className="form-group">
                  <label>
                    <FiKey className="label-icon" />
                    Current Password
                  </label>
                  <div className="input-wrapper">
                    <FiLock className="input-icon" />
                    <input 
                      type="password" 
                      name="old_password" 
                      placeholder="Enter your current password"
                      value={password.old_password} 
                      onChange={(e) => setPassword({ ...password, old_password: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>
                    <FiKey className="label-icon" />
                    New Password
                  </label>
                  <div className="input-wrapper">
                    <FiLock className="input-icon" />
                    <input 
                      type="password" 
                      name="new_password" 
                      placeholder="Enter your new password"
                      value={password.new_password} 
                      onChange={(e) => setPassword({ ...password, new_password: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="card-actions">
                  <button type="submit" className="save-btn" disabled={saving}>
                    <FiSave />
                    {saving ? "Updating..." : "Update Password"}
                  </button>
                  <button 
                    type="button"
                    className="cancel-btn"
                    onClick={() => {
                      setChangePasswordMode(false);
                      setPassword({ old_password: "", new_password: "" });
                    }}
                  >
                    <FiX />
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          ) : (
            !editing && (
              <div className="profile-card">
                <div className="card-header">
                  <div className="header-title">
                    <FiLock className="section-icon" />
                    <h2>Security</h2>
                  </div>
                </div>
                <div className="card-body">
                  <button className="change-password-btn" onClick={() => setChangePasswordMode(true)}>
                    <FiKey />
                    Change Password
                  </button>
                </div>
              </div>
            )
          )}

        </div>
      </div>
    </MainLayout>
  );
}

/* ================= UI COMPONENTS ================= */

function InfoRow({ icon: Icon, label, value, isStatus, isActivated }) {
  return (
    <div className="info-row">
      <div className="info-label">
        <Icon className={`row-icon ${isStatus ? (isActivated ? 'status-active' : 'status-inactive') : ''}`} />
        <span>{label}</span>
      </div>
      <div className={`info-value ${isStatus ? (isActivated ? 'status-active' : 'status-inactive') : ''}`}>
        {value || "-"}
      </div>
    </div>
  );
}

function EditableRow({ icon: Icon, label, value, editing, onChange, isTextarea }) {
  return (
    <div className="info-row editable-row">
      <div className="info-label">
        <Icon className="row-icon" />
        <span>{label}</span>
      </div>
      {editing ? (
        <div className="edit-input-wrapper">
          {isTextarea ? (
            <textarea
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
              rows={3}
              placeholder={`Enter ${label.toLowerCase()}`}
            />
          ) : (
            <input
              type="text"
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
              placeholder={`Enter ${label.toLowerCase()}`}
            />
          )}
        </div>
      ) : (
        <div className="info-value">{value || "-"}</div>
      )}
    </div>
  );
}




