import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function Home() {

  const [profiles, setProfiles] = useState([]);
  const [age, setAge] = useState([]);
  const [city, setCity] = useState([]);
  const [gender, setGender] = useState([]);
  const [community, setCommunity] = useState([]);

  const [profileFilter, setProfileFilter] = useState({
    age: [],
    gender: [],
    religion: [],
    city: []
  });

  const navigate = useNavigate();



  const token = localStorage.getItem("token");

  const decoded = token ? jwtDecode(token) : null;

  const myId = decoded?.userId;

  console.log("My ID:", myId);



  const getAge = () => {

    axios.get("http://localhost:3300/ageGet")
      .then((res) => setAge(res.data))
      .catch((err) => console.log(err));

  };




  const getCity = () => {

    axios.get("http://localhost:3300/getcity")
      .then((res) => setCity(res.data))
      .catch((err) => console.log(err));

  };



  const GetUser = () => {

    if (
      profileFilter.age.length > 0 ||
      profileFilter.gender.length > 0 ||
      profileFilter.religion.length > 0 ||
      profileFilter.city.length > 0
    ) {

      

      axios.get("http://localhost:3300/filterUser", {

        params: profileFilter,

        paramsSerializer: {
          indexes: null
        }

      })

      .then((res) => {


        const otherProfiles = res.data.filter(
          (profile) => profile._id !== myId
        );

        setProfiles(otherProfiles);

      })

      .catch((err) => console.log(err));

    } else {

     

      axios.get("http://localhost:3300/getUser")

      .then((res) => {

       

        const otherProfiles = res.data.filter(
          (profile) => profile._id !== myId
        );

        setProfiles(otherProfiles);

      })

      .catch((err) => console.log(err));

    }

  };


 

  const GetGender = () => {

    axios.get("http://localhost:3300/getgender")
      .then((res) => setGender(res.data))
      .catch((err) => console.log(err));

  };


  
  const Getcommunity = () => {

    axios.get("http://localhost:3300/community")
      .then((res) => setCommunity(res.data))
      .catch((err) => console.log(err));

  };



  const ageCall = age.map((e) => {

    return (
      <option key={e} value={e}>
        {e}
      </option>
    );

  });


  

  const myCity = city.map((e) => {

    return (
      <option key={e} value={e}>
        {e}
      </option>
    );

  });



  const myGender = gender.map((e) => {

    return (
      <option key={e} value={e}>
        {e}
      </option>
    );

  });



  const myCommunity = community.map((e) => {

    return (
      <option key={e} value={e}>
        {e}
      </option>
    );

  });




  const filterHandlerAge = (e) => {

    const filterAgevalue =
      Array.from(e.target.selectedOptions)
        .map(item => item.value);

    setProfileFilter({
      ...profileFilter,
      age: filterAgevalue
    });

  };


  

  const filterHandlerCity = (e) => {

    const filterCityvalue =
      Array.from(e.target.selectedOptions)
        .map(item => item.value);

    setProfileFilter({
      ...profileFilter,
      city: filterCityvalue
    });

  };



  const filterHandlerGender = (e) => {

    const filterGendervalue =
      Array.from(e.target.selectedOptions)
        .map(item => item.value);

    setProfileFilter({
      ...profileFilter,
      gender: filterGendervalue
    });

  };



  const filterHandlerCommunity = (e) => {

    const filtercommunityvalue =
      Array.from(e.target.selectedOptions)
        .map(item => item.value);

    setProfileFilter({
      ...profileFilter,
      religion: filtercommunityvalue
    });

  };

 

  useEffect(() => {

    getAge();
    GetUser();
    getCity();
    GetGender();
    Getcommunity();

  }, []);


  console.log(profileFilter);


  return (
    <>

      {/* HERO */}

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


      {/* FILTER */}

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

            <select
              multiple
              onChange={filterHandlerGender}
            >
              {myGender}
            </select>

          </div>


          <div className="filter-field">

            <label>Age To</label>

            <select
              multiple
              onChange={filterHandlerAge}
            >
              {ageCall}
            </select>

          </div>


          <div className="filter-field">

            <label>Location</label>

            <select
              multiple
              onChange={filterHandlerCity}
            >

              <option>Any Location</option>

              {myCity}

            </select>

          </div>


          <div className="filter-field">

            <label>Community</label>

            <select
              multiple
              onChange={filterHandlerCommunity}
            >
              {myCommunity}
            </select>

          </div>


          <button
            className="filter-btn"
            onClick={GetUser}
          >
            Search Matches →
          </button>

        </div>

      </section>


      {/* PROFILES */}

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

            <div
              className="profile-card"
              key={profile._id}
            >

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
                  ♧ {profile.city}
                </p>


                <div className="profile-divider"></div>


                <div className="profile-bottom">

                  <span>
                    Profile Verified
                  </span>

                  <button
                    onClick={() =>
                      navigate(
                        `/profiledetail/${profile._id}`
                      )
                    }
                  >
                    View Profile →
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>


        {/* EXPLORE */}

        <button
          className="all-profiles-btn"
          onClick={() => navigate("/findmatches")}
        >
          Explore All Profiles →
        </button>

      </section>

    </>
  );
}

export default Home;