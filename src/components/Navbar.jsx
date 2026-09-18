import { Link, useNavigate } from "react-router-dom"
import logo from "../assets/icons/saptavachan2.png"
import { useState } from "react"
import { jwtDecode } from "jwt-decode"

function Navbar() {
  const token = localStorage.getItem("token")
  const decoded = token ? jwtDecode(token) : null

  const [show, setShow] = useState(false)
  const navigate = useNavigate()

  // Menu close karne ke liye
  const closeMenu = () => {
    setShow(false)
  }

  const handleProfileClick = (e) => {
    e.preventDefault()

    setShow(false)

    if (decoded?.role === "admin") {
      navigate("/admin")
    } else {
      navigate("/myprofile")
    }
  }

  return (
    <>
      <nav className="navbar">

        <img src={logo} alt="" className="logo" />

        <div className="navLinks">

          <Link to="/home">
            Home
          </Link>

          <Link to="/findmatches">
            Find Matches
          </Link>

          <Link to="/interests">
            Interests
          </Link>

          <Link to="/messages">
            Messages
          </Link>

          <Link to="/notification">
            Notification
          </Link>

        </div>


        {/* Profile Icon */}

        <Link
          to="/myprofile"
          className="icon-profile"
          onClick={handleProfileClick}
        >
          <i className="fa-solid fa-circle-user"></i>
        </Link>


        {/* Hamburger */}

        <button
          onClick={() => setShow(!show)}
          className="homebuger"
        >
          <i className="fa-solid fa-bars"></i>
        </button>

      </nav>


      {/* ================= MOBILE MENU ================= */}

      {show && (
        <div className="navLinks-home">

          {/* Close Button */}

          <button
            className="menu-close"
            onClick={closeMenu}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>


          <Link
            to="/home"
            className="bugerLinks"
            onClick={closeMenu}
          >
            Home
          </Link>


          <Link
            to="/findmatches"
            className="bugerLinks"
            onClick={closeMenu}
          >
            Find Matches
          </Link>


          <Link
            to="/interests"
            className="bugerLinks"
            onClick={closeMenu}
          >
            Interests
          </Link>


          <Link
            to="/messages"
            className="bugerLinks"
            onClick={closeMenu}
          >
            Messages
          </Link>


          <Link
            to="/notification"
            id="bugerLinksStyle"
            onClick={closeMenu}
          >
            Notification
          </Link>


          <Link
            to="/myprofile"
            className="icon-profile-new"
            id="bugerLinksStyle2"
            onClick={handleProfileClick}
          >
            {decoded?.role === "admin"
              ? "Admin Panel"
              : "My Profile"}
          </Link>

        </div>
      )}
    </>
  )
}

export default Navbar