import { useState } from "react";


const MyProfile = () => {
  const [editMode, setEditMode] = useState(false);

  return (
    <>
    <main className="my-profile-page">

      {/* HEADER */}
      <section className="profile-page-header">
        <div>
          <p>YOUR PROFILE</p>

          <h1>
            My <span>Profile</span>
          </h1>

          <h4>
            Present yourself and let your story find its
            beautiful beginning.
          </h4>
        </div>

        <button
          className="edit-profile-btn"
          onClick={() => setEditMode(!editMode)}
        >
          {editMode ? "Save Profile" : "✎ Edit Profile"}
        </button>
      </section>


      {/* PROFILE HERO */}
      <section className="my-profile-card">

        <div className="profile-cover"></div>

        <div className="profile-main">

          <div className="profile-photo-wrapper">

            <img
              src="https://i.pravatar.cc/500?img=12"
              alt="Profile"
            />

            <button className="photo-edit">
              ✎
            </button>

          </div>


          <div className="profile-main-info">

            <div className="profile-name-row">

              <h2>Raj Sharma</h2>

              <span className="verified-badge">
                ✓ Verified
              </span>

            </div>

            <p className="profile-basic">
              26 Years • Bhopal, Madhya Pradesh
            </p>

            <p className="profile-profession">
              Software Developer
            </p>

          </div>


          <div className="profile-completion">

            <span>Profile Completion</span>

            <strong>85%</strong>

            <div className="completion-bar">
              <div></div>
            </div>

          </div>

        </div>

      </section>


      {/* CONTENT */}
      <section className="profile-content">


        {/* ABOUT */}
        <div className="profile-section">

          <div className="section-heading">
            <div>
              <p>ABOUT ME</p>
              <h2>My Story</h2>
            </div>

            {editMode && (
              <button>✎ Edit</button>
            )}
          </div>

          <p className="about-text">
            I am a simple, ambitious and family-oriented person.
            I enjoy travelling, exploring new places and spending
            quality time with my loved ones. Looking for someone
            who believes in companionship, respect and growing
            together.
          </p>

        </div>


        {/* BASIC DETAILS */}
        <div className="profile-section">

          <div className="section-heading">
            <div>
              <p>PERSONAL INFORMATION</p>
              <h2>Basic Details</h2>
            </div>

            {editMode && (
              <button>✎ Edit</button>
            )}
          </div>


          <div className="details-grid">

            <div className="detail-item">
              <span>Gender</span>
              <strong>Male</strong>
            </div>

            <div className="detail-item">
              <span>Age</span>
              <strong>26 Years</strong>
            </div>

            <div className="detail-item">
              <span>Height</span>
              <strong>5' 8"</strong>
            </div>

            <div className="detail-item">
              <span>Marital Status</span>
              <strong>Never Married</strong>
            </div>

            <div className="detail-item">
              <span>Religion</span>
              <strong>Hindu</strong>
            </div>

            <div className="detail-item">
              <span>Mother Tongue</span>
              <strong>Hindi</strong>
            </div>

          </div>

        </div>


        {/* EDUCATION & CAREER */}
        <div className="profile-section">

          <div className="section-heading">

            <div>
              <p>PROFESSIONAL LIFE</p>
              <h2>Education & Career</h2>
            </div>

            {editMode && (
              <button>✎ Edit</button>
            )}

          </div>


          <div className="career-grid">

            <div className="career-card">

              <span className="career-icon">◇</span>

              <div>
                <small>EDUCATION</small>

                <h3>
                  Bachelor of Computer Science
                </h3>

                <p>
                  State University
                </p>
              </div>

            </div>


            <div className="career-card">

              <span className="career-icon">⌘</span>

              <div>
                <small>PROFESSION</small>

                <h3>
                  Software Developer
                </h3>

                <p>
                  Information Technology
                </p>
              </div>

            </div>

          </div>

        </div>


        {/* FAMILY */}
        <div className="profile-section">

          <div className="section-heading">

            <div>
              <p>MY FAMILY</p>
              <h2>Family Details</h2>
            </div>

            {editMode && (
              <button>✎ Edit</button>
            )}

          </div>


          <div className="details-grid">

            <div className="detail-item">
              <span>Family Type</span>
              <strong>Middle Class</strong>
            </div>

            <div className="detail-item">
              <span>Father's Occupation</span>
              <strong>Business</strong>
            </div>

            <div className="detail-item">
              <span>Mother's Occupation</span>
              <strong>Homemaker</strong>
            </div>

            <div className="detail-item">
              <span>Siblings</span>
              <strong>1 Brother, 1 Sister</strong>
            </div>

          </div>

        </div>


        {/* LIFESTYLE */}
        <div className="profile-section">

          <div className="section-heading">

            <div>
              <p>LIFESTYLE</p>
              <h2>My Lifestyle</h2>
            </div>

            {editMode && (
              <button>✎ Edit</button>
            )}

          </div>


          <div className="lifestyle-list">

            <span>Vegetarian</span>
            <span>Non-Smoker</span>
            <span>Non-Drinker</span>
            <span>Travel Lover</span>
            <span>Music</span>
            <span>Fitness</span>

          </div>

        </div>


        {/* PREFERENCES */}
        <div className="profile-section preference-section">

          <div className="section-heading">

            <div>
              <p>WHAT I'M LOOKING FOR</p>
              <h2>Partner Preferences</h2>
            </div>

            {editMode && (
              <button>✎ Edit</button>
            )}

          </div>


          <div className="preference-grid">

            <div>
              <span>Age</span>
              <strong>23 - 28 Years</strong>
            </div>

            <div>
              <span>Location</span>
              <strong>India</strong>
            </div>

            <div>
              <span>Education</span>
              <strong>Graduate</strong>
            </div>

            <div>
              <span>Profession</span>
              <strong>Any</strong>
            </div>

          </div>

        </div>


      </section>

    </main>
    </>
  );
};

export default MyProfile;
