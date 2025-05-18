import React, { createContext,  useState, useEffect } from 'react';

export const CaptainDataContext = createContext();

const CaptainContext = ({ children }) => {
   const [captain, setCaptain] = useState(null);

   // Load user from localStorage when the app starts
       useEffect(() => {
         const storedCaptain = localStorage.getItem("captain");
           if (storedCaptain) {
              setCaptain(JSON.parse(storedCaptain));
       }
     }, []);

    return (
        <CaptainDataContext.Provider value={{captain, setCaptain}}>
            {children}
        </CaptainDataContext.Provider>
    );
};

export default CaptainContext;
