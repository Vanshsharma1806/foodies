import { createContext, useContext, useState } from "react";

const AuthContext = createContext();
export const AuthProvider = ({children})=>{

    const [user, setUser] = useState(()=>{
        const saved = localStorage.getItem("user");
        return saved ? JSON.parse(saved): null;
    });

    const signup = async (username,email, password) => {
        try{
            const res = await fetch("http://localhost:8080/api/auth/signup", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ username, email, password}),
            });
            
            const message = res.text();
            return { success: true, message };
        }catch(err){
            return { success: false, message: err.message };

        }
    }

    const login = async (email, password) =>{
        try{
            const res = await fetch("http://localhost:8080/api/auth/login",{
                method: "POST",
                headers : {
                    "Content-Type" : "application/json",
                },
                body: JSON.stringify({email, password}),
            });
            if(!res.ok){
                const errorData = await res.json();
                throw new Error(errorData.message || "Login Failed");
            }
            
            const data = await res.json();
            console.log(data);
            const userData = {
                id: data.id,
                username: data.username,
                email: data.email,
                token: data.token
            }
            setUser(userData);
            localStorage.setItem("user", JSON.stringify(userData));
            return {success : true};
        }catch (err){
            return {success : false, message : err.message}
        }
    }

    const logout = ()=>{
        setUser(null);
        localStorage.removeItem("user");
    }

    const isLoggedIn = !! user;

    return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);
