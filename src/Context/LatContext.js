import React, { useContext, useState } from "react";

// create context
const LatContext = React.createContext();

// provide context
function LatContextProvider({ children }) {
  const [lat, setLat] = useState(1.35);
  const value = { lat, setLat };

  return <LatContext.Provider value={value}>{children}</LatContext.Provider>;
}

// use context
function useLatContext() {
  const context = useContext(LatContext);
  if (context === undefined) {
    throw new Error("useLatContext must be used within LatContextProvider");
  }
  return context;
}

export { LatContextProvider, useLatContext };
