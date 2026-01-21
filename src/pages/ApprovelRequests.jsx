import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { fetchPendingRequests } from "../api/mlmApi";
import ApproveModal from "../components/mlm/ApproveModal";
import Loading from "../components/Loader/Loading";
import { 
  FiUserCheck, 
  FiUser, 
  FiMail, 
  FiCalendar,
  FiAlertCircle,
  FiClock,
  FiEye
} from "react-icons/fi";
import { BiUserCircle } from "react-icons/bi";
import { MdPendingActions } from "react-icons/md";
import "./ApprovelRequests.scss";

export default function ApprovalRequests() {
  const [requests, setRequests] = useState([]);
  const [activeRequest, setActiveRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadRequests = () => {
    setLoading(true);
    fetchPendingRequests()
      .then(setRequests)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadRequests();
  }, []);

  return (
    <MainLayout>
      <div className="approval-page">
        <div className="approval-container">
          
          {/* Header Section */}
          <div className="approval-header">
            <div className="header-content">
              <MdPendingActions className="header-icon" />
              <div className="header-info">
                <h1>Pending Requests</h1>
                <p>Review and approve new registration requests</p>
              </div>
            </div>
            {!loading && requests.length > 0 && (
              <div className="requests-count">
                <FiClock className="count-icon" />
                <span>{requests.length} Pending</span>
              </div>
            )}
          </div>

          {loading && <Loading />}

          {!loading && requests.length === 0 && (
            <div className="empty-state">
              <FiUserCheck className="empty-icon" />
              <h2>All Caught Up!</h2>
              <p>No pending registration requests at the moment.</p>
            </div>
          )}

          {!loading && requests.length > 0 && (
            <div className="requests-list">
              {requests.map((req) => (
                <div key={req.id} className="request-card">
                  <div className="card-content">
                    {/* <div className="user-avatar">
                      <BiUserCircle className="avatar-icon" />
                    </div> */}
                    
                    <div className="user-details">
                      <div className="detail-row">
                        <FiUser className="detail-icon" />
                        <div className="detail-info">
                          <span className="detail-label">Username</span>
                          <span className="detail-value">{req.username}</span>
                        </div>
                      </div>

                      <div className="detail-row">
                        <FiMail className="detail-icon" />
                        <div className="detail-info">
                          <span className="detail-label">Email</span>
                          <span className="detail-value">{req.email}</span>
                        </div>
                      </div>

                      <div className="detail-row">
                        <FiUserCheck className="detail-icon" />
                        <div className="detail-info">
                          <span className="detail-label">Sponsor</span>
                          <span className="detail-value sponsor">{req.sponsor}</span>
                        </div>
                      </div>

                      <div className="detail-row">
                        <FiCalendar className="detail-icon" />
                        <div className="detail-info">
                          <span className="detail-label">Requested</span>
                          <span className="detail-value date">
                            {new Date(req.created_at).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card-actions">
                    <button
                      className="review-button"
                      onClick={() => setActiveRequest(req)}
                    >
                      <FiEye className="button-icon" />
                      Review
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeRequest && (
            <ApproveModal
              request={activeRequest}
              onClose={() => setActiveRequest(null)}
              onSuccess={() => {
                setActiveRequest(null);
                loadRequests();
              }}
            />
          )}
        </div>
      </div>
    </MainLayout>
  );
}

