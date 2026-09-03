import { Routes,Route } from "react-router-dom"
import MainLayout from "./Layouts/MainLayout"
import Home from "./pages/Home"
import FindMatches from "./pages/FindMatches"
import Interests from "./pages/ Interests"
import Chat from "./pages/Chat"
import Myprofile from "./pages/Myprofile"
import Notifications from "./pages/Notifications"
import CreateProfile from "./pages/CreateProfile"
import ProfilesDetails from "./pages/ProfilesDetails"
import SignUp from "./pages/SignUp"
import Login from "./pages/Login"
function App() {
  return (
    <>
    <Routes >
     <Route path="/" element={<MainLayout />} >
     <Route   index element={<Home />} />
     <Route path="home" element= {<Home />} />
     <Route path="findmatches" element = {<FindMatches />} />
     <Route path="interests" element = {<Interests />} />
      <Route path="messages" element = {<Chat />} />
      <Route path="notification" element = {<Notifications />} />
      <Route path="myprofile" element = {<Myprofile />} />
      <Route path="createprofile" element = {<CreateProfile />} />
      <Route path="profiledetail/:id" element = {<ProfilesDetails />} />
      <Route path="signup" element ={<SignUp />} />
      <Route path = "login" element = {<Login />} />
     </Route>
    </Routes>
    </>
  )
}

export default App

