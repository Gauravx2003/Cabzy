import React, { createContext,  useState } from 'react';

export const CaptainDataContext = createContext();

const CaptainContext = ({ children }) => {
   const [captain, setCaptain] = useState({
           fullname:{
               firstname:"",
               lastname:""
           },
           email:"",
           vehicle:{
               type:"",
               model:"",
               plate:"",
               capacity:"",
           }

       })

    return (
        <CaptainDataContext.Provider value={{captain, setCaptain}}>
            {children}
        </CaptainDataContext.Provider>
    );
};

export default CaptainContext;
