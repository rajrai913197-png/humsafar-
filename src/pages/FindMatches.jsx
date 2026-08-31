import { useState } from "react";

const profiles = [

  {

    id: 1,

    name: "Ananya Sharma",

    age: 26,

    profession: "Software Engineer",

    location: "Bhopal, Madhya Pradesh",

    education: "B.Tech",

    community: "Hindu",

    image: "https://i.pravatar.cc/700?img=47",

    verified: true,

  },

  {

    id: 2,

    name: "Riya Verma",

    age: 25,

    profession: "Architect",

    location: "Indore, Madhya Pradesh",

    education: "B.Arch",

    community: "Hindu",

    image: "https://i.pravatar.cc/700?img=44",

    verified: true,

  },

  {

    id: 3,

    name: "Kavya Patel",

    age: 27,

    profession: "Doctor",

    location: "Mumbai, Maharashtra",

    education: "MBBS",

    community: "Hindu",

    image: "https://i.pravatar.cc/700?img=49",

    verified: true,

  },

  {

    id: 4,

    name: "Sneha Mehta",

    age: 24,

    profession: "Marketing Manager",

    location: "Delhi, India",

    education: "MBA",

    community: "Hindu",

    image: "https://i.pravatar.cc/700?img=45",

    verified: true,

  },

  {

    id: 5,

    name: "Pooja Singh",

    age: 28,

    profession: "HR Manager",

    location: "Pune, Maharashtra",

    education: "MBA",

    community: "Hindu",

    image: "https://i.pravatar.cc/700?img=32",

    verified: true,

  },

  {

    id: 6,

    name: "Meera Joshi",

    age: 26,

    profession: "Teacher",

    location: "Jaipur, Rajasthan",

    education: "M.Ed",

    community: "Hindu",

    image: "https://i.pravatar.cc/700?img=25",

    verified: false,

  },

];
function FindMatches() {
   const [filterOpen, setFilterOpen] = useState(false);
 return(
  <>

    <main className="find-page">

      {/* PAGE HEADER */}

      <section className="find-header">

        <div>

          <p className="find-label">DISCOVER CONNECTIONS</p>

          <h1>

            Find Your <span>Match</span>

          </h1>

          <p className="find-subtitle">

            Discover meaningful profiles who could be

            your perfect life partner.

          </p>

        </div>

      </section>

      {/* TOOLBAR */}

      <section className="find-toolbar">

        <div className="results-count">

          <strong>2,458</strong> matches found

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

      {/* PROFILE GRID */}

      <section className="profile-grid">

        {profiles.map((profile) => (

          <article className="match-card" key={profile.id}>

            {/* IMAGE */}

            <div className="match-image">

              <img

                src={profile.image}

                alt={profile.name}

              />

              {profile.verified && (

                <span className="verified">

                  ✓ Verified

                </span>

              )}

              <button className="heart-button">

                ♡

              </button>

            </div>

            {/* DETAILS */}

            <div className="match-details">

              <div className="name-line">

                <h2>

                  {profile.name}, {profile.age}

                </h2>

                <span className="online"></span>

              </div>

              <p className="profession">

                {profile.profession}

              </p>

              <p className="location">

                ♧ &nbsp;{profile.location}

              </p>

              <div className="short-info">

                <span>{profile.education}</span>

                <span>{profile.community}</span>

              </div>

              <div className="card-bottom">

                <span className="profile-status">

                  {profile.verified

                    ? "Profile Verified"

                    : "New Profile"}

                </span>

                <button className="view-profile">

                  View Profile →

                </button>

              </div>

            </div>

          </article>

        ))}

      </section>

      {/* PAGINATION */}

      <div className="pagination">

        <button>←</button>

        <button className="page-active">1</button>

        <button>2</button>

        <button>3</button>

        <button>4</button>

        <button>5</button>

        <button>→</button>

      </div>

      {/* FILTER DRAWER */}

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
 )
}

export default FindMatches

