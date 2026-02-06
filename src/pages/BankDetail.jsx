import React, { useEffect, useState } from "react";
import {
  fetchBankDetails,
  updateBankDetails,
  createBankDetails,
} from "../api/bankApi";
import Loading from "../components/Loader/Loading";
import { 
  FiArrowLeft, 
  FiEdit3, 
  FiSave, 
  FiX,
  FiCreditCard,
  FiUser,
  FiHash,
  FiShield
} from "react-icons/fi";
import { BsBank2 } from "react-icons/bs";
import { MdAccountBalance } from "react-icons/md";
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

      setBankDetails(data);
    } catch (error) {

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
 
    getBankDetails();
    setShowForm(false);
  };

  if (loading) return <Loading />;
  const hasBankDetails = bankDetails && Object.keys(bankDetails).length > 0;
  
  return (
    <div className="bank-detail-page">
      <div className="bank-detail-container">
        
        {/* Header Section */}
        <div className="page-header">
          <button className="back-btn" onClick={() => window.history.back()}>
            <FiArrowLeft />
            <span>Back</span>
          </button>
          <div className="header-content">
            <div className="header-icon">
              <MdAccountBalance />
            </div>
            <div className="header-info">
              <h1>Bank Account Details</h1>
              <p>Manage your banking information securely</p>
            </div>
          </div>
        </div>

        {/* Display Bank Details */}
        {hasBankDetails && !showForm && (
          <div className="bank-details-card">
            <div className="card-header">
              <div className="header-title">
                <BsBank2 className="section-icon" />
                <h2>Your Bank Account</h2>
              </div>
              <button className="edit-btn" onClick={handleEdit}>
                <FiEdit3 />
                <span>Edit Details</span>
              </button>
            </div>

            <div className="card-body">
              <div className="detail-row">
                <div className="detail-label">
                  <BsBank2 className="detail-icon" />
                  <span>Bank Name</span>
                </div>
                <div className="detail-value">{bankDetails.bank_name}</div>
              </div>

              <div className="detail-row">
                <div className="detail-label">
                  <FiUser className="detail-icon" />
                  <span>Account Holder Name</span>
                </div>
                <div className="detail-value">{bankDetails.account_holder_name}</div>
              </div>

              <div className="detail-row">
                <div className="detail-label">
                  <FiCreditCard className="detail-icon" />
                  <span>Account Number</span>
                </div>
                <div className="detail-value account-number">
                  {bankDetails.account_number}
                </div>
              </div>

              <div className="detail-row">
                <div className="detail-label">
                  <FiHash className="detail-icon" />
                  <span>IFSC Code</span>
                </div>
                <div className="detail-value ifsc-code">
                  {bankDetails.ifsc_code}
                </div>
              </div>
            </div>

            <div className="security-notice">
              <FiShield className="shield-icon" />
              <div className="notice-text">
                <strong>Security Notice:</strong> Your bank details are encrypted and securely stored. We never share your information with third parties.
              </div>
            </div>
          </div>
        )}

        {/* Bank Details Form */}
        {(!hasBankDetails || showForm) && (
          <div className="bank-form-card">
            <div className="card-header">
              <div className="header-title">
                <BsBank2 className="section-icon" />
                <h2>{hasBankDetails ? "Edit Bank Details" : "Add Bank Details"}</h2>
              </div>
            </div>

            <form className="bank-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>
                  <BsBank2 className="label-icon" />
                  Bank Name
                </label>
                <div className="input-wrapper">
                  <BsBank2 className="input-icon" />
                  <input
                    type="text"
                    name="bank_name"
                    placeholder="Enter your bank name"
                    value={formData.bank_name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>
                  <FiUser className="label-icon" />
                  Account Holder Name
                </label>
                <div className="input-wrapper">
                  <FiUser className="input-icon" />
                  <input
                    type="text"
                    name="account_holder_name"
                    placeholder="Enter account holder name"
                    value={formData.account_holder_name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>
                  <FiCreditCard className="label-icon" />
                  Account Number
                </label>
                <div className="input-wrapper">
                  <FiCreditCard className="input-icon" />
                  <input
                    type="text"
                    name="account_number"
                    placeholder="Enter your account number"
                    value={formData.account_number}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>
                  <FiHash className="label-icon" />
                  IFSC Code
                </label>
                <div className="input-wrapper">
                  <FiHash className="input-icon" />
                  <input
                    type="text"
                    name="ifsc_code"
                    placeholder="Enter IFSC code"
                    value={formData.ifsc_code}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="submit-btn">
                  <FiSave />
                  <span>{hasBankDetails ? "Update Details" : "Save Details"}</span>
                </button>
                {showForm && (
                  <button 
                    type="button" 
                    className="cancel-btn"
                    onClick={() => {
                      setShowForm(false);
                      setFormData({
                        bank_name: "",
                        account_holder_name: "",
                        account_number: "",
                        ifsc_code: "",
                      });
                    }}
                  >
                    <FiX />
                    <span>Cancel</span>
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};

export default BankDetail;
