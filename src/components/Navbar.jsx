import { Link, useNavigate } from "react-router-dom"
import logo from "../assets/icons/saptavachan2.png"
import { useState } from "react"
import { jwtDecode } from "jwt-decode"

function Navbar() {
  const token = localStorage.getItem("token")
  const decoded = token ? jwtDecode(token) : null

  const [show, setShow] = useState(false)
  const navigate = useNavigate()

  const handleProfileClick = (e) => {
    e.preventDefault()

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
          <Link to="/home">Home</Link>
          <Link to="/findmatches">Find Matches</Link>
          <Link to="/interests">Interests</Link>
          <Link to="/messages">Messages</Link>
          <Link to="/notification">Notification</Link>
        </div>

        {/* Profile Icon */}
        <Link
          to="/myprofile"
          className="icon-profile"
          onClick={handleProfileClick}
        >
          <i className="fa-solid fa-circle-user"></i>
        </Link>

        <button
          onClick={() => setShow(!show)}
          className="homebuger"
        >
          <i className="fa-solid fa-bars"></i>
        </button>
      </nav>

      {show && (
        <div className="navLinks-home">
          <Link to="/home" className="bugerLinks">
            Home
          </Link>

          <Link to="/findmatches" className="bugerLinks">
            Find Matches
          </Link>

          <Link to="/interests" className="bugerLinks">
            Interests
          </Link>

          <Link to="/messages" className="bugerLinks">
            Messages
          </Link>

          <Link to="/notification" id="bugerLinksStyle">
            Notification
          </Link>

          <Link
            to="/myprofile"
            className="icon-profile-new"
            id="bugerLinksStyle2"
            onClick={handleProfileClick}
          >
            {decoded?.role === "admin" ? "Admin Panel" : "My Profile"}
          </Link>
        </div>
      )}
    </>
  )
}

export default Navbar