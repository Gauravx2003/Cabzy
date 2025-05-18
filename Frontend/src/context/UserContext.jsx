import React, { createContext, useState, useEffect } from "react";

export const UserDataContext = createContext();



const UserContext = ({children}) => {
    const [user, setUser] = useState();

    // Load user from localStorage when the app starts
    useEffect(() => {
      const storedUser = localStorage.getItem("user");
        if (storedUser) {
           setUser(JSON.parse(storedUser));
    }
  }, []);


    return (
        
            <UserDataContext.Provider value={{user, setUser}}>
                {children}
            </UserDataContext.Provider>
        
    )
}   

export default UserContext;