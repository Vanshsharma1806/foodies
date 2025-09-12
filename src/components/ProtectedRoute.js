import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext"

const ProtectedRoute = ({children}) =>{
    const {isLoggedIn} = useAuth();
    const location = useLocation();

    if(!isLoggedIn && !["/login", "/signup", "/order", "/success", "/cancel"].includes(location.pathname)){
        return <Navigate to="/login" replace/>
    }
    return children;
}

export default ProtectedRoute;