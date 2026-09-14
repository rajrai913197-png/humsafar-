import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function FindMatches() {
  const token = localStorage.getItem("token");
  const decoded = token ? jwtDecode(token) : null;

  const navigate = useNavigate();

  const [profiles, setProfiles] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [interestSent, setInterestSent] = useState({});
  const [interestSuccess, setInterestSuccess] = useState(false);

  const GetUser = () => {
    axios
      .get("http://localhost:3300/getUser")
      .then((res) => {
        const myId = decoded?.userId;

        console.log("My ID:", myId);

        const otherProfiles = res.data.filter(
          (profile) => profile._id !== myId
        );

        setProfiles(otherProfiles);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    GetUser();
  }, []);

  const handleInterest = (profile) => {
    if (interestSent[profile._id]) {
      return;
    }

    setSelectedProfile(profile);
    setInterestSuccess(false);
  };

  const sendInterest = () => {
    if (!decoded?.userId || !selectedProfile?._id) {
      return;
    }

    axios
      .post("http://localhost:3300/sendInterest", {
        sender: decoded.userId,
        receiver: selectedProfile._id,
      })
      .then((res) => {
        console.log(res.data);

        setInterestSent((prev) => ({
          ...prev,
          [selectedProfile._id]: true,
        }));

        setInterestSuccess(true);
      })
      .catch((err) => {
        console.log(err);

        if (
          err.response?.data?.message ===
          "Interest already sent"
        ) {
          setInterestSent((prev) => ({
            ...prev,
            [selectedProfile._id]: true,
          }));

          setInterestSuccess(true);
        }
      });
  };

  const closeInterestPopup = () => {
    setSelectedProfile(null);
    setInterestSuccess(false);
  };

  return (
    <>
      <main className="find-page">

        <section className="find-header">

          <div>

            <p className="find-label">
              DISCOVER CONNECTIONS
            </p>

            <h1>
              Find Your <span>Match</span>
            </h1>

            <p className="find-subtitle">
              Discover meaningful profiles who could be
              your perfect life partner.
            </p>

          </div>

        </section>


        <section className="find-toolbar">

          <div className="results-count">

            <strong>{profiles.length}</strong> matches found

          </div>

          <div className="toolbar-actions">

            <div className="search-box">

              <span>⌕</span>

              <input
                type="text"
                placeholder="Search profiles..."
              />

            </div>

            <button
              className="filter-button"
              onClick={() => setFilterOpen(true)}
            >
              ☷ &nbsp; Filters
            </button>

            <select className="sort-select">

              <option>Recommended</option>

              <option>Recently Active</option>

              <option>Newest Profiles</option>

              <option>Age: Low to High</option>

              <option>Age: High to Low</option>

            </select>

          </div>

        </section>


        <section className="profile-grid">

          {profiles.map((profile) => (

            <article
              className="match-card"
              key={profile._id}
            >

              <div className="match-image">

                <img
                  src={
                    profile.image
                      ? `http://localhost:3300/upload/${profile.image}`
                      : "https://i.pravatar.cc/500?img=47"
                  }
                  alt={profile.name}
                />

                {profile.verified && (

                  <span className="verified">
                    ✓ Verified
                  </span>

                )}

                <button
                  className="heart-button"
                  onClick={()=> {if (!token) {
                     navigate("/login")
                  }else{
                    handleInterest(profile)
                    
                  }
                  
                }}
                 
                  
                  disabled={interestSent[profile._id]}
                >
                  {interestSent[profile._id] ? "♥" : "♡"}
                </button>

              </div>


              <div className="match-details">

                <div className="name-line">

                  <h2>
                    {profile.name}, {profile.age}
                  </h2>

                  <span className="online"></span>

                </div>


                <p className="profession">
                  {profile.profession || "Profession not added"}
                </p>


                <p className="location">
                  ♧ &nbsp;
                  {profile.city ||
                    profile.location ||
                    "Location not added"}
                </p>


                <div className="short-info">

                  <span>
                    {profile.education || "Education"}
                  </span>

                  <span>
                    {profile.community ||
                      profile.religion ||
                      "Community"}
                  </span>

                </div>


                <div className="card-bottom">

                  <span className="profile-status">

                    {profile.verified
                      ? "Profile Verified"
                      : "New Profile"}

                  </span>


                  <button
                    className="view-profile"
                    onClick={() =>
                      navigate(
                        `/profiledetail/${profile._id}`
                      )
                    }
                  >
                    View Profile →
                  </button>

                </div>

              </div>

            </article>

          ))}

        </section>


        <div className="pagination">

          <button>←</button>

          <button className="page-active">
            1
          </button>

          <button>2</button>

          <button>3</button>

          <button>4</button>

          <button>5</button>

          <button>→</button>

        </div>


        {selectedProfile && (

          <div
            className="interest-backdrop"
            onClick={closeInterestPopup}
          >

            <div
              className="interest-popup"
              onClick={(e) => e.stopPropagation()}
            >

              <button
                className="interest-close"
                onClick={closeInterestPopup}
              >
                ×
              </button>


              {!interestSuccess ? (

                <>
                  <div className="interest-popup-icon">
                    ♡
                  </div>

                  <h2>
                    Send Interest?
                  </h2>

                  <p>
                    Would you like to send an interest to
                  </p>

                  <h3>
                    {selectedProfile.name}
                  </h3>

                  <p className="interest-popup-text">
                    Show your interest and start a meaningful
                    connection.
                  </p>

                  <div className="interest-popup-actions">

                    <button
                      className="cancel-interest"
                      onClick={closeInterestPopup}
                    >
                      Cancel
                    </button>

                    <button
                      className="send-interest"
                      onClick={sendInterest}
                    >
                      Send Interest ♥
                    </button>

                  </div>
                </>

              ) : (

                <>
                  <div className="interest-success-icon">
                    ✓
                  </div>

                  <h2>
                    Interest Sent!
                  </h2>

                  <p>
                    Your interest has been sent successfully
                    to
                  </p>

                  <h3>
                    {selectedProfile.name}
                  </h3>

                  <p className="interest-popup-text">
                    We'll let you know if they accept your
                    interest.
                  </p>

                  <button
                    className="send-interest"
                    onClick={closeInterestPopup}
                  >
                    Done
                  </button>
                </>

              )}

            </div>

          </div>

        )}


        {filterOpen && (

          <div
            className="filter-backdrop"
            onClick={() => setFilterOpen(false)}
          >

            <aside
              className="filter-drawer"
              onClick={(e) => e.stopPropagation()}
            >

              <div className="drawer-header">

                <div>

                  <p>REFINE SEARCH</p>

                  <h2>Filters</h2>

                </div>

                <button
                  onClick={() => setFilterOpen(false)}
                >
                  ×
                </button>

              </div>


              <div className="filter-content">

                <label>Age Range</label>

                <div className="age-inputs">

                  <input placeholder="21" />

                  <span>to</span>

                  <input placeholder="30" />

                </div>


                <label>Height</label>

                <select>

                  <option>Select Height</option>

                  <option>5'0" - 5'4"</option>

                  <option>5'5" - 5'8"</option>

                  <option>5'9" - 6'0"</option>

                  <option>6'0"+</option>

                </select>


                <label>Religion</label>

                <select>

                  <option>Any Religion</option>

                  <option>Hindu</option>

                  <option>Muslim</option>

                  <option>Sikh</option>

                  <option>Christian</option>

                </select>


                <label>Community</label>

                <select>

                  <option>Any Community</option>

                  <option>General</option>

                  <option>OBC</option>

                  <option>SC</option>

                  <option>ST</option>

                </select>


                <label>Education</label>

                <select>

                  <option>Any Education</option>

                  <option>Graduate</option>

                  <option>Post Graduate</option>

                  <option>Doctorate</option>

                </select>


                <label>Profession</label>

                <select>

                  <option>Any Profession</option>

                  <option>Engineer</option>

                  <option>Doctor</option>

                  <option>Teacher</option>

                  <option>Business</option>

                </select>


                <label>Marital Status</label>

                <select>

                  <option>Never Married</option>

                  <option>Divorced</option>

                  <option>Widowed</option>

                </select>


                <div className="check-options">

                  <label className="check-label">

                    <input type="checkbox" />

                    Verified Profiles Only

                  </label>


                  <label className="check-label">

                    <input type="checkbox" />

                    Profiles With Photo

                  </label>

                </div>

              </div>


              <div className="drawer-footer">

                <button className="reset-button">
                  Reset
                </button>

                <button className="apply-button">
                  Apply Filters
                </button>

              </div>

            </aside>

          </div>

        )}

      </main>
    </>
  );
}

export default FindMatches;