import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { fetchReferralLink } from "../api/referralApi";
import { 
  FiLink, 
  FiCopy, 
  FiCheck, 
  FiShare2,
  FiUserPlus,
  FiUsers,
  FiGift
} from "react-icons/fi";
import { FaWhatsapp, FaFacebook, FaTwitter, FaTelegram } from "react-icons/fa";
import { BiShareAlt } from "react-icons/bi";
import "./ReferalLink.scss";

export default function ReferralLink() {
  const [referralLink, setReferralLink] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchReferralLink().then((data) => {
      // adjust key if backend differs
      setReferralLink(data.referral_link || data.link);
    });
  }, []);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const whatsappShare = () => {
    const message = encodeURIComponent(
      `Join BuyLiv using my referral link:\n${referralLink}`
    );

    window.open(
      `https://wa.me/?text=${message}`,
      "_blank"
    );
  };

  // const facebookShare = () => {
  //   window.open(
  //     `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`,
  //     "_blank"
  //   );
  // };

  // const twitterShare = () => {
  //   const text = encodeURIComponent("Join BuyLiv using my referral link!");
  //   window.open(
  //     `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(referralLink)}`,
  //     "_blank"
  //   );
  // };

  // const telegramShare = () => {
  //   const text = encodeURIComponent(`Join BuyLiv using my referral link: ${referralLink}`);
  //   window.open(
  //     `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${text}`,
  //     "_blank"
  //   );
  // };

  return (
    <MainLayout>
      <div className="referral-page">
        <div className="referral-container">
          
          {/* Header Section */}
          <div className="referral-header">
            <div className="header-content">
              <FiUserPlus className="header-icon" />
              <div className="header-info">
                <h1>Referral Link</h1>
                <p>Share your unique link and earn rewards when friends join!</p>
              </div>
            </div>
          </div>

         

          {/* Referral Link Card */}
          <div className="link-card">
            <div className="card-header">
              <FiLink className="link-icon" />
              <h2>Your Referral Link</h2>
            </div>

            <div className="card-body">
              <div className="link-input-group">
                <input
                  value={referralLink}
                  readOnly
                  className="link-input"
                  placeholder="Loading your referral link..."
                />
                <button 
                  onClick={copyToClipboard} 
                  className={`copy-button ${copied ? 'copied' : ''}`}
                  disabled={!referralLink}
                >
                  {copied ? (
                    <>
                      <FiCheck className="button-icon" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <FiCopy className="button-icon" />
                      Copy
                    </>
                  )}
                </button>
              </div>

              {/* Share Section */}
              <div className="share-section">
                <div className="share-header">
                  <FiShare2 className="share-icon" />
                  <h3>Share via Social Media</h3>
                </div>

                <div className="share-buttons">
                  <button
                    onClick={whatsappShare}
                    className="share-btn whatsapp"
                    disabled={!referralLink}
                  >
                    <FaWhatsapp className="share-btn-icon" />
                    <span>WhatsApp</span>
                  </button>

                  {/* <button
                    onClick={facebookShare}
                    className="share-btn facebook"
                    disabled={!referralLink}
                  >
                    <FaFacebook className="share-btn-icon" />
                    <span>Facebook</span>
                  </button> */}

                  {/* <button
                    onClick={twitterShare}
                    className="share-btn twitter"
                    disabled={!referralLink}
                  >
                    <FaTwitter className="share-btn-icon" />
                    <span>Twitter</span>
                  </button> */}

                  {/* <button
                    onClick={telegramShare}
                    className="share-btn telegram"
                    disabled={!referralLink}
                  >
                    <FaTelegram className="share-btn-icon" />
                    <span>Telegram</span>
                  </button> */}
                </div>
              </div>
            </div>
          </div>

          {/* Tips Section */}
          
        </div>
      </div>
    </MainLayout>
  );
}



