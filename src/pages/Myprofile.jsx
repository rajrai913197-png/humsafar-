import axios from "axios";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const API = "https://sapta-vachan-backend.onrender.com";

const MyProfile = () => {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profile, setProfile] = useState({});

  // ==========================================
  // GET TOKEN + USER ID
  // ==========================================

  const token = localStorage.getItem("token");

  let id = null;

  try {
    if (token) {
      const decoded = jwtDecode(token);
      id = decoded?.userId;
    }
  } catch (error) {
    console.log("TOKEN DECODE ERROR:", error);

    localStorage.removeItem("token");
    navigate("/login");
  }

  // ==========================================
  // GET PROFILE
  // ==========================================

  const getProfile = async () => {
    if (!id) return;

    try {
      const res = await axios.get(`${API}/getProfile/${id}`);

      console.log("PROFILE DATA:", res.data);

      setProfile(res.data);
    } catch (error) {
      console.log(
        "GET PROFILE ERROR:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  // ==========================================
  // NAVIGATION
  // ==========================================

  const goTo = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // ==========================================
  // PROFILE COMPLETENESS
  // ==========================================

  const profileFields = [
    profile.name,
    profile.age,
    profile.gender,
    profile.city,
    profile.education,
    profile.profession,
    profile.religion,
    profile.bio,
    profile.image,
    profile.fatherName,
    profile.motherName,
    profile.siblings,
    profile.familyBackground,
  ];

  const completedFields = profileFields.filter(
    (field) =>
      field !== undefined &&
      field !== null &&
      field !== ""
  ).length;

  const completeness = Math.round(
    (completedFields / profileFields.length) * 100
  );

  return (
    <main className="sv-profile-page">

      {/* ========================================
          TOP NAVIGATION
      ======================================== */}

      <header className="sv-topbar">

        <button
          className="sv-back-button"
          onClick={() => navigate("/home")}
        >
          <span>←</span>
          <span>Back</span>
        </button>

        <div className="sv-topbar-brand">
          <div className="sv-mini-logo">स</div>

          <div>
            <strong>Sapta Vachan</strong>
            <span>Seven vows. One lifetime.</span>
          </div>
        </div>

        <div className="sv-top-actions">

          <button
            className="sv-edit-top"
            onClick={() => navigate("/createprofile")}
          >
            <span>✎</span>
            Edit Profile
          </button>

          <button
            className="sv-menu-trigger"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

        </div>

      </header>


      {/* ========================================
          SIDEBAR OVERLAY
      ======================================== */}

      <div
        className={`sv-drawer-overlay ${
          menuOpen ? "sv-drawer-overlay-show" : ""
        }`}
        onClick={() => setMenuOpen(false)}
      />


      {/* ========================================
          SIDEBAR
      ======================================== */}

      <aside
        className={`sv-profile-drawer ${
          menuOpen ? "sv-profile-drawer-open" : ""
        }`}
      >

        <div className="sv-drawer-top">

          <div className="sv-drawer-brand">

            <div className="sv-drawer-logo">
              स
            </div>

            <div>
              <strong>Sapta Vachan</strong>
              <span>My profile space</span>
            </div>

          </div>

          <button
            className="sv-drawer-close"
            onClick={() => setMenuOpen(false)}
          >
            ×
          </button>

        </div>


        <div className="sv-drawer-user">

          <div className="sv-drawer-avatar">

            {profile.image ? (
              <img
                src={profile.image}
                alt={profile.name || "Profile"}
              />
            ) : (
              <span>
                {profile.name
                  ? profile.name
                      .charAt(0)
                      .toUpperCase()
                  : "U"}
              </span>
            )}

          </div>

          <div className="sv-drawer-user-info">

            <strong>
              {profile.name || "Your Profile"}
            </strong>

            <span>
              {profile.city || "Complete your profile"}
            </span>

          </div>

        </div>


        <div className="sv-drawer-label">
          NAVIGATION
        </div>


        <nav className="sv-drawer-navigation">

          <button onClick={() => goTo("/home")}>
            <span className="sv-nav-icon">⌂</span>
            <span>Home</span>
          </button>

          <button onClick={() => goTo("/findmatches")}>
            <span className="sv-nav-icon">♡</span>
            <span>Find Matches</span>
          </button>

          <button onClick={() => goTo("/interests")}>
            <span className="sv-nav-icon">♥</span>
            <span>Interests</span>
          </button>

          <button onClick={() => goTo("/messages")}>
            <span className="sv-nav-icon">✉</span>
            <span>Messages</span>
          </button>

          <button onClick={() => goTo("/notification")}>
            <span className="sv-nav-icon">♢</span>
            <span>Notifications</span>
          </button>

          <button
            className="sv-nav-active"
            onClick={() => goTo("/myprofile")}
          >
            <span className="sv-nav-icon">♙</span>
            <span>My Profile</span>
          </button>

          <button onClick={() => goTo("/settings")}>
            <span className="sv-nav-icon">⚙</span>
            <span>Settings</span>
          </button>

        </nav>


        <button
          className="sv-drawer-logout"
          onClick={logout}
        >
          <span>↪</span>
          <span>Logout</span>
        </button>

      </aside>


      {/* ========================================
          PAGE INTRO
      ======================================== */}

      <section className="sv-profile-intro">

        <div>

          <span className="sv-intro-kicker">
            YOUR STORY
          </span>

          <h1>
            My Profile
          </h1>

          <p>
            A beautiful introduction to the person
            behind the profile.
          </p>

        </div>

        <div className="sv-intro-decoration">
          <span>✦</span>
          <span>♡</span>
          <span>✦</span>
        </div>

      </section>


      {/* ========================================
          PROFILE HERO
      ======================================== */}

      <section className="sv-profile-hero">

        <div className="sv-hero-photo-area">

          <div className="sv-photo-frame">

            <div className="sv-photo-inner">

              {profile.image ? (

                <img
                  src={profile.image}
                  alt={profile.name || "Profile"}
                />

              ) : (

                <span>
                  {profile.name
                    ? profile.name
                        .charAt(0)
                        .toUpperCase()
                    : "U"}
                </span>

              )}

            </div>

          </div>

          <div className="sv-photo-badge">
            <span>✓</span>
            Profile
          </div>

        </div>


        <div className="sv-hero-content">

          <span className="sv-hero-kicker">
            PERSONAL PROFILE
          </span>

          <h2>
            {profile.name || "Your Name"}
          </h2>

          <div className="sv-hero-meta">

            <span>
              {profile.age || "—"} Years
            </span>

            <i>•</i>

            <span>
              {profile.gender || "—"}
            </span>

            <i>•</i>

            <span>
              {profile.city || "—"}
            </span>

          </div>


          <div className="sv-hero-career">

            <div>
              <span>EDUCATION</span>

              <strong>
                {profile.education || "Not added"}
              </strong>
            </div>

            <div>
              <span>PROFESSION</span>

              <strong>
                {profile.profession || "Not added"}
              </strong>
            </div>

          </div>


          <div className="sv-profile-strength">

            <div className="sv-strength-heading">

              <div>
                <span>PROFILE STRENGTH</span>
                <strong>
                  Keep your story complete
                </strong>
              </div>

              <b>
                {completeness}%
              </b>

            </div>

            <div className="sv-strength-track">

              <div
                className="sv-strength-fill"
                style={{
                  width: `${completeness}%`,
                }}
              />

            </div>

          </div>

        </div>

      </section>


      {/* ========================================
          MAIN CONTENT GRID
      ======================================== */}

      <section className="sv-content-grid">


        {/* ====================================
            ABOUT
        ==================================== */}

        <article className="sv-card sv-about-card">

          <div className="sv-card-heading">

            <div className="sv-card-symbol">
              ♡
            </div>

            <div>
              <span>GET TO KNOW ME</span>
              <h3>About Me</h3>
            </div>

          </div>

          <p className="sv-about-text">
            {profile.bio ||
              "Tell us something beautiful about yourself. Add a short introduction so people can know you better."}
          </p>

          <div className="sv-card-line" />

          <div className="sv-about-note">
            <span>✦</span>
            <p>
              Your profile is your first impression.
              Let your personality speak.
            </p>
          </div>

        </article>


        {/* ====================================
            PERSONAL DETAILS
        ==================================== */}

        <article className="sv-card sv-personal-card">

          <div className="sv-card-heading">

            <div className="sv-card-symbol">
              ✦
            </div>

            <div>
              <span>WHO I AM</span>
              <h3>Personal Details</h3>
            </div>

          </div>

          <div className="sv-info-list">

            <ProfileInfo
              label="Full Name"
              value={profile.name}
            />

            <ProfileInfo
              label="Age"
              value={
                profile.age
                  ? `${profile.age} Years`
                  : "-"
              }
            />

            <ProfileInfo
              label="Gender"
              value={profile.gender}
            />

            <ProfileInfo
              label="Religion"
              value={profile.religion}
            />

            <ProfileInfo
              label="City"
              value={profile.city}
            />

            <ProfileInfo
              label="Email"
              value={profile.email}
            />

          </div>

        </article>


        {/* ====================================
            EDUCATION
        ==================================== */}

        <article className="sv-card sv-wide-card">

          <div className="sv-card-heading">

            <div className="sv-card-symbol">
              🎓
            </div>

            <div>
              <span>MY JOURNEY</span>
              <h3>Education & Career</h3>
            </div>

          </div>

          <div className="sv-journey-grid">

            <JourneyItem
              icon="🎓"
              label="Education"
              value={profile.education}
            />

            <JourneyItem
              icon="💼"
              label="Profession"
              value={profile.profession}
            />

          </div>

        </article>


        {/* ====================================
            FAMILY
        ==================================== */}

        <article className="sv-card sv-family-card">

          <div className="sv-card-heading">

            <div className="sv-card-symbol">
              ♧
            </div>

            <div>
              <span>MY ROOTS</span>
              <h3>Family Details</h3>
            </div>

          </div>

          <div className="sv-family-list">

            <ProfileInfo
              label="Father's Name"
              value={profile.fatherName}
            />

            <ProfileInfo
              label="Mother's Name"
              value={profile.motherName}
            />

            <ProfileInfo
              label="Siblings"
              value={profile.siblings}
            />

            <div className="sv-family-background">

              <span>
                FAMILY BACKGROUND
              </span>

              <strong>
                {profile.familyBackground || "-"}
              </strong>

            </div>

          </div>

        </article>


        {/* ====================================
            ACCOUNT
        ==================================== */}

        <article className="sv-card sv-account-card">

          <div className="sv-card-heading">

            <div className="sv-card-symbol">
              ⌁
            </div>

            <div>
              <span>ACCOUNT</span>
              <h3>Account Information</h3>
            </div>

          </div>

          <div className="sv-account-item">

            <span>Email Address</span>

            <strong>
              {profile.email || "-"}
            </strong>

          </div>

          <div className="sv-account-item">

            <span>Profile Status</span>

            <strong className="sv-account-status">
              <b>●</b>
              Profile Active
            </strong>

          </div>

        </article>

      </section>


      {/* ========================================
          MOBILE EDIT
      ======================================== */}

      <button
        className="sv-mobile-edit"
        onClick={() => navigate("/createprofile")}
      >
        <span>✎</span>
        Edit Profile
      </button>

    </main>
  );
};


// ======================================================
// PROFILE INFO
// ======================================================

const ProfileInfo = ({
  label,
  value,
}) => {
  return (
    <div className="sv-info-row">

      <span>
        {label}
      </span>

      <strong>
        {value || "-"}
      </strong>

    </div>
  );
};


// ======================================================
// JOURNEY ITEM
// ======================================================

const JourneyItem = ({
  icon,
  label,
  value,
}) => {
  return (
    <div className="sv-journey-item">

      <div className="sv-journey-icon">
        {icon}
      </div>

      <div>

        <span>
          {label}
        </span>

        <strong>
          {value || "Not added yet"}
        </strong>

      </div>

    </div>
  );
};


export default MyProfile;