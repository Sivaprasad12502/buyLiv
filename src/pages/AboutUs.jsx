import React from "react";
import MainLayout from "../layouts/MainLayout";
import "./AboutUs.scss";
import { FiMail, FiPhone } from "react-icons/fi";

const AboutUs = () => {
  return (
    <MainLayout>
      <div className="about-us">
        {/* Vision */}
        <section className="vision">
          <h1>Our Vision</h1>
          <div className="divider"></div>
          <p>
            We are driven by a vision to enable holistic and sustainable
            development by strengthening the core pillars of human progress —
            <strong>
              {" "}
              health, prosperity, recreation, education, and employment
            </strong>
          </p>
        </section>

        {/* Mission */}
        <section className="mission">
          <div className="mission-content">
            <h2>Our Mission</h2>
            <p>
              Our strategic focus is on creating scalable and sustainable
              employment across the value chain of raw material production,
              storage, processing, and distribution. By championing locally
              produced, agriculture-based value-added products alongside
              diversified industrial offerings, we aim to build resilient supply
              ecosystems. Through this integrated approach, we seek to
              accelerate growth in the agricultural and industrial sectors,
              foster economic resilience, and contribute meaningfully to the
              long-term prosperity of the nation.
            </p>
          </div>

          {/* <div className="mission-highlights">
            <h3>What We Stand For</h3>
            <ul>
              <li>Sustainable employment generation</li>
              <li>Local production empowerment</li>
              <li>Agriculture-based value addition</li>
              <li>Industrial diversification</li>
              <li>Economic resilience</li>
            </ul>
          </div> */}
        </section>

        {/* Leadership */}
        <section className="leadership">
          <h2>Leadership Team</h2>

          <div className="leaders-grid">
            <div className="leader-card">
              <h3>Symon Poulose</h3>
              <span>Chief Executive Officer (CEO)</span>
              <p>
                Chief Executive Officer (CEO) and a Designated Partner of the
                company, responsible for product management and operations. With
                nearly 30 years of experience in indigenous medicines,
                nutritional foods, and wellness products, he heads the training
                division and has mentored hundreds of professionals across the
                industry.
              </p>
            </div>

            <div className="leader-card">
              <h3>Siji Wayanad</h3>
              <span>Chief Marketing Officer (CMO)</span>
              <p>
                Chief Marketing Officer (CMO) of the company, bringing over 30
                years of experience across automobiles, real estate, multipoint
                mercantile systems, and the direct selling industry. He holds a
                Government of India certification in labour and business studies
                and comes from a respected Ayurvedic Vaidyar family, with strong
                involvement in Ayurveda-based businesses. He is a key
                contributor to the company’s growth and marketing strategy.
              </p>
            </div>
            <div className="leader-card">
              <h3>Jinesh VK</h3>
              <span>Project Managing Head & Managing Partner</span>
              <p>
                Managing Head and Managing Partner of Buyliv E-Commerce LLP and
                the company’s main Designated Partner, responsible for
                administration and operations. He has over 10 years of
                experience in the tourism industry and owns multiple tourist
                resorts and land assets. He has supported tourism projects at
                both Kerala state and national levels, bringing strong industry
                expertise and leadership to the company.
              </p>
            </div>

            <div className="leader-card">
              <h3>Hynes Abdul Gafoor</h3>
              <span>Operations & Accounts Lead</span>
              <p>
                Plays a key role in the company’s daily operations, handling
                accounts, purchasing, sales, and operational management. As a
                core supporting executive, he oversees labour coordination,
                technical support, and data management, making him an all-round
                contributor to the company’s efficiency.
              </p>
            </div>
          </div>
        </section>
        {/* Address */}
        <section className="address">
          <h2>Registered Office</h2>

          <div className="address-card">
            <h3>BUYLIV E COMMERCE LLP</h3>
            <p>
              Malankara Arcade
              <br />
              Kolagappara Jn.
              <br />
              Sulthan Bathery, Wayanad
              <br />
              Kerala – 673592
            </p>
            <p className="contact">
              <a href="tel:04936215722">
                {" "}
                <FiPhone /> 04936 215722
              </a>
           

              <a href="mailto:buylivecommercellp@gmail.com">
                <FiMail /> buylivecommercellp@gmail.com
              </a>
            </p>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default AboutUs;
