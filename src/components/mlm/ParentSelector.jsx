export default function ParentSelector({
  parents,
  selectedParentId,
  selectedPosition,
  onParentChange,
  onPositionChange,
}) {
  const parent = parents.find(
    (p) => p.id === Number(selectedParentId)
  );

  return (
    <div>
      {/* PARENT DROPDOWN */}
      <div style={field}>
        <label style={label}>Parent User</label>
        <select
          value={selectedParentId}
          onChange={(e) => onParentChange(e.target.value)}
          style={select}
        >
          <option value="">Select Parent</option>
          {parents.map((p) => (
            <option key={p.id} value={p.id}>
              {p.username}
            </option>
          ))}
        </select>
      </div>

      {/* POSITION BUTTONS */}
      {parent && (
        <div style={field}>
          <label style={label}>Available Position</label>

          <div style={positionRow}>
            {parent.left_available && (
              <button
                type="button"
                style={positionBtn(
                  selectedPosition === "LEFT"
                )}
                onClick={() => onPositionChange("LEFT")}
              >
                LEFT
              </button>
            )}

            {parent.right_available && (
              <button
                type="button"
                style={positionBtn(
                  selectedPosition === "RIGHT"
                )}
                onClick={() => onPositionChange("RIGHT")}
              >
                RIGHT
              </button>
            )}

            {!parent.left_available &&
              !parent.right_available && (
                <p style={noSlot}>
                  No positions available
                </p>
              )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= STYLES ================= */

const field = {
  marginBottom: "14px",
};

const label = {
  display: "block",
  fontSize: "13px",
  marginBottom: "6px",
  fontWeight: "600",
};

const select = {
  width: "100%",
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
};

const positionRow = {
  display: "flex",
  gap: "12px",
};

const positionBtn = (active) => ({
  padding: "10px 16px",
  borderRadius: "6px",
  border: active ? "2px solid #000" : "1px solid #ccc",
  background: active ? "#000" : "#fff",
  color: active ? "#fff" : "#000",
  cursor: "pointer",
});

const noSlot = {
  color: "#999",
  fontSize: "13px",
};