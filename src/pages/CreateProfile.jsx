import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const API = "https://sapta-vachan-backend.onrender.com";

const CreateProfile = () => {
  const navigate = useNavigate();

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
    fatherName: "",
    motherName: "",
    familyBackground: "",
    siblings: "",
  });

  const [existingImage, setExistingImage] = useState("");

  // ================= TOKEN =================

  const token = localStorage.getItem("token");

  let id = null;

  try {
    const decoded = token ? jwtDecode(token) : null;
    id = decoded?.userId;
  } catch (error) {
    console.log("TOKEN ERROR:", error);
    localStorage.removeItem("token");
    navigate("/login");
  }

  // ================= GET PROFILE =================

  const getProfile = async () => {
    if (!id) {
      console.log("USER ID NOT FOUND");
      return;
    }

    try {
      const res = await axios.get(
        `${API}/getProfile/${id}`
      );

      console.log("EDIT PROFILE DATA:", res.data);

      const user = res.data;

      setFormData({
        name: user.name || "",
        age: user.age || "",
        gender: user.gender || "",
        city: user.city || "",
        education: user.education || "",
        profession: user.profession || "",
        religion: user.religion || "",
        bio: user.bio || "",
        image: null,
        fatherName: user.fatherName || "",
        motherName: user.motherName || "",
        familyBackground: user.familyBackground || "",
        siblings: user.siblings || "",
      });

      // ================= CLOUDINARY IMAGE =================

      if (user.image) {
        setExistingImage(user.image);
      } else {
        setExistingImage("");
      }

    } catch (error) {
      console.log(
        "GET PROFILE ERROR:",
        error.response?.data || error.message
      );
    }
  };

  // ================= PAGE LOAD =================

  useEffect(() => {
    getProfile();
  }, []);

  // ================= INPUT CHANGE =================

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    // ================= IMAGE =================

    if (name === "image") {
      const file = files?.[0];

      setFormData((prev) => ({
        ...prev,
        image: file || null,
      }));

      // Local preview before upload
      if (file) {
        setExistingImage(URL.createObjectURL(file));
      }

      return;
    }

    // ================= OTHER INPUTS =================

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ================= SUBMIT =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!id) {
      console.log("USER ID NOT FOUND");
      return;
    }

    const data = new FormData();

    data.append("name", formData.name);
    data.append("age", formData.age);
    data.append("gender", formData.gender);
    data.append("city", formData.city);
    data.append("education", formData.education);
    data.append("profession", formData.profession);
    data.append("religion", formData.religion);
    data.append("bio", formData.bio);

    // Image
    if (formData.image) {
      data.append("image", formData.image);
    }

    data.append("fatherName", formData.fatherName);
    data.append("motherName", formData.motherName);
    data.append(
      "familyBackground",
      formData.familyBackground
    );
    data.append(
      "siblings",
      formData.siblings
    );

    console.log("USER ID:", id);

    try {
      const res = await axios.put(
        `${API}/userProfile/${id}`,
        data,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      console.log(
        "PROFILE UPDATED:",
        res.data
      );

      navigate("/myprofile");

    } catch (error) {
      console.log(
        "UPDATE PROFILE ERROR:",
        error.response?.data ||
        error.message
      );
    }
  };

  return (
    <div className="create-profile">

      <div className="profile-container">

        {/* ================= BACK BUTTON ================= */}

        <button
          type="button"
          className="back-btn"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

        {/* ================= HEADING ================= */}

        <div className="profile-heading">

          <p className="small-title">
            SAPTA-VACHAN
          </p>

          <h1>
            Create Your Profile
          </h1>

          <p>
            Tell us a little about yourself and begin your
            journey towards finding your life partner.
          </p>

        </div>

        <form onSubmit={handleSubmit}>

          {/* ================= PERSONAL DETAILS ================= */}

          <div className="form-section">

            <h2>
              Personal Details
            </h2>

            <div className="form-grid">

              {/* NAME */}

              <div className="input-group">

                <label>
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />

              </div>

              {/* AGE */}

              <div className="input-group">

                <label>
                  Age
                </label>

                <input
                  type="number"
                  name="age"
                  placeholder="Enter your age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                />

              </div>

              {/* GENDER */}

              <div className="input-group">

                <label>
                  Gender
                </label>

                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Select gender
                  </option>

                  <option value="Male">
                    Male
                  </option>

                  <option value="Female">
                    Female
                  </option>

                </select>

              </div>

              {/* CITY */}

              <div className="input-group">

                <label>
                  City
                </label>

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

          {/* ================= EDUCATION & CAREER ================= */}

          <div className="form-section">

            <h2>
              Education & Career
            </h2>

            <div className="form-grid">

              {/* EDUCATION */}

              <div className="input-group">

                <label>
                  Education
                </label>

                <input
                  type="text"
                  name="education"
                  placeholder="e.g. B.Sc Computer Science"
                  value={formData.education}
                  onChange={handleChange}
                />

              </div>

              {/* PROFESSION */}

              <div className="input-group">

                <label>
                  Profession
                </label>

                <input
                  type="text"
                  name="profession"
                  placeholder="e.g. Software Developer"
                  value={formData.profession}
                  onChange={handleChange}
                />

              </div>

              {/* RELIGION */}

              <div className="input-group">

                <label>
                  Religion
                </label>

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

          {/* ================= ABOUT ================= */}

          <div className="form-section">

            <h2>
              About You
            </h2>

            {/* IMAGE */}

            <div className="input-group">

              <label>
                Profile Image
              </label>

              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
              />

              {/* IMAGE PREVIEW */}

              {existingImage && (
                <div className="image-preview">

                  <p>
                    Current Profile Image
                  </p>

                  <img
                    src={existingImage}
                    alt={
                      formData.name ||
                      "Profile"
                    }
                  />

                </div>
              )}

            </div>

            {/* BIO */}

            <div className="input-group">

              <label>
                Bio
              </label>

              <textarea
                name="bio"
                rows="5"
                placeholder="Write something about yourself..."
                value={formData.bio}
                onChange={handleChange}
              />

            </div>

          </div>

          {/* ================= FAMILY ================= */}

          <div className="form-section">

            <h2>
              Family Details
            </h2>

            <div className="form-grid">

              {/* FATHER */}

              <div className="input-group">

                <label>
                  Father's Name
                </label>

                <input
                  type="text"
                  name="fatherName"
                  placeholder="Enter father's name"
                  value={formData.fatherName}
                  onChange={handleChange}
                />

              </div>

              {/* MOTHER */}

              <div className="input-group">

                <label>
                  Mother's Name
                </label>

                <input
                  type="text"
                  name="motherName"
                  placeholder="Enter mother's name"
                  value={formData.motherName}
                  onChange={handleChange}
                />

              </div>

              {/* SIBLINGS */}

              <div className="input-group">

                <label>
                  Number of Siblings
                </label>

                <input
                  type="number"
                  name="siblings"
                  placeholder="e.g. 2"
                  value={formData.siblings}
                  onChange={handleChange}
                />

              </div>

            </div>

            {/* FAMILY BACKGROUND */}

            <div className="input-group">

              <label>
                Family Background
              </label>

              <textarea
                name="familyBackground"
                rows="4"
                placeholder="Tell us something about your family..."
                value={formData.familyBackground}
                onChange={handleChange}
              />

            </div>

          </div>

          {/* ================= SUBMIT ================= */}

          <button
            type="submit"
            className="create-btn"
          >
            Update Profile
          </button>

        </form>

      </div>

    </div>
  );
};

export default CreateProfile;