import React, { useEffect, useState } from "react";
import "./PayoutRequest.scss";
import MainLayout from "../layouts/MainLayout";
import { FaRupeeSign } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { createPayoutDetails, fetchPayoutDetails } from "../api/payoutapi";
import Loading from "../components/Loader/Loading";
import { fetchWallets } from "../api/mlmApi";
import { MdOutlineAccountBalanceWallet } from "react-icons/md";
import { toast } from "react-toastify";

const datas = [
  {
    id: 4,
    amount: "10.00",
    note: "payout request",
    status: "APPROVED",
    previous_balance: "910.00",
    balance_after: "900.00",
    requested_at: "12 Feb 2026 11:35 AM",
    reviewed_at: "12 Feb 2026 11:36 AM",
  },
  {
    id: 3,
    amount: "10.00",
    note: "payout request",
    status: "APPROVED",
    previous_balance: null,
    balance_after: null,
    requested_at: "11 Feb 2026 11:55 AM",
    reviewed_at: "11 Feb 2026 12:19 PM",
  },
  {
    id: 2,
    amount: "50.00",
    note: "payout request",
    status: "APPROVED",
    previous_balance: null,
    balance_after: null,
    requested_at: "10 Feb 2026 01:43 PM",
    reviewed_at: "10 Feb 2026 01:50 PM",
  },
  {
    id: 1,
    amount: "482.00",
    note: "Weekly payout request",
    status: "APPROVED",
    previous_balance: null,
    balance_after: null,
    requested_at: "10 Feb 2026 01:06 PM",
    reviewed_at: "10 Feb 2026 01:34 PM",
  },
];

const PayoutRequest = () => {
  const [form, showForm] = useState(false);
  const [values, setValues] = useState({
    amount: "",
    note: "",
  });
  const [data, setData] = useState([]);
  const [awailableBalance, setAvailableBalance] = useState(0);
  const [WalletAmount, setWalletAmount] = useState({
    balance_after: 0,
    previous_balance: 0,
  });
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const token = localStorage.getItem("access_token");
  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };
  const getPayoutRequests = async () => {
    if (!token) return;
    try {
      // setLoading(true);
      const data = await fetchPayoutDetails();

      setData(data);

      if (data[0]?.balance_after) {
        setWalletAmount(data[0]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const loadWallet = async () => {
    try {
      const data = await fetchWallets();
      const mainwallet = data.find((wallet) => wallet.wallet_type === "MAIN");
      if (mainwallet) {
        setAvailableBalance(mainwallet.balance);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getPayoutRequests();
    loadWallet();

    const interval = setInterval(() => {
      getPayoutRequests();
      loadWallet();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return;
    try {
      await createPayoutDetails(values);
      toast.success("Payout request sent Successfully");
    } catch (error) {
      console.log(error);
      const eroor =
        error.response?.data?.error || "Failed to send payout request";
      toast.error(eroor);
    }
    getPayoutRequests();
    showForm(false);
  };
  //pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indeOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = data.slice(indeOfFirstItem, indexOfLastItem);
  const handleNextPage = () => {
    if (indexOfLastItem < data.length) {
      setCurrentPage(currentPage + 1);
    }
  };
  const handlePrevPage = () => {
    if (indeOfFirstItem > 0) {
      setCurrentPage(currentPage - 1);
    }
  };
  if (loading) return <Loading />;
  if (awailableBalance) {
    console.log("Avialble Balance", awailableBalance);
  }

  return (
    <MainLayout>
      <div className="payout-request">
        <div className="page-header">
          <h1>Payout Requests</h1>

          <button className="primary-btn" onClick={() => showForm(true)}>
            New Payout Request
          </button>
        </div>

        {/* FORM MODAL */}
        {form && (
          <div className="payout-modal">
            <div className="payout-form-card">
              <h2>New Payout Request</h2>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>
                    <FaRupeeSign className="label-icon" />
                    Amount
                  </label>
                  <div className="input-wrapper">
                    <FaRupeeSign className="input-icon" />
                    <input
                      type="number"
                      placeholder="Enter amount"
                      name="amount"
                      value={values.amount}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>
                    <FiEdit className="label-icon" />
                    Note
                  </label>
                  <div className="input-wrapper">
                    <FiEdit className="input-icon" />
                    <input
                      type="text"
                      placeholder="Enter Note"
                      name="note"
                      value={values.note}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => showForm(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="submit-btn">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* wallet Balance  */}
        <div className="wallet-header">
          <img src="/wallet2.png" alt="wallet-image" className="wallet-image"/>
          <div className="bg-overlay"></div>
          <div className="wallet-info">
            <MdOutlineAccountBalanceWallet className="wallet-icon" />
            <h4 className="wallet-title"> Wallet</h4>
          </div>
          <div className="wallet-balance">
            <div className="balance-card">
              <span className="balance-label">Available Balance</span>
              <span className="balance-value">₹ {awailableBalance}</span>
            </div>
            <div className="balance-card">
              <span className="balance-label">Previous Balance</span>
              <span className="balance-value">
                ₹ {WalletAmount.previous_balance}
              </span>
            </div>
          </div>
        </div>

        {/* REQUEST LIST */}

        <div className="payout-list">
          {currentData?.map((item) => (
            <div className="payout-card" key={item.id}>
              <div className="card-header">
                <h3>₹ {item.amount}</h3>
                <span className={`status ${item.status.toLowerCase()}`}>
                  {item.status}
                </span>
              </div>

              <div className="card-body">
                <p>
                  <strong>Note:</strong> {item.note}
                </p>
                <p>
                  <strong>Requested:</strong> {item.requested_at}
                </p>
                <p>
                  <strong>Reviewed:</strong> {item.reviewed_at}
                </p>
              </div>
            </div>
          ))}
        </div>
        {data.length > itemsPerPage && (
          <div className="pagination-controls">
            <button onClick={handlePrevPage} disabled={currentPage == 1}>
              ‹
            </button>
            <span>
              Page {currentPage} of {Math.ceil(data.length / itemsPerPage)}
            </span>
            <button
              onClick={handleNextPage}
              disabled={indexOfLastItem >= data.length}
            >
              ›
            </button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default PayoutRequest;
