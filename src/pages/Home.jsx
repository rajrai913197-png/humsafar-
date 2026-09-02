



import axios from "axios"
import { useState } from "react";
import { useEffect } from "react"
// const profiles = [
//   {

//     name: "Ananya Sharma",

//     age: 26,

//     profession: "Software Engineer",

//     location: "Bhopal, Madhya Pradesh",

//     image: "https://i.pravatar.cc/600?img=47",

//   },

//   {

//     name: "Riya Verma",

//     age: 25,

//     profession: "Architect",

//     location: "Indore, Madhya Pradesh",

//     image: "https://i.pravatar.cc/600?img=44",

//   },

//   {

//     name: "Kavya Patel",

//     age: 27,

//     profession: "Doctor",

//     location: "Mumbai, Maharashtra",

//     image: "https://i.pravatar.cc/600?img=49",

//   },

//   {

//     name: "Sneha Mehta",

//     age: 24,

//     profession: "Marketing Manager",

//     location: "Delhi, India",

//     image: "https://i.pravatar.cc/600?img=45",

//   },

// ];

function Home() {
 const  [profiles,setProfiles]= useState([])
  const GetUser = ()=>{
     axios.get("http://localhost:3300/getUser")
     .then((res)=> setProfiles(res.data))
     .catch(err => console.log(err))
  }
  useEffect(()=>{
    GetUser()
  },[])
  return (
   <>
    <section className="hero-slider">

      <img

        src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2000&q=85"

        alt="Wedding couple"

        className="hero-img"

      />

      <div className="hero-overlay"></div>

      <div className="hero-content">

        <p className="hero-tag">

          FIND YOUR LIFE PARTNER

        </p>

        <h1>

          Find Your

          <br />

          <span>Forever.</span>

        </h1>

        <p className="hero-text">

          Discover meaningful connections with someone who

          shares your values, dreams and vision for life.

        </p>

        <button className="hero-btn">

          Find Your Match <span>→</span>

        </button>

      </div>

    </section>
    <section className="match-filter">

      <div className="filter-heading">

        <span>FIND YOUR MATCH</span>

        <h2>

          Find Your <em>Perfect Match</em>

        </h2>

        <p>

          Search through profiles based on your preferences.

        </p>

      </div>

      <div className="filter-box">

        <div className="filter-field">

          <label>Looking For</label>

          <select>

            <option>Women</option>

            <option>Men</option>

          </select>

        </div>

        <div className="filter-field">

          <label>Age From</label>

          <select>

            <option>21</option>

            <option>22</option>

            <option>23</option>

            <option>24</option>

            <option>25</option>

          </select>

        </div>

        <div className="filter-field">

          <label>Age To</label>

          <select>

            <option>30</option>

            <option>31</option>

            <option>32</option>

            <option>35</option>

            <option>40</option>

          </select>

        </div>

        <div className="filter-field">

          <label>Location</label>

          <select>

            <option>Any Location</option>

            <option>Bhopal</option>

            <option>Indore</option>

            <option>Delhi</option>

            <option>Mumbai</option>

          </select>

        </div>

        <div className="filter-field">

          <label>Community</label>

          <select>

            <option>Any Community</option>

            <option>Hindu</option>

            <option>Muslim</option>

            <option>Sikh</option>

            <option>Christian</option>

          </select>

        </div>

        <button className="filter-btn">

          Search Matches →

        </button>

      </div>

    </section>
     <section className="profiles-section">

      <div className="profiles-heading">

        <p>MEET YOUR POTENTIAL MATCH</p>

        <h2>

          People Looking For <span>Forever</span>

        </h2>

        <div className="heading-line"></div>

        <h4>

          Discover genuine profiles looking for meaningful

          relationships and lifelong companionship.

        </h4>

      </div>

      <div className="profiles-grid">

        {profiles.map((profile) => (

          <div className="profile-card" key={profile.name}>

            {/* IMAGE */}

            <div className="profile-image">

              <img

                src={`http://localhost:3300/upload/${profile.image}`}

                alt={profile.name}

              />

              <div className="verified-badge">

                ✓ Verified

              </div>

              <button className="like-button">

                ♡

              </button>

            </div>

            {/* DETAILS */}

            <div className="profile-details">

              <div className="profile-name-row">

                <h3>

                  {profile.name}, {profile.age}

                </h3>

                <span className="online-dot"></span>

              </div>

              <p className="profession">

                {profile.profession}

              </p>

              <p className="location">

                ♧ {profile.location}

              </p>

              <div className="profile-divider"></div>

              <div className="profile-bottom">

                <span>

                  Profile Verified

                </span>

                <button>

                  View Profile →

                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

      <button className="all-profiles-btn">

        Explore All Profiles →

      </button>

    </section>
   </>
  )
}



export default Home

