import axios from "axios"
import { useState } from "react"
import { useNavigate } from "react-router-dom"


function Login() {
 const navigate =  useNavigate()
 const [login,setLogin]=useState({
    email : "",
    password : ""
  })
  const handleChange = (e)=>{
      setLogin({
        ...login,
        [e.target.name] : e.target.value
      })
  }
 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post(
      "http://localhost:3300/userLogin",
      login
    );

    console.log(res.data);

    if (res.data.role) {
      localStorage.setItem("token", res.data.token);

      if (res.data.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/myprofile");
      }
    } else {
      alert("User not found");
    }

  } catch (err) {
    console.log(err);

    alert(
      err.response?.data?.message ||
      "User not found "
    );
  }
};
  return (
    <>
    <div className="login-container">

      <form className="login-form" onSubmit={handleSubmit}>

        <h1>Welcome Back</h1>

        <p>Login to your account</p>

        <input

          type="taxt"

          name="email"

          placeholder="Enter your email"

          value={login.email}

          onChange={handleChange}

          required

        />

        <input

          type="taxt"

          name="password"

          placeholder="Enter your password"

          value={login.password}

          onChange={handleChange}

          required

        />

        <button type="submit" onChange={()=> navigate("/createprofile")}>

          Login

        </button>

        <span className="signup-link">

          Don't have an account?{" "}

          <span onClick={()=> navigate("/signUp")}>

            Sign Up

          </span>

        </span>

      </form>

    </div>
    </>
  )
}

export default Login
