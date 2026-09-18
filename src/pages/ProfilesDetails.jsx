import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API = "https://sapta-vachan-backend.onrender.com";

const ProfilesDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [profile, setUserData] = useState({});
  const [interestSent, setInterestSent] = useState(false);
  const [showMessagePopup, setShowMessagePopup] = useState(false);

  // ================================
  // GET USER DETAIL
  // ================================

  const GetUserDetail = () => {
    axios
      .get(`${API}/getUserBy/${id}`)
      .then((res) => {
        console.log("PROFILE DETAIL:", res.data);
        setUserData(res.data);
      })
      .catch((err) => {
        console.log("GET USER DETAIL ERROR:", err);
      });
  };

  useEffect(() => {
    GetUserDetail();
  }, [id]);

  // ================================
  // LOGIN CHECK
  // ================================

  const isLoggedIn = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return false;
    }

    return true;
  };

  // ================================
  // SEND INTEREST
  // ================================

  const sendInterest = () => {

    // Login check
    if (!isLoggedIn()) {
      return;
    }

    // User logged in
    setInterestSent(true);

    console.log(
      `Interest sent to ${profile.name}`
    );
  };

  // ================================
  // MESSAGE BUTTON
  // ================================

  const handleMessage = () => {

    // Login check first
    if (!isLoggedIn()) {
      return;
    }

    // Logged in but interest not sent
    if (!interestSent) {
      setShowMessagePopup(true);
      return;
    }

    // Interest already sent
    navigate(`/messages?user=${id}`);
  };

  // ================================
  // POPUP -> SEND INTEREST
  // ================================

  const handlePopupInterest = () => {

    if (!isLoggedIn()) {
      return;
    }

    setInterestSent(true);
    setShowMessagePopup(false);

    console.log(
      `Interest sent to ${profile.name}`
    );
  };

  return (
    <>
      <main className="profile-detail-page">

        {/* =================================
            BACK
        ================================= */}

        <button
          className="back-profile-btn"
          onClick={() => navigate(-1)}
        >
          ← Back to Matches
        </button>

        {/* =================================
            MAIN CARD
        ================================= */}

        <section className="profile-detail-card">

          {/* =================================
              LEFT IMAGE
          ================================= */}

          <div className="profile-detail-image-section">

            <div className="profile-detail-image">

              {profile.image ? (
                <img
                  src={`${API}/upload/${profile.image}`}
                  alt={profile.name || "Profile"}
                />
              ) : (
                <div className="profile-detail-placeholder">
                  {profile.name
                    ? profile.name
                        .charAt(0)
                        .toUpperCase()
                    : "U"}
                </div>
              )}

              {profile.verified && (
                <span className="detail-verified">
                  ✓ Verified Profile
                </span>
              )}

            </div>

            {/* =================================
                IMAGE ACTIONS
            ================================= */}

            <div className="image-actions">

              {/* INTEREST */}

              <button
                className={`send-interest-btn ${
                  interestSent
                    ? "interest-sent"
                    : ""
                }`}
                onClick={sendInterest}
                disabled={interestSent}
              >

                <span>
                  {interestSent ? "♥" : "♡"}
                </span>

                {interestSent
                  ? "Interest Sent"
                  : "Send Interest"}

              </button>

              {/* MESSAGE */}

              <button
                className="send-message-btn"
                onClick={handleMessage}
              >
                💬 Message
              </button>

            </div>

          </div>

          {/* =================================
              RIGHT CONTENT
          ================================= */}

          <div className="profile-detail-content">

            <span className="profile-small-title">
              MATRIMONIAL PROFILE
            </span>

            <h1>
              {profile.name || "Profile"}
            </h1>

            <p className="profile-basic-location">
              📍{" "}
              {profile.city ||
                "Location not mentioned"}
            </p>

            <div className="profile-line"></div>

            {/* =================================
                BASIC INFO
            ================================= */}

            <div className="basic-info">

              <div>
                <span>Age</span>

                <strong>
                  {profile.age || "—"}
                </strong>
              </div>

              <div>
                <span>Gender</span>

                <strong>
                  {profile.gender || "—"}
                </strong>
              </div>

              <div>
                <span>Profession</span>

                <strong>
                  {profile.profession || "—"}
                </strong>
              </div>

            </div>

            {/* =================================
                ABOUT
            ================================= */}

            <div className="detail-section">

              <h2>
                About{" "}
                {profile.name ||
                  "This Person"}
              </h2>

              <p>
                {profile.bio ||
                  profile.about ||
                  `${
                    profile.name ||
                    "This person"
                  } is looking for a meaningful relationship and a compatible life partner.`}
              </p>

            </div>

            {/* =================================
                PERSONAL DETAILS
            ================================= */}

            <div className="detail-section">

              <h2>
                Personal Details
              </h2>

              <div className="detail-grid">

                <div className="detail-item">
                  <span>
                    Education
                  </span>

                  <strong>
                    {profile.education ||
                      "Not mentioned"}
                  </strong>
                </div>

                <div className="detail-item">
                  <span>
                    Profession
                  </span>

                  <strong>
                    {profile.profession ||
                      "Not mentioned"}
                  </strong>
                </div>

                <div className="detail-item">
                  <span>
                    Religion
                  </span>

                  <strong>
                    {profile.religion ||
                      "Not mentioned"}
                  </strong>
                </div>

                <div className="detail-item">
                  <span>
                    Community
                  </span>

                  <strong>
                    {profile.community ||
                      "Not mentioned"}
                  </strong>
                </div>

                <div className="detail-item">
                  <span>
                    Location
                  </span>

                  <strong>
                    {profile.city ||
                      "Not mentioned"}
                  </strong>
                </div>

                <div className="detail-item">
                  <span>
                    Marital Status
                  </span>

                  <strong>
                    {profile.maritalStatus ||
                      "Never Married"}
                  </strong>
                </div>

              </div>

            </div>

            {/* =================================
                CONTACT
            ================================= */}

            <div className="detail-section">

              <h2>
                Contact Information
              </h2>

              <div className="contact-box">

                <div>
                  <span>Email</span>

                  <strong>
                    {profile.email ||
                      "Not available"}
                  </strong>
                </div>

                {profile.phone && (
                  <div>
                    <span>Phone</span>

                    <strong>
                      {profile.phone}
                    </strong>
                  </div>
                )}

              </div>

            </div>

            {/* =================================
                BOTTOM ACTION
            ================================= */}

            <div className="profile-final-action">

              <button
                className={`final-interest-btn ${
                  interestSent
                    ? "interest-sent"
                    : ""
                }`}
                onClick={sendInterest}
                disabled={interestSent}
              >

                <span className="heart-icon">
                  {interestSent
                    ? "♥"
                    : "♡"}
                </span>

                {interestSent
                  ? "Interest Sent"
                  : `Send Interest to ${
                      profile.name ||
                      "Profile"
                    }`}

              </button>

            </div>

          </div>

        </section>

      </main>

      {/* =================================
          MESSAGE PERMISSION POPUP
      ================================= */}

      {showMessagePopup && (

        <div
          className="message-popup-overlay"
          onClick={() =>
            setShowMessagePopup(false)
          }
        >

          <div
            className="message-popup"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <button
              className="popup-close"
              onClick={() =>
                setShowMessagePopup(false)
              }
            >
              ×
            </button>

            <div className="popup-heart">
              ♡
            </div>

            <h2>
              Send Interest First
            </h2>

            <p>
              Before starting a conversation
              with{" "}
              <strong>
                {profile.name ||
                  "this person"}
              </strong>
              , you need to send them an
              interest.
            </p>

            <div className="popup-actions">

              <button
                className="popup-interest-btn"
                onClick={handlePopupInterest}
              >
                <span>
                  ♥
                </span>

                Send Interest
              </button>

              <button
                className="popup-cancel-btn"
                onClick={() =>
                  setShowMessagePopup(false)
                }
              >
                Maybe Later
              </button>

            </div>

          </div>

        </div>

      )}

    </>
  );
};

export default ProfilesDetails;