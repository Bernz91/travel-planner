import React, { useContext, useState } from "react";

// create context
const DisplayPictureContext = React.createContext();

// provide context
function DisplayPictureContextProvider({ children }) {
  const [displayPicture, setDisplayPicture] = useState();
  const value = { displayPicture, setDisplayPicture };

  return (
    <DisplayPictureContext.Provider value={value}>
      {children}
    </DisplayPictureContext.Provider>
  );
}

// use context
function useDisplayPictureContext() {
  const context = useContext(DisplayPictureContext);
  if (context === undefined) {
    throw new Error("useUserContext must be used within DisplayPictureContextProvider");
  }
  return context;
}

export { DisplayPictureContextProvider, useDisplayPictureContext };
