import axios from "axios";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const API = "https://sapta-vachan-backend.onrender.com";

const MyProfile = () => {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profile, setProfile] = useState({});

  // ================================
  // GET TOKEN + USER ID
  // ================================

  const token = localStorage.getItem("token");

  let id = null;

  try {
    if (token) {
      const decoded = jwtDecode(token);
      id = decoded?.userId;

      console.log("MY PROFILE USER ID:", id);
    }
  } catch (error) {
    console.log("TOKEN DECODE ERROR:", error);

    localStorage.removeItem("token");
    navigate("/login");
  }

  // ================================
  // GET PROFILE
  // ================================

  const getProfile = async () => {
    if (!id) {
      console.log("USER ID NOT FOUND");
      return;
    }

    try {
      const res = await axios.get(
        `${API}/getProfile/${id}`
      );

      console.log("PROFILE DATA:", res.data);
      console.log(
        "CLOUDINARY IMAGE URL:",
        res.data.image
      );

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

  // ================================
  // NAVIGATION
  // ================================

  const goTo = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  // ================================
  // LOGOUT
  // ================================

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // ================================
  // PROFILE COMPLETENESS
  // ================================

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
    <main className="my-profile-page">

      {/* =================================
          BACK BUTTON
      ================================= */}

      <button
        type="button"
        className="my-profile-back-btn"
        onClick={() => navigate("/home")}
      >
        ← Back
      </button>

      {/* =================================
          SIDEBAR OVERLAY
      ================================= */}

      {menuOpen && (
        <div
          className="profile-overlay"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* =================================
          SIDEBAR
      ================================= */}

      <aside
        className={`profile-sidebar ${
          menuOpen ? "show" : ""
        }`}
      >

        {/* SIDEBAR HEADER */}

        <div className="sidebar-header">

          <div className="sidebar-brand">

            <div className="brand-circle">
              स
            </div>

            <div>
              <h3>Sapta Vachan</h3>

              <p>
                Seven vows. One lifetime.
              </p>
            </div>

          </div>

          <button
            className="close-sidebar"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            ×
          </button>

        </div>

        {/* SIDEBAR USER */}

        <div className="sidebar-profile">

          <div className="sidebar-avatar">

            {profile.image ? (

              <img
                src={profile.image}
                alt={profile.name || "Profile"}
                onLoad={() => {
                  console.log(
                    "SIDEBAR CLOUDINARY IMAGE LOADED:",
                    profile.image
                  );
                }}
                onError={(e) => {
                  console.log(
                    "SIDEBAR CLOUDINARY IMAGE ERROR:",
                    profile.image
                  );

                  e.currentTarget.style.display =
                    "none";
                }}
              />

            ) : (

              profile.name
                ? profile.name.charAt(0).toUpperCase()
                : "U"

            )}

          </div>

          <div>

            <h4>
              {profile.name || "Your Profile"}
            </h4>

            <span>
              My Profile
            </span>

          </div>

        </div>

        {/* SIDEBAR NAVIGATION */}

        <nav className="sidebar-menu">

          <button
            onClick={() => goTo("/home")}
          >
            <span className="sidebar-icon">
              ⌂
            </span>

            <span>
              Home
            </span>
          </button>

          <button
            onClick={() => goTo("/findmatches")}
          >
            <span className="sidebar-icon">
              ♡
            </span>

            <span>
              Find Matches
            </span>
          </button>

          <button
            onClick={() => goTo("/interests")}
          >
            <span className="sidebar-icon">
              ♥
            </span>

            <span>
              Interests
            </span>
          </button>

          <button
            onClick={() => goTo("/messages")}
          >
            <span className="sidebar-icon">
              ✉
            </span>

            <span>
              Messages
            </span>
          </button>

          <button
            onClick={() => goTo("/notification")}
          >
            <span className="sidebar-icon">
              ♢
            </span>

            <span>
              Notifications
            </span>
          </button>

          <button
            className="active"
            onClick={() => goTo("/myprofile")}
          >
            <span className="sidebar-icon">
              ♙
            </span>

            <span>
              My Profile
            </span>
          </button>

          <button
            onClick={() => goTo("/settings")}
          >
            <span className="sidebar-icon">
              ⚙
            </span>

            <span>
              Settings
            </span>
          </button>

        </nav>

        {/* LOGOUT */}

        <button
          className="logout-btn"
          onClick={logout}
        >
          <span>
            ↪
          </span>

          <span>
            Logout
          </span>
        </button>

      </aside>

      {/* =================================
          PAGE HEADER
      ================================= */}

      <header className="profile-header">

        <div className="profile-heading">

          <p className="eyebrow">
            YOUR PROFILE
          </p>

          <h1>
            My Profile
          </h1>

          <p className="header-subtitle">
            Your story deserves to be beautifully told.
          </p>

        </div>

        <div className="header-actions">

          {/* EDIT PROFILE */}

          <button
            className="edit-btn"
            onClick={() => navigate("/createprofile")}
          >
            <span>
              ✎
            </span>

            Edit Profile
          </button>

          {/* HAMBURGER */}

          <button
            className="menu-btn"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            ☰
          </button>

        </div>

      </header>

      {/* =================================
          PROFILE HERO
      ================================= */}

      <section className="profile-hero">

        <div className="profile-photo-wrapper">

          <div className="profile-photo">

            {profile.image ? (

              <img
                src={profile.image}
                alt={profile.name || "Profile"}
                onLoad={() => {
                  console.log(
                    "MAIN CLOUDINARY IMAGE LOADED:",
                    profile.image
                  );
                }}
                onError={(e) => {
                  console.log(
                    "MAIN CLOUDINARY IMAGE ERROR:",
                    profile.image
                  );

                  e.currentTarget.style.display =
                    "none";
                }}
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

          <span className="verified">
            ✓
          </span>

        </div>

        <div className="hero-info">

          <p className="hero-label">
            PERSONAL PROFILE
          </p>

          <h2>
            {profile.name || "Your Name"}
          </h2>

          <div className="basic-info">

            <span>
              {profile.age || "-"} Years
            </span>

            <i>
              •
            </i>

            <span>
              {profile.gender || "-"}
            </span>

            <i>
              •
            </i>

            <span>
              {profile.city || "-"}
            </span>

          </div>

          <div className="hero-details">

            <span>
              <b>🎓</b>
              {profile.education ||
                "Education not added"}
            </span>

            <span>
              <b>💼</b>
              {profile.profession ||
                "Profession not added"}
            </span>

          </div>

          {/* COMPLETENESS */}

          <div className="completion">

            <div className="completion-text">

              <span>
                Profile Completeness
              </span>

              <strong>
                {completeness}%
              </strong>

            </div>

            <div className="progress">

              <div
                className="progress-fill"
                style={{
                  width: `${completeness}%`,
                }}
              />

            </div>

          </div>

        </div>

      </section>

      {/* =================================
          ABOUT
      ================================= */}

      <section className="profile-section">

        <div className="section-title">

          <div className="section-icon">
            ♡
          </div>

          <div>

            <p>
              GET TO KNOW ME
            </p>

            <h2>
              About Me
            </h2>

          </div>

        </div>

        <div className="about-card">

          <p>
            {profile.bio ||
              "Tell us something beautiful about yourself. Add a short introduction so people can know you better."}
          </p>

        </div>

      </section>

      {/* =================================
          PERSONAL DETAILS
      ================================= */}

      <section className="profile-section">

        <div className="section-title">

          <div className="section-icon">
            ✦
          </div>

          <div>

            <p>
              WHO I AM
            </p>

            <h2>
              Personal Details
            </h2>

          </div>

        </div>

        <div className="details-grid">

          <Detail
            icon="♙"
            label="Full Name"
            value={profile.name}
          />

          <Detail
            icon="◷"
            label="Age"
            value={
              profile.age
                ? `${profile.age} Years`
                : "-"
            }
          />

          <Detail
            icon="♢"
            label="Gender"
            value={profile.gender}
          />

          <Detail
            icon="✦"
            label="Religion"
            value={profile.religion}
          />

          <Detail
            icon="⌖"
            label="City"
            value={profile.city}
          />

          <Detail
            icon="✉"
            label="Email"
            value={profile.email}
          />

        </div>

      </section>

      {/* =================================
          EDUCATION & CAREER
      ================================= */}

      <section className="profile-section">

        <div className="section-title">

          <div className="section-icon">
            🎓
          </div>

          <div>

            <p>
              MY JOURNEY
            </p>

            <h2>
              Education & Career
            </h2>

          </div>

        </div>

        <div className="details-grid">

          <Detail
            icon="🎓"
            label="Education"
            value={profile.education}
          />

          <Detail
            icon="💼"
            label="Profession"
            value={profile.profession}
          />

        </div>

      </section>

      {/* =================================
          FAMILY DETAILS
      ================================= */}

      <section className="profile-section">

        <div className="section-title">

          <div className="section-icon">
            ♧
          </div>

          <div>

            <p>
              MY ROOTS
            </p>

            <h2>
              Family Details
            </h2>

          </div>

        </div>

        <div className="details-grid">

          <Detail
            icon="♙"
            label="Father's Name"
            value={profile.fatherName}
          />

          <Detail
            icon="♡"
            label="Mother's Name"
            value={profile.motherName}
          />

          <Detail
            icon="♧"
            label="Siblings"
            value={profile.siblings}
          />

          <Detail
            icon="✦"
            label="Family Background"
            value={profile.familyBackground}
            wide
          />

        </div>

      </section>

      {/* =================================
          ACCOUNT INFORMATION
      ================================= */}

      <section className="profile-section">

        <div className="section-title">

          <div className="section-icon">
            ⌁
          </div>

          <div>

            <p>
              ACCOUNT
            </p>

            <h2>
              Account Information
            </h2>

          </div>

        </div>

        <div className="account-card">

          <div>

            <span>
              Email Address
            </span>

            <strong>
              {profile.email || "-"}
            </strong>

          </div>

          <div>

            <span>
              Profile Status
            </span>

            <strong className="status">
              ● Profile Complete
            </strong>

          </div>

        </div>

      </section>

      {/* =================================
          MOBILE EDIT BUTTON
      ================================= */}

      <button
        className="mobile-edit-btn"
        onClick={() => navigate("/createprofile")}
      >
        ✎ Edit Profile
      </button>

    </main>
  );
};


// ======================================
// DETAIL COMPONENT
// ======================================

const Detail = ({
  icon,
  label,
  value,
  wide,
}) => {

  return (
    <div
      className={`detail-card ${
        wide ? "wide" : ""
      }`}
    >

      <div className="detail-icon">
        {icon}
      </div>

      <div>

        <span>
          {label}
        </span>

        <strong>
          {value || "-"}
        </strong>

      </div>

    </div>
  );
};

export default MyProfile;