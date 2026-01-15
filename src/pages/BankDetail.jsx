import React, { useEffect, useState } from "react";
import {
  fetchBankDetails,
  updateBankDetails,
  createBankDetails,
} from "../api/bankApi";
import Loading from "../components/Loader/Loading";
import "./BankDetails.scss";

const BankDetail = () => {
  const [bankDetails, setBankDetails] = useState();
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    bank_name: "",
    account_holder_name: "",
    account_number: "",
    ifsc_code: "",
  });
  const token = localStorage.getItem("access_token");

  const getBankDetails = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const data = await fetchBankDetails();
      setLoading(false);
      console.log("bank details", data);
      setBankDetails(data);
    } catch (error) {
      console.error("Error fetching bank details:", error);
      setBankDetails({});
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getBankDetails();
  }, []);
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleEdit = () => {
    setFormData(bankDetails);
    setShowForm(true);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return;
    if (bankDetails.length > 0) {
      await updateBankDetails(formData);
    } else {
      await createBankDetails(formData);
    }
    console.log("added bank details");
    getBankDetails();
    setShowForm(false);
  };
  if (bankDetails) {
    console.log("bank details in bank details page", bankDetails);
  }
  if (loading) return <Loading />;
  const hasBankDetails = bankDetails && Object.keys(bankDetails).length > 0;
  return (
    <div className="bank-detail">
      <button onClick={()=>window.history.back()}>Back</button>
      {/* ✅ Show Bank Details */}
      {hasBankDetails && !showForm && (
        <div className="bank-card">
          <div className="bank-info">
            <p>
              <span>Account Holder:</span> {bankDetails.account_holder_name}
            </p>
            <p>
              <span>Account Number:</span> {bankDetails.account_number}
            </p>
            <p>
              <span>IFSC Code:</span> {bankDetails.ifsc_code}
            </p>
            <p>
              <span>Bank Name:</span> {bankDetails.bank_name}
            </p>

            <button className="edit-btn" onClick={handleEdit}>
              Edit
            </button>
          </div>
        </div>
      )}

      {/* ✅ Show Form */}
      {(!hasBankDetails || showForm) && (
        <form className="bank-form" onSubmit={handleSubmit}>
          <h2>{hasBankDetails ? "Edit Bank Details" : "Add Bank Details"}</h2>

          <div className="form-group">
            <label>Bank Name</label>
            <input
              name="bank_name"
              value={formData.bank_name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Account Holder Name</label>
            <input
              name="account_holder_name"
              value={formData.account_holder_name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Account Number</label>
            <input
              name="account_number"
              value={formData.account_number}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>IFSC Code</label>
            <input
              name="ifsc_code"
              value={formData.ifsc_code}
              onChange={handleChange}
            />
          </div>

          <button className="submit-btn" type="submit">
            {hasBankDetails ? "Update" : "Add"}
          </button>
        </form>
      )}
    </div>
  );
};

export default BankDetail;
