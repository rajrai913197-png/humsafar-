import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

function AdminPanel() {
 const [activeFilter, setActiveFilter] = useState("All")
  const [search, setSearch] = useState("")
  const [showAccount, setShowAccount] = useState(false)
  const navigate = useNavigate()

  const [users, setUsers] = useState([
  
  ])

  const getAllUsers = ()=>{
     axios.get("http://localhost:3300/getalluser")
     .then((res)=>setUsers(res.data))
     .catch(err => console.log(err))
  }

 



  /* ================= COUNTS ================= */

  const totalUsers = users.length

  const maleUsers = users.filter(
    user => user.gender === "Male"
  ).length

  const femaleUsers = users.filter(
    user => user.gender === "Female"
  ).length

  const completeUsers = users.filter(
    user => user.status === "Complete"
  ).length

  const incompleteUsers = users.filter(
    user => user.status === "Incomplete"
  ).length


  /* ================= FILTER ================= */

  const filterUsers = (filter) => {
    setActiveFilter(filter)
  }


  /* ================= SEARCH + FILTER ================= */

  const filteredUsers = users.filter((user) => {

    const searchMatch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.city.toLowerCase().includes(search.toLowerCase())

    let filterMatch = true

    if (activeFilter === "Male") {
      filterMatch = user.gender === "Male"
    }

    if (activeFilter === "Female") {
      filterMatch = user.gender === "Female"
    }

    if (activeFilter === "Complete") {
      filterMatch = user.status === "Complete"
    }

    if (activeFilter === "Incomplete") {
      filterMatch = user.status === "Incomplete"
    }

    return searchMatch && filterMatch
  })


  /* ================= DELETE ================= */

  const deleteUser = (id) => {
      axios.delete(`http://localhost:3300/deleteUser/${id}`)
      .then(()=> alert("userDelete"))
      .catch(err => console.log(err))
  }


  /* ================= VIEW USER ================= */

  const viewUser = (id) => {
    navigate(`/profiledetail/${id}`)
  }


  /* ================= LOGOUT ================= */

  const logout = () => {

    localStorage.removeItem("token")

    navigate("/")
  }
 useEffect(()=>{
  getAllUsers()
},[deleteUser])

  return (

    <div className="admin-page">


      {/* ================= HEADER ================= */}

      <header className="admin-header">

        <div className="admin-brand">

          <span>SAPTA VACHAN</span>

          <h1>Admin Dashboard</h1>

        </div>


        {/* ADMIN ACCOUNT */}

        <div className="admin-account">

          <div
            className="admin-profile"
            onClick={() => setShowAccount(!showAccount)}
          >

            <div className="admin-avatar">

              <i className="fa-solid fa-user"></i>

            </div>

            <div>

              <strong>Admin</strong>

              <small>Administrator</small>

            </div>

            <i className="fa-solid fa-chevron-down"></i>

          </div>


          {/* ACCOUNT DROPDOWN */}

          {showAccount && (

            <div className="admin-dropdown">

              <div className="dropdown-user">

                <div className="dropdown-avatar">
                  <i className="fa-solid fa-user"></i>
                </div>

                <div>

                  <strong>Admin</strong>

                  <small>Administrator</small>

                </div>

              </div>


              <div className="dropdown-line"></div>


              <button
                onClick={() => navigate("/admin")}
              >
                <i className="fa-solid fa-chart-line"></i>
                Dashboard
              </button>


              <button
                onClick={() => navigate("/myprofile")}
              >
                <i className="fa-solid fa-user"></i>
                My Profile
              </button>


              <div className="dropdown-line"></div>


              <button
                className="logout-btn"
                onClick={logout}
              >
                <i className="fa-solid fa-right-from-bracket"></i>
                Logout
              </button>

            </div>

          )}

        </div>

      </header>



      {/* ================= MAIN ================= */}

      <main className="admin-content">


        {/* PAGE TITLE */}

        <div className="dashboard-title">

          <div>

            <p>DASHBOARD</p>

            <h2>Overview</h2>

            <span>
              Manage your matrimonial community from here.
            </span>

          </div>

        </div>



        {/* ================= WELCOME ================= */}

        <div className="welcome-section">

          <div>

            <p>WELCOME BACK, ADMIN</p>

            <h2>
              Keep your community <em>meaningful.</em>
            </h2>

            <small>
              Manage members, review profiles and keep
              Sapta Vachan safe.
            </small>

          </div>


          <div className="welcome-icon">

            <i className="fa-solid fa-heart"></i>

          </div>

        </div>



        {/* ================= STATS ================= */}

        <div className="stats-grid">


          {/* TOTAL */}

          <div
            className="stat-card clickable"
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



          {/* MALE */}

          <div
            className="stat-card clickable"
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



          {/* FEMALE */}

          <div
            className="stat-card clickable"
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



          {/* NEW */}

          <div
            className="stat-card clickable"
            onClick={() => filterUsers("All")}
          >

            <div className="stat-icon">

              <i className="fa-solid fa-user-plus"></i>

            </div>

            <div>

              <span>New Today</span>

              <h3>18</h3>

              <small>Recently joined →</small>

            </div>

          </div>

        </div>



        {/* ================= USER MANAGEMENT ================= */}

        <section className="users-card">


          {/* TOP */}

          <div className="users-top">

            <div>

              <p>MEMBERS</p>

              <h2>User Management</h2>

              <span>
                {filteredUsers.length} members showing
              </span>

            </div>


            {/* SEARCH */}

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

            <button
              className={
                activeFilter === "All"
                  ? "active-filter"
                  : ""
              }
              onClick={() => filterUsers("All")}
            >
              All Users
            </button>


            <button
              className={
                activeFilter === "Male"
                  ? "active-filter"
                  : ""
              }
              onClick={() => filterUsers("Male")}
            >
              Male
            </button>


            <button
              className={
                activeFilter === "Female"
                  ? "active-filter"
                  : ""
              }
              onClick={() => filterUsers("Female")}
            >
              Female
            </button>


            <button
              className={
                activeFilter === "Complete"
                  ? "active-filter"
                  : ""
              }
              onClick={() => filterUsers("Complete")}
            >
              Complete
            </button>


            <button
              className={
                activeFilter === "Incomplete"
                  ? "active-filter"
                  : ""
              }
              onClick={() => filterUsers("Incomplete")}
            >
              Pending
            </button>

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



            {filteredUsers.map(user => (

              <div
                className="user-row"
                key={user.id}
              >


                {/* USER */}

                <div className="user-details">

                  <div className="user-avatar">

                    {user.name
                      .charAt(0)
                      .toUpperCase()}

                  </div>

                  <div>

                    <strong>
                      {user.name}
                    </strong>

                    <small>
                      {user.age} years old
                    </small>

                  </div>

                </div>



                {/* EMAIL */}

                <span className="email">

                  {user.email}

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

                  {user.gender}

                </span>



                {/* CITY */}

                <span className="city">

                  <i className="fa-solid fa-location-dot"></i>

                  {user.city}

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

                  {user.status}

                </span>



                {/* ACTION */}

                <div className="actions">

                  <button
                    className="view-btn"
                    title="View Profile"
                    onClick={() => viewUser(user._id)}
                  >

                    <i className="fa-solid fa-eye"></i>

                  </button>


                  <button
                    className="delete-btn"
                    title="Remove User"
                    onClick={() => deleteUser(user._id)}
                  >

                    <i className="fa-solid fa-trash"></i>

                  </button>

                </div>

              </div>

            ))}



            {filteredUsers.length === 0 && (

              <div className="no-users">

                <i className="fa-solid fa-user-slash"></i>

                <h3>No users found</h3>

                <p>
                  Try another search or filter.
                </p>

              </div>

            )}

          </div>

        </section>



        {/* ================= BOTTOM ================= */}

        <div className="bottom-grid">


          {/* RECENT REGISTRATIONS */}

          <div
            className="bottom-card clickable-card"
            onClick={() => filterUsers("All")}
          >

            <div className="bottom-title">

              <div>

                <p>RECENT</p>

                <h3>New Registrations</h3>

              </div>

              <div className="bottom-icon">

                <i className="fa-solid fa-user-plus"></i>

              </div>

            </div>


            <div className="recent-list">

              {users.slice(0, 4).map(user => (

                <div
                  className="recent-user"
                  key={user.id}
                  onClick={(e) => {
                    e.stopPropagation()
                    viewUser(user.id)
                  }}
                >

                  <div className="recent-avatar">

                    {user.name.charAt(0)}

                  </div>

                  <div>

                    <strong>
                      {user.name}
                    </strong>

                    <small>
                      {user.city}
                    </small>

                  </div>

                  <span>
                    {user.joined}
                  </span>

                </div>

              ))}

            </div>

          </div>



          {/* COMMUNITY OVERVIEW */}

          <div className="bottom-card">

            <div className="bottom-title">

              <div>

                <p>COMMUNITY</p>

                <h3>Profile Overview</h3>

              </div>

              <div className="bottom-icon">

                <i className="fa-solid fa-chart-simple"></i>

              </div>

            </div>


            <div className="activity-list">


              <div
                onClick={() => filterUsers("All")}
              >

                <span>

                  <i className="fa-solid fa-user-plus"></i>

                  New profiles today

                </span>

                <strong>18</strong>

              </div>



              <div
                onClick={() => filterUsers("Complete")}
              >

                <span>

                  <i className="fa-solid fa-circle-check"></i>

                  Complete profiles

                </span>

                <strong>{completeUsers}</strong>

              </div>



              <div
                onClick={() => filterUsers("Incomplete")}
              >

                <span>

                  <i className="fa-solid fa-user-clock"></i>

                  Pending profiles

                </span>

                <strong>{incompleteUsers}</strong>

              </div>



              <div>

                <span>

                  <i className="fa-solid fa-heart"></i>

                  Community members

                </span>

                <strong>{totalUsers}</strong>

              </div>


            </div>

          </div>

        </div>

      </main>

    </div>
  )
}

export default AdminPanel