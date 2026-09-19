import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function Home() {
  const API = "https://sapta-vachan-backend.onrender.com";

  const [profiles, setProfiles] = useState([]);
  const [age, setAge] = useState([]);
  const [city, setCity] = useState([]);
  const [gender, setGender] = useState([]);
  const [community, setCommunity] = useState([]);

  const [profileFilter, setProfileFilter] = useState({
    age: [],
    gender: [],
    religion: [],
    city: [],
  });

  // Interest states
  const [interestSent, setInterestSent] = useState({});
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [interestSuccess, setInterestSuccess] = useState(false);

  const navigate = useNavigate();

  // =========================
  // TOKEN
  // =========================

  const token = localStorage.getItem("token");

  let decoded = null;

  try {
    decoded = token ? jwtDecode(token) : null;
  } catch (error) {
    console.log("JWT DECODE ERROR:", error);
  }

  const myId = decoded?.userId?.toString();

  console.log("My ID:", myId);

  // =========================
  // GET AGE
  // =========================

  const getAge = () => {
    axios
      .get(`${API}/ageGet`)
      .then((res) => {
        setAge(res.data);
      })
      .catch((err) => {
        console.log("AGE ERROR:", err);
      });
  };

  // =========================
  // GET CITY
  // =========================

  const getCity = () => {
    axios
      .get(`${API}/getcity`)
      .then((res) => {
        setCity(res.data);
      })
      .catch((err) => {
        console.log("CITY ERROR:", err);
      });
  };

  // =========================
  // GET GENDER
  // =========================

  const GetGender = () => {
    axios
      .get(`${API}/getgender`)
      .then((res) => {
        setGender(res.data);
      })
      .catch((err) => {
        console.log("GENDER ERROR:", err);
      });
  };

  // =========================
  // GET COMMUNITY
  // =========================

  const Getcommunity = () => {
    axios
      .get(`${API}/community`)
      .then((res) => {
        setCommunity(res.data);
      })
      .catch((err) => {
        console.log("COMMUNITY ERROR:", err);
      });
  };

  // =========================
  // GET USERS / FILTER USERS
  // =========================

  const GetUser = () => {
    const hasFilter =
      profileFilter.age.length > 0 ||
      profileFilter.gender.length > 0 ||
      profileFilter.religion.length > 0 ||
      profileFilter.city.length > 0;

    if (hasFilter) {
      axios
        .get(`${API}/filterUser`, {
          params: profileFilter,
          paramsSerializer: {
            indexes: null,
          },
        })
        .then((res) => {
          console.log("FILTER USERS:", res.data);

          const otherProfiles = res.data.filter(
            (profile) =>
              profile._id?.toString() !== myId
          );

          console.log(
            "FILTERED OTHER PROFILES:",
            otherProfiles
          );

          otherProfiles.forEach((profile) => {
            console.log(
              "PROFILE:",
              profile.name,
              "IMAGE:",
              profile.image
            );
          });

          setProfiles(otherProfiles);
        })
        .catch((err) => {
          console.log("FILTER USER ERROR:", err);
        });
    } else {
      axios
        .get(`${API}/getUser`)
        .then((res) => {
          console.log("ALL USERS:", res.data);

          const otherProfiles = res.data.filter(
            (profile) =>
              profile._id?.toString() !== myId
          );

          console.log(
            "OTHER PROFILES:",
            otherProfiles
          );

          otherProfiles.forEach((profile) => {
            console.log(
              "PROFILE:",
              profile.name,
              "IMAGE:",
              profile.image
            );
          });

          setProfiles(otherProfiles);
        })
        .catch((err) => {
          console.log("GET USERS ERROR:", err);
        });
    }
  };

  // =========================
  // FILTER HANDLERS
  // =========================

  const filterHandlerAge = (e) => {
    const filterAgevalue = Array.from(
      e.target.selectedOptions
    ).map((item) => item.value);

    setProfileFilter({
      ...profileFilter,
      age: filterAgevalue,
    });
  };

  const filterHandlerCity = (e) => {
    const filterCityvalue = Array.from(
      e.target.selectedOptions
    ).map((item) => item.value);

    setProfileFilter({
      ...profileFilter,
      city: filterCityvalue,
    });
  };

  const filterHandlerGender = (e) => {
    const filterGendervalue = Array.from(
      e.target.selectedOptions
    ).map((item) => item.value);

    setProfileFilter({
      ...profileFilter,
      gender: filterGendervalue,
    });
  };

  const filterHandlerCommunity = (e) => {
    const filtercommunityvalue = Array.from(
      e.target.selectedOptions
    ).map((item) => item.value);

    setProfileFilter({
      ...profileFilter,
      religion: filtercommunityvalue,
    });
  };

  // =========================
  // INTEREST
  // =========================

  const handleInterest = (profile) => {
    if (interestSent[profile._id]) {
      return;
    }

    if (!token) {
      navigate("/login");
      return;
    }

    setSelectedProfile(profile);
    setInterestSuccess(false);
  };

  // =========================
  // SEND INTEREST
  // =========================

  const sendInterest = () => {
    if (!decoded?.userId || !selectedProfile?._id) {
      return;
    }

    axios
      .post(`${API}/sendInterest`, {
        sender: decoded.userId,
        receiver: selectedProfile._id,
      })
      .then((res) => {
        console.log("INTEREST RESPONSE:", res.data);

        setInterestSent((prev) => ({
          ...prev,
          [selectedProfile._id]: true,
        }));

        setInterestSuccess(true);
      })
      .catch((err) => {
        console.log("INTEREST ERROR:", err);

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

  // =========================
  // CLOSE POPUP
  // =========================

  const closeInterestPopup = () => {
    setSelectedProfile(null);
    setInterestSuccess(false);
  };

  // =========================
  // OPTIONS
  // =========================

  const ageCall = age.map((e) => {
    return (
      <option key={e} value={e}>
        {e}
      </option>
    );
  });

  const myCity = city.map((e) => {
    return (
      <option key={e} value={e}>
        {e}
      </option>
    );
  });

  const myGender = gender.map((e) => {
    return (
      <option key={e} value={e}>
        {e}
      </option>
    );
  });

  const myCommunity = community.map((e) => {
    return (
      <option key={e} value={e}>
        {e}
      </option>
    );
  });

  // =========================
  // USE EFFECT
  // =========================

  useEffect(() => {
    getAge();
    GetUser();
    getCity();
    GetGender();
    Getcommunity();
  }, []);

  return (
    <>
      {/* =========================
          HERO
      ========================= */}

      <section className="hero-slider">
        <img
          src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2000&q=85"
          alt="Wedding couple"
          className="hero-img"
        />

        <div className="hero-overlay"></div>

        <div className="hero-content">
          <p className="hero-tag">
            FIND YOUR LIFE PARTNER
          </p>

          <h1>
            Find Your
            <br />
            <span>Forever.</span>
          </h1>

          <p className="hero-text">
            Discover meaningful connections with someone
            who shares your values, dreams and vision for
            life.
          </p>

          <button
            className="hero-btn"
            onClick={() => navigate("/findmatches")}
          >
            Find Your Match <span>→</span>
          </button>
        </div>
      </section>

      {/* =========================
          FILTER
      ========================= */}

      <section className="match-filter">
        <div className="filter-heading">
          <span>FIND YOUR MATCH</span>

          <h2>
            Find Your <em>Perfect Match</em>
          </h2>

          <p>
            Search through profiles based on your
            preferences.
          </p>
        </div>

        <div className="filter-box">
          <div className="filter-field">
            <label>Looking For</label>

            <select
              multiple
              onChange={filterHandlerGender}
            >
              {myGender}
            </select>
          </div>

          <div className="filter-field">
            <label>Age To</label>

            <select
              multiple
              onChange={filterHandlerAge}
            >
              {ageCall}
            </select>
          </div>

          <div className="filter-field">
            <label>Location</label>

            <select
              multiple
              onChange={filterHandlerCity}
            >
              <option value="">Any Location</option>

              {myCity}
            </select>
          </div>

          <div className="filter-field">
            <label>Community</label>

            <select
              multiple
              onChange={filterHandlerCommunity}
            >
              {myCommunity}
            </select>
          </div>

          <button
            className="filter-btn"
            onClick={GetUser}
          >
            Search Matches →
          </button>
        </div>
      </section>

      {/* =========================
          PROFILES
      ========================= */}

      <section className="profiles-section">
        <div className="profiles-heading">
          <p>MEET YOUR POTENTIAL MATCH</p>

          <h2>
            People Looking For <span>Forever</span>
          </h2>

          <div className="heading-line"></div>

          <h4>
            Discover genuine profiles looking for meaningful
            relationships and lifelong companionship.
          </h4>
        </div>

        <div className="profiles-grid">
          {profiles.map((profile) => (
            <div
              className="profile-card"
              key={profile._id}
            >
              {/* =========================
                  IMAGE
              ========================= */}

              <div className="profile-image">
                {profile.image ? (
                  <img
                    src={profile.image}
                    alt={profile.name || "Profile"}
                    onLoad={() => {
                      console.log(
                        "HOME REAL IMAGE LOADED:",
                        profile.name,
                        profile.image
                      );
                    }}
                    onError={(e) => {
                      console.log(
                        "HOME REAL IMAGE FAILED:",
                        profile.name,
                        profile.image
                      );

                      e.currentTarget.style.display =
                        "none";
                    }}
                  />
                ) : (
                  <div className="no-profile-image">
                    No Image
                  </div>
                )}

                <div className="verified-badge">
                  ✓ Verified
                </div>

                {/* HEART BUTTON */}

                <button
                  className="like-button"
                  onClick={() =>
                    handleInterest(profile)
                  }
                  disabled={
                    interestSent[profile._id]
                  }
                >
                  {interestSent[profile._id]
                    ? "♥"
                    : "♡"}
                </button>
              </div>

              {/* =========================
                  DETAILS
              ========================= */}

              <div className="profile-details">
                <div className="profile-name-row">
                  <h3>
                    {profile.name}, {profile.age}
                  </h3>

                  <span className="online-dot"></span>
                </div>

                <p className="profession">
                  {profile.profession ||
                    "Profession not added"}
                </p>

                <p className="location">
                  ♧ {profile.city ||
                    "Location not added"}
                </p>

                <div className="profile-divider"></div>

                <div className="profile-bottom">
                  <span>
                    {profile.verified
                      ? "Profile Verified"
                      : "New Profile"}
                  </span>

                  <button
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
            </div>
          ))}
        </div>

        {/* =========================
            EXPLORE
        ========================= */}

        <button
          className="all-profiles-btn"
          onClick={() => navigate("/findmatches")}
        >
          Explore All Profiles →
        </button>
      </section>

      {/* =========================
          INTEREST POPUP
      ========================= */}

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

                <h2>Send Interest?</h2>

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

                <h2>Interest Sent!</h2>

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
    </>
  );
}

export default Home;