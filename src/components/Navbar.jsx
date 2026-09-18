import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/icons/saptavachan2.png";
import { useState } from "react";
import { jwtDecode } from "jwt-decode";

function Navbar() {
  const token = localStorage.getItem("token");

  let decoded = null;

  try {
    decoded = token ? jwtDecode(token) : null;
  } catch (error) {
    console.log("Invalid token");
  }

  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  // Close menu
  const closeMenu = () => {
    setShow(false);
  };

  const handleProfileClick = (e) => {
    e.preventDefault();

    setShow(false);

    if (decoded?.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/myprofile");
    }
  };

  return (
    <>
      {/* ================= NAVBAR ================= */}

      <nav className="navbar">

        {/* Logo */}
        <Link
          to="/home"
          className="navbar-logo"
          onClick={closeMenu}
        >
          <img
            src={logo}
            alt="Sapta Vachan"
            className="logo"
          />
        </Link>


        {/* Desktop Links */}
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
          title={
            decoded?.role === "admin"
              ? "Admin Panel"
              : "My Profile"
          }
        >
          <i className="fa-solid fa-circle-user"></i>
        </Link>


        {/* Hamburger */}
        <button
          onClick={() => setShow(!show)}
          className={`homebuger ${show ? "active" : ""}`}
          aria-label="Toggle menu"
        >
          <i
            className={
              show
                ? "fa-solid fa-xmark"
                : "fa-solid fa-bars"
            }
          ></i>
        </button>

      </nav>


      {/* ================= MOBILE MENU ================= */}

      {show && (
        <>
          {/* Overlay */}
          <div
            className="menu-overlay"
            onClick={closeMenu}
          ></div>


          {/* Drawer */}
          <div className="navLinks-home">

            <div className="drawer-header">

              <div>
                <span className="drawer-title">
                  Sapta Vachan
                </span>

                <span className="drawer-subtitle">
                  Seven vows. One lifetime.
                </span>
              </div>

              <button
                className="drawer-close"
                onClick={closeMenu}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>

            </div>


            <div className="drawer-links">

              <Link
                to="/home"
                className="bugerLinks"
                onClick={closeMenu}
              >
                <i className="fa-solid fa-house"></i>
                <span>Home</span>
              </Link>


              <Link
                to="/findmatches"
                className="bugerLinks"
                onClick={closeMenu}
              >
                <i className="fa-solid fa-heart"></i>
                <span>Find Matches</span>
              </Link>


              <Link
                to="/interests"
                className="bugerLinks"
                onClick={closeMenu}
              >
                <i className="fa-solid fa-star"></i>
                <span>Interests</span>
              </Link>


              <Link
                to="/messages"
                className="bugerLinks"
                onClick={closeMenu}
              >
                <i className="fa-solid fa-message"></i>
                <span>Messages</span>
              </Link>


              <Link
                to="/notification"
                className="bugerLinks"
                onClick={closeMenu}
              >
                <i className="fa-solid fa-bell"></i>
                <span>Notification</span>
              </Link>


              {/* Profile */}
              <button
                className="bugerLinks profile-menu-btn"
                onClick={handleProfileClick}
              >
                <i className="fa-solid fa-circle-user"></i>

                <span>
                  {decoded?.role === "admin"
                    ? "Admin Panel"
                    : "My Profile"}
                </span>
              </button>

            </div>

          </div>
        </>
      )}
    </>
  );
}

export default Navbar;