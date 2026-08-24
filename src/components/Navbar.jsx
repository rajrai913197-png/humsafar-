import { Link } from "react-router-dom"
import logo from "../assets/icons/saptavachan2.png"
import { useState } from "react"
function Navbar() {
   const [show,setShow]= useState(false)
  return (
   
    <>
     <nav className="navbar">
            <img src={logo} alt="" className="logo"/>
        <div className="navLinks">
          <Link to="/home">Home</Link>
          <Link to="/findmatches">Find Matches</Link>
          <Link to="/interests">Interests</Link>
          <Link to="/messages">Messages</Link>
          <Link to="/notification">Notification</Link>
        </div>
        <Link to="/myprofile" className="icon-profile"><i class="fa-solid fa-circle-user"></i></Link>
      </nav>
    </>
  )
}

export default Navbar
