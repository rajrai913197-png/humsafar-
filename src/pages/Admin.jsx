import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AdminPanel() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [showAccount, setShowAccount] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* ================= GET USERS ================= */

  const getAllUsers = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3300/getalluser"
      );

      setUsers(res.data || []);
    } catch (error) {
      console.log("GET USERS ERROR:", error);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  /* ================= COUNTS ================= */

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

  /* ================= FILTER ================= */

  const filterUsers = (filter) => {
    setActiveFilter(filter);
    setSidebarOpen(false);
  };

  /* ================= SEARCH + FILTER ================= */

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

  /* ================= DELETE ================= */

  const deleteUser = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to remove this user?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `http://localhost:3300/deleteUser/${id}`
      );

      setUsers((prevUsers) =>
        prevUsers.filter((user) => user._id !== id)
      );

      alert("User deleted successfully");
    } catch (error) {
      console.log("DELETE USER ERROR:", error);
    }
  };

  /* ================= VIEW USER ================= */

  const viewUser = (id) => {
    navigate(`/profiledetail/${id}`);
  };

  /* ================= LOGOUT ================= */

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  /* ================= SIDEBAR NAV ================= */

  const goTo = (path) => {
    setSidebarOpen(false);
    setShowAccount(false);
    navigate(path);
  };

  return (
    <div className="admin-page">

      {/* ================= SIDEBAR OVERLAY ================= */}

      {sidebarOpen && (
        <div
          className="admin-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ================= SIDEBAR ================= */}

      <aside
        className={`admin-sidebar ${
          sidebarOpen ? "show" : ""
        }`}
      >

        {/* SIDEBAR BRAND */}

        <div className="admin-sidebar-header">

          <div className="admin-sidebar-brand">

            <div className="admin-brand-circle">
              स
            </div>

            <div>
              <h2>Sapta Vachan</h2>
              <span>Admin Panel</span>
            </div>

          </div>

          <button
            className="admin-sidebar-close"
            onClick={() => setSidebarOpen(false)}
          >
            ×
          </button>

        </div>

        {/* ADMIN PROFILE */}

        <div className="admin-sidebar-profile">

          <div className="admin-sidebar-avatar">
            <i className="fa-solid fa-user"></i>
          </div>

          <div>
            <strong>Admin</strong>
            <span>Administrator</span>
          </div>

        </div>

        {/* NAVIGATION */}

        <nav className="admin-sidebar-menu">

          <button
            className="active"
            onClick={() => goTo("/admin")}
          >
            <i className="fa-solid fa-chart-line"></i>
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => {
              setActiveFilter("All");
              setSidebarOpen(false);
            }}
          >
            <i className="fa-solid fa-users"></i>
            <span>All Users</span>
          </button>

          <button
            onClick={() => {
              setActiveFilter("Male");
              setSidebarOpen(false);
            }}
          >
            <i className="fa-solid fa-mars"></i>
            <span>Male Users</span>
          </button>

          <button
            onClick={() => {
              setActiveFilter("Female");
              setSidebarOpen(false);
            }}
          >
            <i className="fa-solid fa-venus"></i>
            <span>Female Users</span>
          </button>

          <button
            onClick={() => goTo("/myprofile")}
          >
            <i className="fa-solid fa-user"></i>
            <span>My Profile</span>
          </button>

          <button
            onClick={() => goTo("/settings")}
          >
            <i className="fa-solid fa-gear"></i>
            <span>Settings</span>
          </button>

        </nav>

        {/* LOGOUT */}

        <button
          className="admin-sidebar-logout"
          onClick={logout}
        >
          <i className="fa-solid fa-right-from-bracket"></i>
          <span>Logout</span>
        </button>

      </aside>

      {/* ================= TOP BAR ================= */}

      <header className="admin-topbar">

        <div className="admin-top-left">

          <button
            className="admin-menu-btn"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open admin menu"
          >
            ☰
          </button>

          <div className="admin-mobile-brand">

            <strong>
              SAPTA VACHAN
            </strong>

            <span>
              Admin Dashboard
            </span>

          </div>

        </div>

      

      </header>

      {/* ================= MAIN ================= */}

      <main className="admin-content">

        {/* PAGE TITLE */}

        <div className="dashboard-title">

          <div>
            <p>DASHBOARD</p>

            <h1>
              Overview
            </h1>

            <span>
              Manage your matrimonial community from here.
            </span>
          </div>

        </div>

        {/* ================= WELCOME ================= */}

        <section className="welcome-section">

          <div>

            <p>
              WELCOME BACK, ADMIN
            </p>

            <h2>
              Keep your community{" "}
              <em>meaningful.</em>
            </h2>

            <small>
              Manage members, review profiles and keep
              Sapta Vachan safe.
            </small>

          </div>

          <div className="welcome-icon">

            <i className="fa-solid fa-heart"></i>

          </div>

        </section>

        {/* ================= STATS ================= */}

        <section className="stats-grid">

          <div
            className={`stat-card clickable ${
              activeFilter === "All"
                ? "selected"
                : ""
            }`}
            onClick={() => filterUsers("All")}
          >

            <div className="stat-icon">
              <i className="fa-solid fa-users"></i>
            </div>

            <div>
              <span>Total Users</span>
              <h3>{totalUsers}</h3>
              <small>View all members →</small>
            </div>

          </div>

          <div
            className={`stat-card clickable ${
              activeFilter === "Male"
                ? "selected"
                : ""
            }`}
            onClick={() => filterUsers("Male")}
          >

            <div className="stat-icon">
              <i className="fa-solid fa-mars"></i>
            </div>

            <div>
              <span>Men</span>
              <h3>{maleUsers}</h3>
              <small>View male profiles →</small>
            </div>

          </div>

          <div
            className={`stat-card clickable ${
              activeFilter === "Female"
                ? "selected"
                : ""
            }`}
            onClick={() => filterUsers("Female")}
          >

            <div className="stat-icon">
              <i className="fa-solid fa-venus"></i>
            </div>

            <div>
              <span>Women</span>
              <h3>{femaleUsers}</h3>
              <small>View female profiles →</small>
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon">
              <i className="fa-solid fa-user-plus"></i>
            </div>

            <div>
              <span>New Today</span>
              <h3>18</h3>
              <small>Recently joined →</small>
            </div>

          </div>

        </section>

        {/* ================= USER MANAGEMENT ================= */}

        <section className="users-card">

          <div className="users-top">

            <div>

              <p>MEMBERS</p>

              <h2>
                User Management
              </h2>

              <span>
                {filteredUsers.length} members showing
              </span>

            </div>

            <div className="search-box">

              <i className="fa-solid fa-magnifying-glass"></i>

              <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </div>

          </div>

          {/* FILTERS */}

          <div className="filter-row">

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
                    ? "active-filter"
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

          <div className="users-table">

            <div className="table-head">

              <span>User</span>
              <span>Email</span>
              <span>Gender</span>
              <span>City</span>
              <span>Status</span>
              <span>Action</span>

            </div>

            {filteredUsers.map((user) => (

              <div
                className="user-row"
                key={user._id}
              >

                {/* USER */}

                <div className="user-details">

                  <div className="user-avatar">

                    {user.name
                      ? user.name
                          .charAt(0)
                          .toUpperCase()
                      : "U"}

                  </div>

                  <div>

                    <strong>
                      {user.name || "Unknown User"}
                    </strong>

                    <small>
                      {user.age || "-"} years old
                    </small>

                  </div>

                </div>

                {/* EMAIL */}

                <span className="email">
                  {user.email || "-"}
                </span>

                {/* GENDER */}

                <span className="gender">

                  <i
                    className={
                      user.gender === "Male"
                        ? "fa-solid fa-mars"
                        : "fa-solid fa-venus"
                    }
                  ></i>

                  {user.gender || "-"}

                </span>

                {/* CITY */}

                <span className="city">

                  <i className="fa-solid fa-location-dot"></i>

                  {user.city || "-"}

                </span>

                {/* STATUS */}

                <span
                  className={
                    user.status === "Complete"
                      ? "status complete"
                      : "status incomplete"
                  }
                >

                  <i className="fa-solid fa-circle"></i>

                  {user.status || "Incomplete"}

                </span>

                {/* ACTION */}

                <div className="actions">

                  <button
                    className="view-btn"
                    title="View Profile"
                    onClick={() =>
                      viewUser(user._id)
                    }
                  >
                    <i className="fa-solid fa-eye"></i>
                  </button>

                  <button
                    className="delete-btn"
                    title="Remove User"
                    onClick={() =>
                      deleteUser(user._id)
                    }
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>

                </div>

              </div>

            ))}

            {/* NO USERS */}

            {filteredUsers.length === 0 && (

              <div className="no-users">

                <i className="fa-solid fa-user-slash"></i>

                <h3>
                  No users found
                </h3>

                <p>
                  Try another search or filter.
                </p>

              </div>

            )}

          </div>

        </section>

        {/* ================= BOTTOM GRID ================= */}

        <div className="bottom-grid">

          {/* RECENT */}

          <div className="bottom-card">

            <div className="bottom-title">

              <div>

                <p>RECENT</p>

                <h3>
                  New Registrations
                </h3>

              </div>

              <div className="bottom-icon">
                <i className="fa-solid fa-user-plus"></i>
              </div>

            </div>

            <div className="recent-list">

              {users.slice(0, 4).map((user) => (

                <div
                  className="recent-user"
                  key={user._id}
                  onClick={() =>
                    viewUser(user._id)
                  }
                >

                  <div className="recent-avatar">

                    {user.name
                      ? user.name
                          .charAt(0)
                          .toUpperCase()
                      : "U"}

                  </div>

                  <div>

                    <strong>
                      {user.name || "Unknown"}
                    </strong>

                    <small>
                      {user.city || "-"}
                    </small>

                  </div>

                  <span>
                    New
                  </span>

                </div>

              ))}

            </div>

          </div>

          {/* COMMUNITY */}

          <div className="bottom-card">

            <div className="bottom-title">

              <div>

                <p>COMMUNITY</p>

                <h3>
                  Profile Overview
                </h3>

              </div>

              <div className="bottom-icon">

                <i className="fa-solid fa-chart-simple"></i>

              </div>

            </div>

            <div className="activity-list">

              <div
                onClick={() =>
                  filterUsers("Complete")
                }
              >

                <span>
                  <i className="fa-solid fa-circle-check"></i>
                  Complete profiles
                </span>

                <strong>
                  {completeUsers}
                </strong>

              </div>

              <div
                onClick={() =>
                  filterUsers("Incomplete")
                }
              >

                <span>
                  <i className="fa-solid fa-user-clock"></i>
                  Pending profiles
                </span>

                <strong>
                  {incompleteUsers}
                </strong>

              </div>

              <div
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

              </div>

              <div
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

              </div>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}

export default AdminPanel;