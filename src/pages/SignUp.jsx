import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();

  const [sign, setSign] = useState({
    name: "",
    email: "",
    password: ""
  });

  const changeHandler = (e) => {
    setSign({
      ...sign,
      [e.target.name]: e.target.value
    });
  };

  const changeSubmit = (e) => {
    e.preventDefault();

    console.log(sign);

    axios
      .post("http://localhost:3300/createUser", sign)
      .then(() => {
        alert("Signup successful! Please login.");
        navigate("/login");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="signup-container">

      <form className="signup-form" onSubmit={changeSubmit}>

        <h1>Create Account</h1>

        <p>Sign up to get started</p>

        <input
          type="text"
          name="name"
          placeholder="Enter your name"
          value={sign.name}
          onChange={changeHandler}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={sign.email}
          onChange={changeHandler}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          value={sign.password}
          onChange={changeHandler}
          required
        />

        <button type="submit">
          Sign Up
        </button>

        <p className="login-link">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>
            Login
          </span>
        </p>

      </form>

    </div>
  );
};

export default SignUp;
