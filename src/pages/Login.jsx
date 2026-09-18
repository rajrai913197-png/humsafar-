import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API = "https://sapta-vachan-backend.onrender.com";

function Login() {
  const navigate = useNavigate();

  const [login, setLogin] = useState({
    email: "",
    password: "",
  });

  // ================= CHANGE =================

  const handleChange = (e) => {
    setLogin({
      ...login,
      [e.target.name]: e.target.value,
    });
  };

  // ================= LOGIN =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${API}/userLogin`,
        login
      );

      console.log("LOGIN RESPONSE:", res.data);

      if (res.data.role) {
        // Save JWT token
        localStorage.setItem(
          "token",
          res.data.token
        );

        // Admin
        if (res.data.role === "admin") {
          navigate("/admin");
        }

        // Normal user
        else {
          navigate("/myprofile");
        }
      } else {
        alert("User not found");
      }

    } catch (err) {
      console.log("LOGIN ERROR:", err);

      alert(
        err.response?.data?.message ||
        "User not found"
      );
    }
  };

  return (
    <>
      <div className="login-container">

        <form
          className="login-form"
          onSubmit={handleSubmit}
        >

          <h1>
            Welcome Back
          </h1>

          <p>
            Login to your account
          </p>

          {/* EMAIL */}

          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={login.email}
            onChange={handleChange}
            required
          />

          {/* PASSWORD */}

          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={login.password}
            onChange={handleChange}
            required
          />

          {/* LOGIN BUTTON */}

          <button type="submit">
            Login
          </button>

          {/* SIGN UP */}

          <span className="signup-link">

            Don't have an account?{" "}

            <span
              onClick={() =>
                navigate("/signUp")
              }
            >
              Sign Up
            </span>

          </span>

        </form>

      </div>
    </>
  );
}

export default Login;