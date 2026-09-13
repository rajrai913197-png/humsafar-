import { Navigate } from "react-router-dom"

const ProfileProtect = ({children}) => {
//   const navigate = useNavigate(
   const token =  localStorage.getItem("token")
   if(!token){
      return  <Navigate to='/login' />
   } else {
      return children
   }
 
}

export default ProfileProtect