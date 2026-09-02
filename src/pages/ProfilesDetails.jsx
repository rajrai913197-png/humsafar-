
import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"


const ProfilesDetails = () => {
   const navigate =  useNavigate()
  const [profile,setUserData]=  useState([])
    const {id}= useParams()
    console.log( id)
     const GetUserDetail = ()=>{
       axios.get(`http://localhost:3300/getUserBy/${id}`)
       .then((res)=>setUserData(res.data))
       .catch(err => console.log(err))
     }
     useEffect(()=>{
      GetUserDetail()
     },[])
  return (
   <>
      <main className="profile-detail-page">

      {/* BACK */}

      <button

        className="back-profile-btn"

        onClick={() => navigate(-1)}

      >

        ← Back to Matches

      </button>

      {/* MAIN CARD */}

      <section className="profile-detail-card">

        {/* LEFT */}

        <div className="profile-detail-image-section">

          <div className="profile-detail-image">

            <img

              src={`http://localhost:3300/upload/${profile.image}`}

              alt={profile.name}

            />

            {profile.verified && (

              <span className="detail-verified">

                ✓ Verified Profile

              </span>

            )}

          </div>

          <div className="image-actions">

            <button className="send-interest-btn">

              ♡ Send Interest

            </button>

            <button className="send-message-btn">

              💬 Message

            </button>

          </div>

        </div>

        {/* RIGHT */}

        <div className="profile-detail-content">

          <span className="profile-small-title">

            MATRIMONIAL PROFILE

          </span>

          <h1>

            {profile.name}

          </h1>

          <p className="profile-basic-location">

            📍 {profile.location || "Location not mentioned"}

          </p>

          <div className="profile-line"></div>

          {/* BASIC INFO */}

          <div className="basic-info">

            <div>

              <span>Age</span>

              <strong>{profile.age || "—"}</strong>

            </div>

            <div>

              <span>Gender</span>

              <strong>{profile.gender || "—"}</strong>

            </div>

            <div>

              <span>Profession</span>

              <strong>{profile.profession || "—"}</strong>

            </div>

          </div>

          {/* ABOUT */}

          <div className="detail-section">

            <h2>

              About {profile.name}

            </h2>

            <p>

              {profile.about ||

                `${profile.name} is looking for a meaningful relationship and a compatible life partner.`}

            </p>

          </div>

          {/* PERSONAL DETAILS */}

          <div className="detail-section">

            <h2>Personal Details</h2>

            <div className="detail-grid">

              <div className="detail-item">

                <span>Education</span>

                <strong>

                  {profile.education || "Not mentioned"}

                </strong>

              </div>

              <div className="detail-item">

                <span>Profession</span>

                <strong>

                  {profile.profession || "Not mentioned"}

                </strong>

              </div>

              <div className="detail-item">

                <span>Religion</span>

                <strong>

                  {profile.religion || "Not mentioned"}

                </strong>

              </div>

              <div className="detail-item">

                <span>Community</span>

                <strong>

                  {profile.community || "Not mentioned"}

                </strong>

              </div>

              <div className="detail-item">

                <span>Location</span>

                <strong>

                  {profile.location || "Not mentioned"}

                </strong>

              </div>

              <div className="detail-item">

                <span>Marital Status</span>

                <strong>

                  {profile.maritalStatus || "Never Married"}

                </strong>

              </div>

            </div>

          </div>

          {/* CONTACT */}

          <div className="detail-section">

            <h2>Contact Information</h2>

            <div className="contact-box">

              <div>

                <span>Email</span>

                <strong>{profile.email}</strong>

              </div>

              {profile.phone && (

                <div>

                  <span>Phone</span>

                  <strong>{profile.phone}</strong>

                </div>

              )}

            </div>

          </div>

          {/* BOTTOM ACTION */}

          <div className="profile-final-action">

            <button className="final-interest-btn">

              ❤️ Send Interest to {profile.name}

            </button>

          </div>

        </div>

      </section>

    </main>
   </>
  )
}

export default ProfilesDetails
