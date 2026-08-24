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
        <button onClick={()=> setShow(!show)} className="homebuger"><i class="fa-solid fa-bars"></i></button>
      </nav>
      {
        show && (
          <div className="navLinks-home">
          <Link to="/home" className="bugerLinks">Home</Link>
          <Link to="/findmatches" className="bugerLinks">Find Matches</Link>
          <Link to="/interests" className="bugerLinks">Interests</Link>
          <Link to="/messages" className="bugerLinks" >Messages</Link>
          <Link to="/notification" id="bugerLinksStyle">Notification</Link>
           <Link to="/myprofile" className="icon-profile-new" id="bugerLinksStyle2">My Profile</Link>
        </div>
        )
      }
    </>
  )
}

export default Navbar
