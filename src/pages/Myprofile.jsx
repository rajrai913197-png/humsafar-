import { useState } from "react";

const MyProfile = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [optionsOpen, setOptionsOpen] = useState(false);

  return (
    <main className="my-profile-page">

      {/* MOBILE OVERLAY */}
      {menuOpen && (
        <div
          className="profile-overlay"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}


      {/* ================= MOBILE SLIDER ================= */}

      <aside className={`profile-sidebar ${menuOpen ? "show" : ""}`}>

        <div className="sidebar-header">

          <div className="sidebar-brand">

            <div className="brand-circle">
              स
            </div>

            <div>
              <h3>Sapta Vachan</h3>
              <p>Seven vows. One lifetime.</p>
            </div>

          </div>

          <button
            className="close-sidebar"
            onClick={() => setMenuOpen(false)}
          >
            ×
          </button>

        </div>


        {/* USER */}
        <div className="sidebar-profile">

          <div className="sidebar-avatar">
            R
          </div>

          <div>
            <h4>Raj Rai</h4>
            <span>My Profile</span>
          </div>

        </div>


        {/* MENU */}
        <nav className="sidebar-menu">

          <button>
            ⌂ <span>Home</span>
          </button>

          <button>
            ♡ <span>Find Matches</span>
          </button>

          <button>
            ♥ <span>Interests</span>
          </button>

          <button>
            ✉ <span>Messages</span>
          </button>

          <button>
            ♢ <span>Notifications</span>
          </button>

          <button className="active">
            ♙ <span>My Profile</span>
          </button>

          <button>
            ⚙ <span>Settings</span>
          </button>

        </nav>


        {/* LOGOUT */}
        <button className="logout-btn">
          ↪ <span>Logout</span>
        </button>

      </aside>


      {/* ================= DESKTOP / MOBILE HEADER ================= */}

      <header className="profile-header">

        <div>

          <p className="eyebrow">
            YOUR PROFILE
          </p>

          <h1>
            My Profile
          </h1>

          <span className="header-subtitle">
            Your story deserves to be beautifully told.
          </span>

        </div>


        <div className="header-actions">

          {/* ONLY ONE EDIT BUTTON */}
          <button className="edit-btn">
            ✎ Edit Profile
          </button>


          {/* DESKTOP OPTIONS */}
          <div className="options-wrapper">

            <button
              className="options-btn"
              onClick={() => setOptionsOpen(!optionsOpen)}
            >
              ⋯
            </button>


            {optionsOpen && (

              <div className="options-dropdown">

                <button>
                  ⚙ Settings
                </button>

                <button>
                  🔒 Privacy
                </button>

                <button>
                  ❓ Help & Support
                </button>

                <hr />

                <button className="dropdown-logout">
                  ↪ Logout
                </button>

              </div>

            )}

          </div>


          {/* MOBILE MENU */}
          <button
            className="menu-btn"
            onClick={() => setMenuOpen(true)}
          >
            ☰
          </button>

        </div>

      </header>


      {/* ================= PROFILE HERO ================= */}

      <section className="profile-hero">

        <div className="profile-photo-wrapper">

          <div className="profile-photo">
            R
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
            Raj Rai
          </h2>

          <div className="basic-info">

            <span>22 Years</span>

            <span>•</span>

            <span>Male</span>

            <span>•</span>

            <span>Bhopal</span>

          </div>


          <div className="hero-details">

            <span>
              🎓 B.Sc Computer Science
            </span>

            <span>
              💼 Full Stack Developer
            </span>

          </div>


          {/* PROFILE COMPLETION */}

          <div className="completion">

            <div className="completion-text">

              <span>
                Profile Completeness
              </span>

              <strong>
                85%
              </strong>

            </div>

            <div className="progress">

              <div className="progress-fill"></div>

            </div>

          </div>

        </div>

      </section>


      {/* ================= ABOUT ================= */}

      <section className="profile-section">

        <div className="section-title">

          <div className="section-icon">
            ♡
          </div>

          <div>
            <p>GET TO KNOW ME</p>
            <h2>About Me</h2>
          </div>

        </div>


        <div className="about-card">

          <p>
            I am a passionate and ambitious person who believes
            in building meaningful relationships based on trust,
            understanding and respect. I enjoy technology,
            learning new things and spending quality time with
            family.
          </p>

        </div>

      </section>


      {/* ================= PERSONAL DETAILS ================= */}

      <section className="profile-section">

        <div className="section-title">

          <div className="section-icon">
            ✦
          </div>

          <div>
            <p>WHO I AM</p>
            <h2>Personal Details</h2>
          </div>

        </div>


        <div className="details-grid">

          <Detail
            icon="♙"
            label="Full Name"
            value="Raj Rai"
          />

          <Detail
            icon="◷"
            label="Age"
            value="22 Years"
          />

          <Detail
            icon="♢"
            label="Gender"
            value="Male"
          />

          <Detail
            icon="✦"
            label="Religion"
            value="Hindu"
          />

          <Detail
            icon="⌖"
            label="City"
            value="Bhopal"
          />

          <Detail
            icon="✉"
            label="Email"
            value="example@gmail.com"
          />

        </div>

      </section>


      {/* ================= EDUCATION ================= */}

      <section className="profile-section">

        <div className="section-title">

          <div className="section-icon">
            🎓
          </div>

          <div>
            <p>MY JOURNEY</p>
            <h2>Education & Career</h2>
          </div>

        </div>


        <div className="details-grid">

          <Detail
            icon="🎓"
            label="Education"
            value="B.Sc Computer Science"
          />

          <Detail
            icon="💼"
            label="Profession"
            value="Full Stack Developer"
          />

        </div>

      </section>


      {/* ================= FAMILY ================= */}

      <section className="profile-section">

        <div className="section-title">

          <div className="section-icon">
            ♧
          </div>

          <div>
            <p>MY ROOTS</p>
            <h2>Family Details</h2>
          </div>

        </div>


        <div className="details-grid">

          <Detail
            icon="♙"
            label="Father's Name"
            value="Father Name"
          />

          <Detail
            icon="♡"
            label="Mother's Name"
            value="Mother Name"
          />

          <Detail
            icon="♧"
            label="Siblings"
            value="2"
          />

          <Detail
            icon="✦"
            label="Family Background"
            value="Educated & Respectable Family"
            wide
          />

        </div>

      </section>


      {/* ================= ACCOUNT ================= */}

      <section className="profile-section">

        <div className="section-title">

          <div className="section-icon">
            ⌁
          </div>

          <div>
            <p>ACCOUNT</p>
            <h2>Account Information</h2>
          </div>

        </div>


        <div className="account-card">

          <div>

            <span>
              Email Address
            </span>

            <strong>
              example@gmail.com
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


      {/* MOBILE EDIT */}
      <button className="mobile-edit-btn">
        ✎ Edit Profile
      </button>

    </main>
  );
};


/* ================= DETAIL COMPONENT ================= */

const Detail = ({ icon, label, value, wide }) => {

  return (

    <div className={`detail-card ${wide ? "wide" : ""}`}>

      <div className="detail-icon">
        {icon}
      </div>

      <div>

        <span>
          {label}
        </span>

        <strong>
          {value}
        </strong>

      </div>

    </div>

  );
};


export default MyProfile;