import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { fetchProfile } from "../api/profileApi";
import {
  fetchEarningsSummary,
  fetchDirectReferrals,
  fetchDownlines,
  fetchWallets,
} from "../api/mlmApi";

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState("SUMMARY");

  const [earnings, setEarnings] = useState(null);
  const [date, setDate] = useState(
    new Date().toISOString().slice(0, 10)
  );

  const [referrals, setReferrals] = useState(null);
  const [downlines, setDownlines] = useState(null);
  const [wallets, setWallets] = useState(null);

  useEffect(() => {
    fetchProfile().then(setProfile);
  }, []);

  useEffect(() => {
    if (!profile?.is_activated) return;

    if (activeTab === "SUMMARY") {
      fetchEarningsSummary(date).then((res) =>
        setEarnings(res.summary)
      );
    }

    if (activeTab === "REFERRALS" && !referrals) {
      fetchDirectReferrals().then(setReferrals);
    }

    if (activeTab === "GENEOLOGY" && !downlines) {
      fetchDownlines().then(setDownlines);
    }

    if (activeTab === "WALLETS" && !wallets) {
      fetchWallets().then(setWallets);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, activeTab, date]);

  if (!profile) return <p>Loading dashboard...</p>;

  return (
    <MainLayout>
      <h2>Dashboard</h2>

      <p>
        Welcome, <strong>{profile.username}</strong>
      </p>

      {!profile.is_activated && (
        <p style={{ color: "orange" }}>
          Please activate your account to view MLM data.
        </p>
      )}

      {/* ================= TABS ================= */}
      {profile.is_activated && (
        <>
          <div style={tabBar}>
            <Tab label="Summary" value="SUMMARY" activeTab={activeTab} setActiveTab={setActiveTab} />
            <Tab label="Direct Referrals" value="REFERRALS" activeTab={activeTab} setActiveTab={setActiveTab} />
            <Tab label="Genealogy" value="GENEOLOGY" activeTab={activeTab} setActiveTab={setActiveTab} />
            <Tab label="Wallet History" value="WALLETS" activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>

          {/* ================= SUMMARY ================= */}
          {activeTab === "SUMMARY" && earnings && (
            <>
              <div style={{ margin: "15px 0" }}>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              <div style={grid}>
                <Card title="Direct Referrals" value={earnings.direct_referral_count} />
                <Card title="Direct Earnings" value={`₹${earnings.direct_referral_earned}`} />
                <Card title="Pair Count" value={earnings.pair_count} />
                <Card title="Pair Earnings" value={`₹${earnings.pair_earned}`} />
              </div>

              <h3 style={{ marginTop: "20px" }}>
                Total Earned: ₹{earnings.total_earned}
              </h3>
            </>
          )}

          {/* ================= DIRECT REFERRALS ================= */}
          {activeTab === "REFERRALS" && referrals && (
            <Table
              headers={["Username", "Email", "Status", "Joined"]}
              rows={referrals.results.map((r) => [
                r.username,
                r.email,
                r.is_activated ? "Activated" : "Pending",
                new Date(r.created_at).toLocaleDateString(),
              ])}
            />
          )}

          {/* ================= GENEALOGY ================= */}
          {activeTab === "GENEOLOGY" && downlines && (
            <>
              {Object.entries(downlines).map(([level, data]) =>
                level.startsWith("level") ? (
                  <div key={level} style={{ marginBottom: "15px" }}>
                    <h4>
                      {level.replace("_", " ").toUpperCase()} ({data.count})
                    </h4>
                    <ul>
                      {data.users.map((u) => (
                        <li key={u.referral_code}>
                          {u.username} — {u.referral_code}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null
              )}
            </>
          )}

          {/* ================= WALLETS ================= */}
          {activeTab === "WALLETS" && wallets && (
            <>
              {wallets.map((w) => (
                <div key={w.id} style={{ marginBottom: "25px" }}>
                  <h4>
                    {w.wallet_type} Wallet — ₹{w.balance}
                  </h4>

                  <Table
                    headers={["Date", "Type", "Amount", "Description"]}
                    rows={w.transactions.map((t) => [
                      new Date(t.created_at).toLocaleString(),
                      t.tx_type,
                      `₹${t.amount}`,
                      t.description,
                    ])}
                  />
                </div>
              ))}
            </>
          )}
        </>
      )}
    </MainLayout>
  );
}

/* ================= UI HELPERS ================= */

function Tab({ label, value, activeTab, setActiveTab }) {
  return (
    <button
      onClick={() => setActiveTab(value)}
      style={{
        padding: "10px 16px",
        border: "none",
        borderBottom:
          activeTab === value ? "3px solid black" : "3px solid transparent",
        background: "none",
        cursor: "pointer",
        fontWeight: activeTab === value ? "bold" : "normal",
      }}
    >
      {label}
    </button>
  );
}

function Card({ title, value }) {
  return (
    <div style={{ border: "1px solid #ddd", padding: "15px" }}>
      <p>{title}</p>
      <h3>{value}</h3>
    </div>
  );
}

function Table({ headers, rows }) {
  return (
    <table width="100%" border="1" cellPadding="8">
      <thead>
        <tr>
          {headers.map((h) => (
            <th key={h}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) => (
              <td key={j}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const tabBar = {
  display: "flex",
  gap: "10px",
  borderBottom: "1px solid #ddd",
  marginBottom: "20px",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "15px",
};
