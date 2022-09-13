import React, { useContext, useState } from "react";

// create context
const LonContext = React.createContext();

// provide context
function LonContextProvider({ children }) {
  const [lon, setLon] = useState(103.825);
  const value = { lon, setLon };

  return <LonContext.Provider value={value}>{children}</LonContext.Provider>;
}

// use context
function useLonContext() {
  const context = useContext(LonContext);
  if (context === undefined) {
    throw new Error("useLonContext must be used within LonContextProvider");
  }
  return context;
}

export { LonContextProvider, useLonContext };
