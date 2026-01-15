import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { fetchReferralLink } from "../api/referralApi";

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

  return (
    <MainLayout>
      <div style={container}>
        <h2>Referral Link</h2>
        <p style={{ color: "#555", marginBottom: "20px" }}>
          Share this link to invite new users to BuyLiv.
        </p>

        <div style={card}>
          <label style={label}>Your Referral Link</label>

          <div style={linkBox}>
            <input
              value={referralLink}
              readOnly
              style={input}
            />
            <button onClick={copyToClipboard} style={copyBtn}>
              {copied ? "Copied" : "Copy"}
            </button>
          </div>

          <button
            onClick={whatsappShare}
            style={whatsappBtn}
          >
            Share via WhatsApp
          </button>
        </div>
      </div>
    </MainLayout>
  );
}

/* ================= STYLES ================= */

const container = {
  maxWidth: "600px",
  margin: "0 auto",
};

const card = {
  background: "#fff",
  border: "1px solid #ddd",
  borderRadius: "8px",
  padding: "20px",
};

const label = {
  display: "block",
  marginBottom: "8px",
  fontWeight: "600",
};

const linkBox = {
  display: "flex",
  gap: "10px",
  marginBottom: "15px",
};

const input = {
  flex: 1,
  padding: "10px",
  border: "1px solid #ccc",
  borderRadius: "4px",
};

const copyBtn = {
  padding: "10px 14px",
  border: "1px solid #000",
  background: "#000",
  color: "#fff",
  borderRadius: "4px",
  cursor: "pointer",
};

const whatsappBtn = {
  marginTop: "10px",
  width: "100%",
  padding: "12px",
  background: "#25D366",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "15px",
};
