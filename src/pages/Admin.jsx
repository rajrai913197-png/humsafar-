import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

function AdminPanel() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  let id = null;

  try {
    if (token) {
      const decoded = jwtDecode(token);
      id = decoded?.userId;
    }
  } catch (error) {
    console.log("TOKEN ERROR:", error);
    localStorage.removeItem("token");
    navigate("/");
  }

  const API = "https://sapta-vachan-backend.onrender.com";

  const [users, setUsers] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // =====================================
  // GET USERS
  // =====================================

  const getAllUsers = async () => {
    axios
      .get(`${API}/getalluser`)
      .then((res) => {
        const result = res.data.filter(
          (user) => user._id !== id
        );

        setUsers(result);
      })
      .catch((err) => {
        console.log("GET USERS ERROR:", err);
      });
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  // =====================================
  // COUNTS
  // =====================================

  const totalUsers = users.length;

  const maleUsers = users.filter(
    (user) => user.gender === "Male"
  ).length;

  const femaleUsers = users.filter(
    (user) => user.gender === "Female"
  ).length;

  const completeUsers = users.filter(
    (user) => user.status === "Complete"
  ).length;

  const incompleteUsers = users.filter(
    (user) => user.status === "Incomplete"
  ).length;

  // =====================================
  // FILTER
  // =====================================

  const filterUsers = (filter) => {
    setActiveFilter(filter);
    setSidebarOpen(false);
  };

  // =====================================
  // SEARCH + FILTER
  // =====================================

  const filteredUsers = users.filter((user) => {
    const name = user.name || "";
    const email = user.email || "";
    const city = user.city || "";

    const searchValue = search.toLowerCase();

    const searchMatch =
      name.toLowerCase().includes(searchValue) ||
      email.toLowerCase().includes(searchValue) ||
      city.toLowerCase().includes(searchValue);

    let filterMatch = true;

    if (activeFilter === "Male") {
      filterMatch = user.gender === "Male";
    }

    if (activeFilter === "Female") {
      filterMatch = user.gender === "Female";
    }

    if (activeFilter === "Complete") {
      filterMatch = user.status === "Complete";
    }

    if (activeFilter === "Incomplete") {
      filterMatch = user.status === "Incomplete";
    }

    return searchMatch && filterMatch;
  });

  // =====================================
  // DELETE
  // =====================================

  const deleteUser = async (userId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to remove this user?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `${API}/deleteUser/${userId}`
      );

      setUsers((prevUsers) =>
        prevUsers.filter(
          (user) => user._id !== userId
        )
      );

      alert("User deleted successfully");
    } catch (error) {
      console.log(
        "DELETE USER ERROR:",
        error
      );
    }
  };

  // =====================================
  // VIEW PROFILE
  // =====================================

  const viewUser = (userId) => {
    navigate(`/profiledetail/${userId}`);
  };

  // =====================================
  // LOGOUT
  // =====================================

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // =====================================
  // NAVIGATION
  // =====================================

  const goTo = (path) => {
    setSidebarOpen(false);
    navigate(path);
  };

  return (
    <div className="sv-admin-shell">

      {/* =================================
          OVERLAY
      ================================= */}

      {sidebarOpen && (
        <div
          className="sv-admin-backdrop"
          onClick={() =>
            setSidebarOpen(false)
          }
        />
      )}

      {/* =================================
          SIDEBAR
      ================================= */}

      <aside
        className={`sv-admin-drawer ${
          sidebarOpen
            ? "sv-admin-drawer-open"
            : ""
        }`}
      >

        {/* BRAND */}

        <div className="sv-admin-drawer-top">

          <div className="sv-admin-brand">

            <div className="sv-admin-brand-mark">
              स
            </div>

            <div>
              <h2>Sapta Vachan</h2>

              <span>
                ADMIN SPACE
              </span>
            </div>

          </div>

          <button
            className="sv-admin-close"
            onClick={() =>
              setSidebarOpen(false)
            }
          >
            ×
          </button>

        </div>

        {/* ADMIN CARD */}

        <div className="sv-admin-user-card">

          <div className="sv-admin-user-avatar">
            <i className="fa-solid fa-user-shield"></i>
          </div>

          <div>
            <strong>Administrator</strong>
            <span>Managing Sapta Vachan</span>
          </div>

        </div>

        {/* NAV */}

        <div className="sv-admin-nav-label">
          MANAGEMENT
        </div>

        <nav className="sv-admin-navigation">

          <button
            className="sv-admin-nav-active"
            onClick={() =>
              goTo("/admin")
            }
          >
            <span className="sv-admin-nav-icon">
              <i className="fa-solid fa-chart-pie"></i>
            </span>

            <span>Dashboard</span>
          </button>

          <button
            onClick={() =>
              filterUsers("All")
            }
          >
            <span className="sv-admin-nav-icon">
              <i className="fa-solid fa-users"></i>
            </span>

            <span>All Users</span>

            <b>{totalUsers}</b>
          </button>

          <button
            onClick={() =>
              filterUsers("Male")
            }
          >
            <span className="sv-admin-nav-icon">
              <i className="fa-solid fa-mars"></i>
            </span>

            <span>Male Users</span>

            <b>{maleUsers}</b>
          </button>

          <button
            onClick={() =>
              filterUsers("Female")
            }
          >
            <span className="sv-admin-nav-icon">
              <i className="fa-solid fa-venus"></i>
            </span>

            <span>Female Users</span>

            <b>{femaleUsers}</b>
          </button>

          <button
            onClick={() =>
              goTo("/myprofile")
            }
          >
            <span className="sv-admin-nav-icon">
              <i className="fa-solid fa-user"></i>
            </span>

            <span>My Profile</span>
          </button>

          <button
            onClick={() =>
              goTo("/settings")
            }
          >
            <span className="sv-admin-nav-icon">
              <i className="fa-solid fa-gear"></i>
            </span>

            <span>Settings</span>
          </button>

        </nav>

        {/* SIDEBAR BOTTOM */}

        <div className="sv-admin-drawer-bottom">

          <div className="sv-admin-sidebar-note">
            <i className="fa-solid fa-heart"></i>

            <div>
              <strong>Meaningful connections</strong>
              <span>Seven vows. One lifetime.</span>
            </div>
          </div>

          <button
            className="sv-admin-logout"
            onClick={logout}
          >
            <i className="fa-solid fa-right-from-bracket"></i>

            <span>Logout</span>
          </button>

        </div>

      </aside>

      {/* =================================
          MAIN AREA
      ================================= */}

      <div className="sv-admin-main">

        {/* TOP BAR */}

        <header className="sv-admin-topbar">

          <div className="sv-admin-top-left">

            <button
              className="sv-admin-menu"
              onClick={() =>
                setSidebarOpen(true)
              }
            >
              <i className="fa-solid fa-bars"></i>
            </button>

            <div className="sv-admin-mobile-title">
              <strong>SAPTA VACHAN</strong>
              <span>ADMIN SPACE</span>
            </div>

          </div>

          <div className="sv-admin-top-right">

            <div className="sv-admin-status">
              <span></span>
              Admin online
            </div>

            <button
              className="sv-admin-profile-mini"
              onClick={() =>
                goTo("/myprofile")
              }
            >
              <i className="fa-solid fa-user"></i>
            </button>

          </div>

        </header>

        {/* CONTENT */}

        <main className="sv-admin-content">

          {/* PAGE INTRO */}

          <section className="sv-admin-intro">

            <div>

              <span className="sv-admin-kicker">
                ADMIN DASHBOARD
              </span>

              <h1>
                Community
                <em> Overview</em>
              </h1>

              <p>
                Manage members and keep
                every connection meaningful.
              </p>

            </div>

            <div className="sv-admin-date-card">

              <div>
                <span>MEMBERS</span>
                <strong>{totalUsers}</strong>
              </div>

              <i className="fa-solid fa-users"></i>

            </div>

          </section>

          {/* WELCOME CARD */}

          <section className="sv-admin-welcome">

            <div className="sv-admin-welcome-content">

              <span>
                WELCOME BACK, ADMIN
              </span>

              <h2>
                Build a community
                <br />
                <em>worth belonging to.</em>
              </h2>

              <p>
                Review profiles, manage
                members and keep Sapta
                Vachan a trusted space.
              </p>

            </div>

            <div className="sv-admin-welcome-art">

              <div className="sv-admin-heart-ring">
                <i className="fa-solid fa-heart"></i>
              </div>

              <span className="sv-admin-art-dot dot-one"></span>
              <span className="sv-admin-art-dot dot-two"></span>
              <span className="sv-admin-art-dot dot-three"></span>

            </div>

          </section>

          {/* STATS */}

          <section className="sv-admin-stats">

            <button
              className={`sv-admin-stat ${
                activeFilter === "All"
                  ? "sv-admin-stat-selected"
                  : ""
              }`}
              onClick={() =>
                filterUsers("All")
              }
            >

              <div className="sv-admin-stat-icon">
                <i className="fa-solid fa-users"></i>
              </div>

              <div>
                <span>Total Members</span>
                <strong>{totalUsers}</strong>
                <small>View all members →</small>
              </div>

            </button>

            <button
              className={`sv-admin-stat ${
                activeFilter === "Male"
                  ? "sv-admin-stat-selected"
                  : ""
              }`}
              onClick={() =>
                filterUsers("Male")
              }
            >

              <div className="sv-admin-stat-icon">
                <i className="fa-solid fa-mars"></i>
              </div>

              <div>
                <span>Male Members</span>
                <strong>{maleUsers}</strong>
                <small>View male profiles →</small>
              </div>

            </button>

            <button
              className={`sv-admin-stat ${
                activeFilter === "Female"
                  ? "sv-admin-stat-selected"
                  : ""
              }`}
              onClick={() =>
                filterUsers("Female")
              }
            >

              <div className="sv-admin-stat-icon">
                <i className="fa-solid fa-venus"></i>
              </div>

              <div>
                <span>Female Members</span>
                <strong>{femaleUsers}</strong>
                <small>View female profiles →</small>
              </div>

            </button>

            <div className="sv-admin-stat">

              <div className="sv-admin-stat-icon">
                <i className="fa-solid fa-user-clock"></i>
              </div>

              <div>
                <span>Pending Profiles</span>
                <strong>{incompleteUsers}</strong>
                <small>Needs attention →</small>
              </div>

            </div>

          </section>

          {/* USER MANAGEMENT */}

          <section className="sv-admin-users-panel">

            <div className="sv-admin-panel-head">

              <div>

                <span>MEMBERS</span>

                <h2>
                  User Management
                </h2>

                <p>
                  {filteredUsers.length} members
                  currently showing
                </p>

              </div>

              <div className="sv-admin-search">

                <i className="fa-solid fa-magnifying-glass"></i>

                <input
                  type="text"
                  placeholder="Search by name, email or city..."
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                />

                {search && (
                  <button
                    onClick={() =>
                      setSearch("")
                    }
                  >
                    ×
                  </button>
                )}

              </div>

            </div>

            {/* FILTER BAR */}

            <div className="sv-admin-filter-bar">

              {[
                ["All", "All Users"],
                ["Male", "Male"],
                ["Female", "Female"],
                ["Complete", "Complete"],
                ["Incomplete", "Pending"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  className={
                    activeFilter === value
                      ? "sv-admin-filter-active"
                      : ""
                  }
                  onClick={() =>
                    filterUsers(value)
                  }
                >
                  {label}
                </button>
              ))}

            </div>

            {/* TABLE */}

            <div className="sv-admin-table-wrap">

              <div className="sv-admin-table-head">

                <span>User</span>
                <span>Email</span>
                <span>Gender</span>
                <span>Location</span>
                <span>Status</span>
                <span>Action</span>

              </div>

              {filteredUsers.map(
                (user) => (

                  <div
                    className="sv-admin-user-row"
                    key={user._id}
                  >

                    <div className="sv-admin-user-info">

                      <div className="sv-admin-user-picture">

                        {user.name
                          ? user.name
                              .charAt(0)
                              .toUpperCase()
                          : "U"}

                      </div>

                      <div>
                        <strong>
                          {user.name ||
                            "Unknown User"}
                        </strong>

                        <span>
                          {user.age
                            ? `${user.age} years`
                            : "Age not added"}
                        </span>
                      </div>

                    </div>

                    <div className="sv-admin-email">
                      {user.email || "-"}
                    </div>

                    <div className="sv-admin-gender">
                      <i
                        className={
                          user.gender ===
                          "Male"
                            ? "fa-solid fa-mars"
                            : "fa-solid fa-venus"
                        }
                      ></i>

                      {user.gender || "-"}
                    </div>

                    <div className="sv-admin-location">
                      <i className="fa-solid fa-location-dot"></i>

                      {user.city || "-"}
                    </div>

                    <div
                      className={`sv-admin-status-pill ${
                        user.status ===
                        "Complete"
                          ? "sv-admin-complete"
                          : "sv-admin-incomplete"
                      }`}
                    >
                      <i className="fa-solid fa-circle"></i>

                      {user.status ||
                        "Incomplete"}
                    </div>

                    <div className="sv-admin-actions">

                      <button
                        className="sv-admin-view"
                        title="View Profile"
                        onClick={() =>
                          viewUser(
                            user._id
                          )
                        }
                      >
                        <i className="fa-solid fa-eye"></i>
                      </button>

                      <button
                        className="sv-admin-delete"
                        title="Delete User"
                        onClick={() =>
                          deleteUser(
                            user._id
                          )
                        }
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>

                    </div>

                  </div>

                )
              )}

              {filteredUsers.length === 0 && (
                <div className="sv-admin-empty">

                  <div>
                    <i className="fa-solid fa-user-slash"></i>
                  </div>

                  <h3>No members found</h3>

                  <p>
                    Try changing your search
                    or selected filter.
                  </p>

                </div>
              )}

            </div>

          </section>

          {/* BOTTOM AREA */}

          <section className="sv-admin-bottom-grid">

            {/* RECENT */}

            <div className="sv-admin-bottom-card">

              <div className="sv-admin-bottom-head">

                <div>
                  <span>RECENT</span>

                  <h3>
                    New Registrations
                  </h3>
                </div>

                <div className="sv-admin-bottom-icon">
                  <i className="fa-solid fa-user-plus"></i>
                </div>

              </div>

              <div className="sv-admin-recent-list">

                {users
                  .slice(0, 4)
                  .map((user) => (

                    <button
                      key={user._id}
                      className="sv-admin-recent"
                      onClick={() =>
                        viewUser(
                          user._id
                        )
                      }
                    >

                      <div className="sv-admin-recent-avatar">
                        {user.name
                          ? user.name
                              .charAt(0)
                              .toUpperCase()
                          : "U"}
                      </div>

                      <div>
                        <strong>
                          {user.name ||
                            "Unknown"}
                        </strong>

                        <span>
                          {user.city || "-"}
                        </span>
                      </div>

                      <b>New</b>

                    </button>

                  ))}

              </div>

            </div>

            {/* PROFILE OVERVIEW */}

            <div className="sv-admin-bottom-card">

              <div className="sv-admin-bottom-head">

                <div>
                  <span>COMMUNITY</span>

                  <h3>
                    Profile Overview
                  </h3>
                </div>

                <div className="sv-admin-bottom-icon">
                  <i className="fa-solid fa-chart-simple"></i>
                </div>

              </div>

              <div className="sv-admin-overview-list">

                <button
                  onClick={() =>
                    filterUsers(
                      "Complete"
                    )
                  }
                >
                  <span>
                    <i className="fa-solid fa-circle-check"></i>
                    Complete profiles
                  </span>

                  <strong>
                    {completeUsers}
                  </strong>
                </button>

                <button
                  onClick={() =>
                    filterUsers(
                      "Incomplete"
                    )
                  }
                >
                  <span>
                    <i className="fa-solid fa-user-clock"></i>
                    Pending profiles
                  </span>

                  <strong>
                    {incompleteUsers}
                  </strong>
                </button>

                <button
                  onClick={() =>
                    filterUsers("Male")
                  }
                >
                  <span>
                    <i className="fa-solid fa-mars"></i>
                    Male members
                  </span>

                  <strong>
                    {maleUsers}
                  </strong>
                </button>

                <button
                  onClick={() =>
                    filterUsers("Female")
                  }
                >
                  <span>
                    <i className="fa-solid fa-venus"></i>
                    Female members
                  </span>

                  <strong>
                    {femaleUsers}
                  </strong>
                </button>

              </div>

            </div>

          </section>

        </main>

      </div>

    </div>
  );
}

export default AdminPanel;