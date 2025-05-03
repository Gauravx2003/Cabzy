import React, { createContext } from "react";
import { UNSAFE_getTurboStreamSingleFetchDataStrategy } from "react-router-dom";

export const UserDataContext = createContext();



const UserContext = ({children}) => {
    const [user, setUser] = useState({
        fullname:{
            firstName:"",
            lastName:""
        },
        email:"",
    })


    return (
        <div>
            <UserDataContext.Provider value={[user, setUser]}>
                {children}
            </UserDataContext.Provider>
        </div>
    )
}   

export default UserContext;