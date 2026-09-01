import { useState } from "react";
import axios from "axios"
const CreateProfile = () => {
   const [formData, setFormData] = useState({

    name: "",

    age: "",

    gender: "",

    city: "",

    education: "",

    profession: "",

    religion: "",

    bio: "",

    image: null,

  });

  const handleChange = (e)=>{
     setFormData({
        ...formData,
        [e.target.name]: e.target.name === "image"
          ? e.target.files[0]
          : e.target.value,
     })
  }

  const handleSubmit = (e) => {

    e.preventDefault();


    const data = new FormData();

    data.append("name", formData.name);

    data.append("age", formData.age);

    data.append("gender", formData.gender);

    data.append("city", formData.city);

    data.append("education", formData.education);

    data.append("profession", formData.profession);

    data.append("religion", formData.religion);

    data.append("bio", formData.bio);

    data.append("image", formData.image);
   
    axios.post("http://localhost:3300/createUser",data)
    .then(()=> alert("profile created"))
    .catch(err => console.log(err))


  };

  return (

    <div className="create-profile">

      <div className="profile-container">

        <div className="profile-heading">

          <p className="small-title">SAPTA-VACHAN</p>

          <h1>Create Your Profile</h1>

          <p>

            Tell us a little about yourself and begin your journey

            towards finding your life partner.

          </p>

        </div>

        <form onSubmit={handleSubmit}>

          <div className="form-section">

            <h2>Personal Details</h2>

            <div className="form-grid">

              <div className="input-group">

                <label>Full Name</label>

                <input

                  type="text"

                  name="name"

                  placeholder="Enter your full name"

                  value={formData.name}

                  onChange={handleChange}

                  required

                />

              </div>

              <div className="input-group">

                <label>Age</label>

                <input

                  type="taxt"

                  name="age"

                  placeholder="Enter your age"

                  value={formData.age}

                  onChange={handleChange}

                  required

                />

              </div>

              <div className="input-group">

                <label>Gender</label>

                <select

                  name="gender"

                  value={formData.gender}

                  onChange={handleChange}

                  required

                >

                  <option value="">Select gender</option>

                  <option value="Male">Male</option>

                  <option value="Female">Female</option>

                </select>

              </div>

              <div className="input-group">

                <label>City</label>

                <input

                  type="text"

                  name="city"

                  placeholder="Enter your city"

                  value={formData.city}

                  onChange={handleChange}

                  required

                />

              </div>

            </div>

          </div>

          <div className="form-section">

            <h2>Education & Career</h2>

            <div className="form-grid">

              <div className="input-group">

                <label>Education</label>

                <input

                  type="text"

                  name="education"

                  placeholder="e.g. B.Sc Computer Science"

                  value={formData.education}

                  onChange={handleChange}

                />

              </div>

              <div className="input-group">

                <label>Profession</label>

                <input

                  type="text"

                  name="profession"

                  placeholder="e.g. Software Developer"

                  value={formData.profession}

                  onChange={handleChange}

                />

              </div>

              <div className="input-group">

                <label>Religion</label>

                <input

                  type="text"

                  name="religion"

                  placeholder="Enter your religion"

                  value={formData.religion}

                  onChange={handleChange}

                />

              </div>

            </div>

          </div>

          <div className="form-section">

            <h2>About You</h2>

            <div className="input-group">

              <label>Profile Image URL</label>

              <input

                type="file"

                name="image"

                placeholder="Paste your image URL"

                // value={formData.image}

                onChange={handleChange}

              />

            </div>

            <div className="input-group">

              <label>Bio</label>

              <textarea

                name="bio"

                rows="5"

                placeholder="Write something about yourself..."

                value={formData.bio}

                onChange={handleChange}

              ></textarea>

            </div>

          </div>

          <button type="submit" className="create-btn">

            Create Profile

          </button>

        </form>

      </div>

    </div>
  )
}

export default CreateProfile
