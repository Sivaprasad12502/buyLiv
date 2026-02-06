import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { fetchProfile } from "../api/profileApi";
import {
  fetchEarningsSummary,
  fetchDirectReferrals,
  fetchDownlines,
  fetchWallets,
} from "../api/mlmApi";
import { 
  FiTrendingUp, 
  FiUsers, 
  FiDollarSign, 
  FiAward,
  FiCalendar,
  FiCheckCircle,
  FiAlertCircle,
  FiGitBranch,
  FiCreditCard,
  FiBarChart2,
  FiActivity,
  FiUserPlus,
  FiPieChart
} from "react-icons/fi";
import { BiWallet, BiNetworkChart, BiUser } from "react-icons/bi";
import { MdOutlineAccountBalanceWallet } from "react-icons/md";
import Loading from "../components/Loader/Loading";
import "./Dashboard.scss";
import { FaRubleSign } from "react-icons/fa";
import { FaRupeeSign } from "react-icons/fa6";

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

  if (!profile) return <Loading />;

  return (
    <MainLayout>
      <div className="dashboard-page">
        <div className="dashboard-container">
          
          {/* Header Section */}
          <div className="dashboard-header">
            <div className="header-content">
              <FiBarChart2 className="header-icon" />
              <div className="header-info">
                <h1>Dashboard</h1>
                <p className="welcome-text">
                  Welcome back, <strong>{profile.username}</strong>!
                </p>
              </div>
            </div>
          </div>

          {/* Activation Warning */}
          {!profile.is_activated && (
            <div className="activation-warning">
              <FiAlertCircle className="warning-icon" />
              <div className="warning-content">
                <h3>Account Not Activated</h3>
                <p>Please activate your account to access our features and earnings data.</p>
              </div>
            </div>
          )}

          {/* Tabs Navigation */}
          {profile.is_activated && (
            <>
              <div className="tabs-container">
                <div className="tabs-nav">
                  <Tab 
                    label="Summary" 
                    icon={FiPieChart}
                    value="SUMMARY" 
                    activeTab={activeTab} 
                    setActiveTab={setActiveTab} 
                  />
                  <Tab 
                    label="Direct Referrals" 
                    icon={FiUserPlus}
                    value="REFERRALS" 
                    activeTab={activeTab} 
                    setActiveTab={setActiveTab} 
                  />
                  <Tab 
                    label="Genealogy" 
                    icon={BiNetworkChart}
                    value="GENEOLOGY" 
                    activeTab={activeTab} 
                    setActiveTab={setActiveTab} 
                  />
                  <Tab 
                    label="Wallet History" 
                    icon={BiWallet}
                    value="WALLETS" 
                    activeTab={activeTab} 
                    setActiveTab={setActiveTab} 
                  />
                </div>
              </div>

              {/* Summary Tab */}
              {activeTab === "SUMMARY" && earnings && (
                <div className="tab-content">
                  <div className="date-selector">
                    <FiCalendar className="date-icon" />
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="date-input"
                    />
                  </div>

                  <div className="stats-grid">
                    <Card 
                      title="Direct Referrals" 
                      value={earnings.direct_referral_count} 
                      icon={FiUsers}
                      color="blue"
                    />
                    <Card 
                      title="Direct Earnings" 
                      value={`₹${earnings.direct_referral_earned}`} 
                      icon={FaRupeeSign}
                      color="green"
                    />
                    <Card 
                      title="Pair Count" 
                      value={earnings.pair_count} 
                      icon={FiAward}
                      color="purple"
                    />
                    <Card 
                      title="Pair Earnings" 
                      value={`₹${earnings.pair_earned}`} 
                      icon={FiTrendingUp}
                      color="orange"
                    />
                  </div>

                  <div className="total-earned">
                    <div className="total-content">
                      <FiActivity className="total-icon" />
                      <div className="total-info">
                        <span className="total-label">Total Earned</span>
                        <span className="total-value">₹{earnings.total_earned.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Direct Referrals Tab */}
              {activeTab === "REFERRALS" && referrals && (
                <div className="tab-content">
                  <div className="referrals-count">
                    <FiUserPlus className="count-icon" />
                    <span>{referrals.results.length} Direct Referrals</span>
                  </div>
                  <Table
                    headers={["Username", "Email", "Status", "Joined"]}
                    rows={referrals.results.map((r) => [
                      r.username,
                      r.email,
                      r.is_activated ? "Activated" : "Pending",
                      new Date(r.created_at).toLocaleDateString(),
                    ])}
                  />
                </div>
              )}

              {/* Genealogy Tab */}
              {activeTab === "GENEOLOGY" && downlines && (
                <div className="tab-content">
                  <div className="genealogy-grid">
                    {Object.entries(downlines).map(([level, data]) =>
                      level.startsWith("level") ? (
                        <div key={level} className="level-card">
                          <div className="level-header">
                            <FiGitBranch className="level-icon" />
                            <h4 className="level-title">
                              {level.replace("_", " ").toUpperCase()}
                            </h4>
                            <span className="level-count">{data.count}</span>
                          </div>
                          <div className="level-users">
                            {data.users.map((u) => (
                              <div key={u.referral_code} className="user-item">
                                <BiUser className="user-icon" />
                                <div className="user-info">
                                  <span className="user-name">{u.username}</span>
                                  <span className="user-code">{u.referral_code}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : null
                    )}
                  </div>
                </div>
              )}

              {/* Wallets Tab */}
              {activeTab === "WALLETS" && wallets && (
                <div className="tab-content">
                  <div className="wallets-list">
                    {wallets.map((w) => (
                      <div key={w.id} className="wallet-card">
                        <div className="wallet-header">
                          <div className="wallet-info">
                            <MdOutlineAccountBalanceWallet className="wallet-icon" />
                            <h4 className="wallet-title">{w.wallet_type} Wallet</h4>
                          </div>
                          <div className="wallet-balance">
                            <span className="balance-label">Balance</span>
                            <span className="balance-value">₹{w.balance.toLocaleString()}</span>
                          </div>
                        </div>

                        <div className="wallet-transactions">
                          <h5 className="transactions-title">
                            <FiCreditCard className="transactions-icon" />
                            Transaction History
                          </h5>
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
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

/* ================= UI COMPONENTS ================= */

function Tab({ label, icon: Icon, value, activeTab, setActiveTab }) {
  const isActive = activeTab === value;
  
  return (
    <button
      onClick={() => setActiveTab(value)}
      className={`tab-button ${isActive ? 'active' : ''}`}
    >
      <Icon className="tab-icon" />
      <span className="tab-label">{label}</span>
    </button>
  );
}

function Card({ title, value, icon: Icon, color }) {
  return (
    <div className={`stat-card stat-card-${color}`}>
      <div className="card-icon-wrapper">
        <Icon className="card-icon" />
      </div>
      <div className="card-content">
        <p className="card-title">{title}</p>
        <h3 className="card-value">{value}</h3>
      </div>
    </div>
  );
}

function Table({ headers, rows }) {
  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            {headers.map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={headers.length} className="empty-row">
                No data available
              </td>
            </tr>
          ) : (
            rows.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j}>
                    {j === 2 && (cell === "Activated" || cell === "Pending") ? (
                      <span className={`status-badge ${cell === "Activated" ? 'status-active' : 'status-pending'}`}>
                        {cell === "Activated" ? <FiCheckCircle /> : <FiAlertCircle />}
                        {cell}
                      </span>
                    ) : (
                      cell
                    )}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
