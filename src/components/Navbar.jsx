import { Link } from "react-router-dom"

function Navbar() {
  return (
    <>
     <nav className="navbar">
        <div className="navLinks">
          <Link to="/home">Home</Link>
          <Link to="/findmatches">Find Matches</Link>
          <Link to="/interests">Interests</Link>
          <Link to="/messages">Messages</Link>
          <Link to="/notification">Notification</Link>
          <Link to="/myprofile">My Profile</Link>
        </div>
      </nav>
    </>
  )
}

export default Navbar
