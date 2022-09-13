import React, { useContext, useState } from "react";

// create context
const PointOfInterestListContext = React.createContext();

// provide context
function PointOfInterestListContextProvider({ children }) {
  const [pointOfInterestList, setPointOfInterestList] = useState([]);
  const value = { pointOfInterestList, setPointOfInterestList };

  return (
    <PointOfInterestListContext.Provider value={value}>
      {children}
    </PointOfInterestListContext.Provider>
  );
}

// use context
function usePointOfInterestListContext() {
  const context = useContext(PointOfInterestListContext);
  if (context === undefined) {
    throw new Error(
      "usePointOfInterestListContext must be used within PointOfInterestListContextProvider"
    );
  }
  return context;
}

export { PointOfInterestListContextProvider, usePointOfInterestListContext };
