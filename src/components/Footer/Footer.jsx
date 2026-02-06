import "./Footer.scss";
import { Link } from "react-router-dom";
import {FaInstagram,FaFacebook, FaYoutube,FaTwitter, FaLock, FaTruckPickup, FaTruck, FaCheck} from 'react-icons/fa'

export const Footer = () => {
 return (
   
    <footer className="footer">
      <div className="footer-container">

        {/* ===== BRAND ===== */}
        <div className="footer-section brand">
          <h2 className="footer-logo">BuyLiv</h2>
          <p className="footer-desc">
            BuyLiv is a next-generation  e-commerce platform offering
            high-quality products and genuine income opportunities.
          </p>

          {/* ===== SOCIAL MEDIA ===== */}
          <div className="social-icons">
            <a href="" aria-label="Facebook"><FaFacebook/></a>
            <a href="" aria-label="Instagram"><FaInstagram/></a>
            <a href="" aria-label="YouTube"><FaYoutube/></a>
            <a href="" aria-label="Twitter"><FaTwitter/></a>
          </div>
        </div>

        {/* ===== QUICK LINKS ===== */}
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to={'/products'} >Products</Link></li>
            <li><Link to={'/joining-packages'}>Joining Package</Link></li>
            <li><Link to={'/orders'}>My Orders</Link></li>
            <li><Link to={'/dashboard'}>Dashboard</Link></li>
          </ul>
        </div>

        {/* ===== MLM ===== */}
        <div className="footer-section">
          <h4>Career system</h4>
          <ul>
            <li><Link>Referral Program</Link></li>
            <li><Link to={'/tree'}>Genealogy Tree</Link></li>
            <li><Link >Income & Rewards</Link></li>
            <li><Link >Payout Requests</Link></li>
          </ul>
        </div>

        {/* ===== SUPPORT ===== */}
        <div className="footer-section">
          <h4>Support</h4>
          <ul>
            <li><Link to={'/about-us'}>About Us</Link></li>
            <li><Link >Contact Us</Link></li>
            <li><Link >Terms & Conditions</Link></li>
            <li><Link >Privacy Policy</Link></li>
          </ul>
        </div>

        {/* ===== NEWSLETTER ===== */}
        <div className="footer-section newsletter">
          <h4>Stay Updated</h4>
          <p>Get offers, updates & business tips.</p>

          <form className="newsletter-form">
            <input
              type="email"
              placeholder="Enter your email"
              required
            />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </div>

      {/* ===== TRUST STRIP ===== */}
      <div className="footer-trust">
        <span><FaLock/> Secure Payments</span>
        <span><FaTruck/> Delivery</span>
        <span><FaCheck/> 100% Genuine Products</span>
      </div>

      {/* ===== BOTTOM ===== */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} BuyLiv. All rights reserved.</p>
      </div>
    </footer>
  );
};
