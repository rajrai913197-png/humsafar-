import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const API = "https://sapta-vachan-backend.onrender.com";

function FindMatches() {
  const token = localStorage.getItem("token");
  const decoded = token ? jwtDecode(token) : null;

  const navigate = useNavigate();

  const [profiles, setProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);

  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);

  const [interestSent, setInterestSent] = useState({});
  const [interestSuccess, setInterestSuccess] = useState(false);

  // Search
  const [search, setSearch] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const profilesPerPage = 10;

  // Filter state
  const [filters, setFilters] = useState({
    minAge: "",
    maxAge: "",
    gender: "",
    city: "",
    education: "",
    profession: "",
    religion: "",
  });

  // Temporary filter state inside drawer
  const [tempFilters, setTempFilters] = useState({
    minAge: "",
    maxAge: "",
    gender: "",
    city: "",
    education: "",
    profession: "",
    religion: "",
  });

  // =========================
  // GET USERS
  // =========================

  const GetUser = () => {
    axios
      .get(`${API}/getUser`)
      .then((res) => {
        const myId = decoded?.userId;

        console.log("My ID:", myId);

        // Current logged-in user ko remove karna
        const otherProfiles = res.data.filter(
          (profile) => profile._id !== myId
        );

        // Original profiles
        setProfiles(otherProfiles);

        // Initially all profiles show
        setFilteredProfiles(otherProfiles);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    GetUser();
  }, []);

  // =========================
  // SEARCH + FILTER
  // =========================

  useEffect(() => {
    let result = [...profiles];

    // =========================
    // SEARCH
    // =========================

    if (search.trim()) {
      const searchValue = search.toLowerCase();

      result = result.filter((profile) => {
        return (
          profile.name
            ?.toLowerCase()
            .includes(searchValue) ||
          profile.city
            ?.toLowerCase()
            .includes(searchValue) ||
          profile.education
            ?.toLowerCase()
            .includes(searchValue) ||
          profile.profession
            ?.toLowerCase()
            .includes(searchValue) ||
          profile.religion
            ?.toLowerCase()
            .includes(searchValue) ||
          profile.gender
            ?.toLowerCase()
            .includes(searchValue)
        );
      });
    }

    // =========================
    // MINIMUM AGE
    // =========================

    if (filters.minAge) {
      result = result.filter(
        (profile) =>
          Number(profile.age) >=
          Number(filters.minAge)
      );
    }

    // =========================
    // MAXIMUM AGE
    // =========================

    if (filters.maxAge) {
      result = result.filter(
        (profile) =>
          Number(profile.age) <=
          Number(filters.maxAge)
      );
    }

    // =========================
    // GENDER
    // =========================

    if (filters.gender) {
      result = result.filter(
        (profile) =>
          profile.gender?.toLowerCase() ===
          filters.gender.toLowerCase()
      );
    }

    // =========================
    // CITY
    // =========================

    if (filters.city) {
      result = result.filter(
        (profile) =>
          profile.city?.toLowerCase() ===
          filters.city.toLowerCase()
      );
    }

    // =========================
    // EDUCATION
    // =========================

    if (filters.education) {
      result = result.filter(
        (profile) =>
          profile.education?.toLowerCase() ===
          filters.education.toLowerCase()
      );
    }

    // =========================
    // PROFESSION
    // =========================

    if (filters.profession) {
      result = result.filter(
        (profile) =>
          profile.profession?.toLowerCase() ===
          filters.profession.toLowerCase()
      );
    }

    // =========================
    // RELIGION
    // =========================

    if (filters.religion) {
      result = result.filter(
        (profile) =>
          profile.religion?.toLowerCase() ===
          filters.religion.toLowerCase()
      );
    }

    setFilteredProfiles(result);
  }, [profiles, filters, search]);

  // =========================
  // RESET PAGE WHEN SEARCH
  // OR FILTER CHANGES
  // =========================

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, search]);

  // =========================
  // PAGINATION
  // =========================

  const indexOfLastProfile =
    currentPage * profilesPerPage;

  const indexOfFirstProfile =
    indexOfLastProfile - profilesPerPage;

  const currentProfiles =
    filteredProfiles.slice(
      indexOfFirstProfile,
      indexOfLastProfile
    );

  const totalPages = Math.ceil(
    filteredProfiles.length /
      profilesPerPage
  );

  // =========================
  // INTEREST
  // =========================

  const handleInterest = (profile) => {
    if (interestSent[profile._id]) {
      return;
    }

    setSelectedProfile(profile);
    setInterestSuccess(false);
  };

  const sendInterest = () => {
    if (
      !decoded?.userId ||
      !selectedProfile?._id
    ) {
      return;
    }

    axios
      .post(`${API}/sendInterest`, {
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

  // =========================
  // FILTER FUNCTIONS
  // =========================

  const handleTempFilterChange = (
    field,
    value
  ) => {
    setTempFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const applyFilters = () => {
    setFilters(tempFilters);
    setFilterOpen(false);
  };

  const resetFilters = () => {
    const emptyFilters = {
      minAge: "",
      maxAge: "",
      gender: "",
      city: "",
      education: "",
      profession: "",
      religion: "",
    };

    setTempFilters(emptyFilters);
    setFilters(emptyFilters);
    setCurrentPage(1);
  };

  // =========================
  // UNIQUE VALUES
  // =========================

  const cities = [
    ...new Set(
      profiles
        .map((profile) => profile.city)
        .filter(Boolean)
    ),
  ];

  const educations = [
    ...new Set(
      profiles
        .map((profile) => profile.education)
        .filter(Boolean)
    ),
  ];

  const professions = [
    ...new Set(
      profiles
        .map((profile) => profile.profession)
        .filter(Boolean)
    ),
  ];

  const religions = [
    ...new Set(
      profiles
        .map((profile) => profile.religion)
        .filter(Boolean)
    ),
  ];

  return (
    <main className="find-page">

      {/* ================= HEADER ================= */}

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

      {/* ================= TOOLBAR ================= */}

      <section className="find-toolbar">

        <div className="results-count">
          <strong>
            {filteredProfiles.length}
          </strong>{" "}
          matches found
        </div>

        <div className="toolbar-actions">

          {/* SEARCH */}

          <div className="search-box">

            <span>⌕</span>

            <input
              type="text"
              placeholder="Search profiles..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

          {/* FILTER BUTTON */}

          <button
            className="filter-button"
            onClick={() =>
              setFilterOpen(true)
            }
          >
            ☷ &nbsp; Filters
          </button>

        </div>

      </section>

      {/* ================= PROFILE GRID ================= */}

      <section className="profile-grid">

        {currentProfiles.length > 0 ? (

          currentProfiles.map((profile) => (

            <article
              className="match-card"
              key={profile._id}
            >

              {/* IMAGE */}

              <div className="match-image">

                <img
                  src={
                    profile.image
                      ? `${API}/upload/${profile.image}`
                      : "https://i.pravatar.cc/500?img=47"
                  }
                  alt={profile.name}
                />

                {profile.verified && (
                  <span className="verified">
                    ✓ Verified
                  </span>
                )}

                {/* INTEREST */}

                <button
                  className="heart-button"
                  onClick={() => {
                    if (!token) {
                      navigate("/login");
                    } else {
                      handleInterest(profile);
                    }
                  }}
                  disabled={
                    interestSent[profile._id]
                  }
                >
                  {interestSent[profile._id]
                    ? "♥"
                    : "♡"}
                </button>

              </div>

              {/* DETAILS */}

              <div className="match-details">

                <div className="name-line">

                  <h2>
                    {profile.name}

                    {profile.age
                      ? `, ${profile.age}`
                      : ""}
                  </h2>

                  <span className="online"></span>

                </div>

                <p className="profession">
                  {profile.profession ||
                    "Profession not added"}
                </p>

                <p className="location">
                  ♧ &nbsp;

                  {profile.city ||
                    profile.location ||
                    "Location not added"}
                </p>

                <div className="short-info">

                  <span>
                    {profile.education ||
                      "Education"}
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

          ))

        ) : (

          <div className="no-results">

            <h2>
              No Profiles Found
            </h2>

            <p>
              Try changing your search or filters.
            </p>

          </div>

        )}

      </section>

      {/* ================= PAGINATION ================= */}

      {totalPages > 1 && (

        <div className="pagination">

          {/* PREVIOUS */}

          <button
            disabled={currentPage === 1}
            onClick={() =>
              setCurrentPage(
                (prev) => prev - 1
              )
            }
          >
            ← Previous
          </button>

          {/* PAGE NUMBERS */}

          {Array.from(
            { length: totalPages },
            (_, index) => (

              <button
                key={index + 1}
                className={
                  currentPage ===
                  index + 1
                    ? "active-page"
                    : ""
                }
                onClick={() =>
                  setCurrentPage(
                    index + 1
                  )
                }
              >
                {index + 1}
              </button>

            )
          )}

          {/* NEXT */}

          <button
            disabled={
              currentPage === totalPages
            }
            onClick={() =>
              setCurrentPage(
                (prev) => prev + 1
              )
            }
          >
            Next →
          </button>

        </div>

      )}

      {/* ================= INTEREST POPUP ================= */}

      {selectedProfile && (

        <div
          className="interest-backdrop"
          onClick={closeInterestPopup}
        >

          <div
            className="interest-popup"
            onClick={(e) =>
              e.stopPropagation()
            }
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

      {/* ================= FILTER DRAWER ================= */}

      {filterOpen && (

        <div
          className="filter-backdrop"
          onClick={() =>
            setFilterOpen(false)
          }
        >

          <aside
            className="filter-drawer"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* DRAWER HEADER */}

            <div className="drawer-header">

              <div>

                <p>
                  REFINE SEARCH
                </p>

                <h2>
                  Filters
                </h2>

              </div>

              <button
                onClick={() =>
                  setFilterOpen(false)
                }
              >
                ×
              </button>

            </div>

            {/* FILTER CONTENT */}

            <div className="filter-content">

              {/* AGE */}

              <label>
                Age Range
              </label>

              <div className="age-inputs">

                <input
                  type="number"
                  placeholder="Min"
                  value={
                    tempFilters.minAge
                  }
                  onChange={(e) =>
                    handleTempFilterChange(
                      "minAge",
                      e.target.value
                    )
                  }
                />

                <span>
                  to
                </span>

                <input
                  type="number"
                  placeholder="Max"
                  value={
                    tempFilters.maxAge
                  }
                  onChange={(e) =>
                    handleTempFilterChange(
                      "maxAge",
                      e.target.value
                    )
                  }
                />

              </div>

              {/* GENDER */}

              <label>
                Gender
              </label>

              <select
                value={
                  tempFilters.gender
                }
                onChange={(e) =>
                  handleTempFilterChange(
                    "gender",
                    e.target.value
                  )
                }
              >

                <option value="">
                  Any Gender
                </option>

                <option value="Male">
                  Male
                </option>

                <option value="Female">
                  Female
                </option>

              </select>

              {/* CITY */}

              <label>
                City
              </label>

              <select
                value={
                  tempFilters.city
                }
                onChange={(e) =>
                  handleTempFilterChange(
                    "city",
                    e.target.value
                  )
                }
              >

                <option value="">
                  Any City
                </option>

                {cities.map((city) => (

                  <option
                    key={city}
                    value={city}
                  >
                    {city}
                  </option>

                ))}

              </select>

              {/* EDUCATION */}

              <label>
                Education
              </label>

              <select
                value={
                  tempFilters.education
                }
                onChange={(e) =>
                  handleTempFilterChange(
                    "education",
                    e.target.value
                  )
                }
              >

                <option value="">
                  Any Education
                </option>

                {educations.map(
                  (education) => (

                    <option
                      key={education}
                      value={education}
                    >
                      {education}
                    </option>

                  )
                )}

              </select>

              {/* PROFESSION */}

              <label>
                Profession
              </label>

              <select
                value={
                  tempFilters.profession
                }
                onChange={(e) =>
                  handleTempFilterChange(
                    "profession",
                    e.target.value
                  )
                }
              >

                <option value="">
                  Any Profession
                </option>

                {professions.map(
                  (profession) => (

                    <option
                      key={profession}
                      value={profession}
                    >
                      {profession}
                    </option>

                  )
                )}

              </select>

              {/* RELIGION */}

              <label>
                Religion / Community
              </label>

              <select
                value={
                  tempFilters.religion
                }
                onChange={(e) =>
                  handleTempFilterChange(
                    "religion",
                    e.target.value
                  )
                }
              >

                <option value="">
                  Any Religion
                </option>

                {religions.map(
                  (religion) => (

                    <option
                      key={religion}
                      value={religion}
                    >
                      {religion}
                    </option>

                  )
                )}

              </select>

            </div>

            {/* DRAWER FOOTER */}

            <div className="drawer-footer">

              <button
                className="reset-button"
                onClick={resetFilters}
              >
                Reset
              </button>

              <button
                className="apply-button"
                onClick={applyFilters}
              >
                Apply Filters
              </button>

            </div>

          </aside>

        </div>

      )}

    </main>
  );
}

export default FindMatches;