import React, { useContext, useState } from "react";

// create context
const ZoomContext = React.createContext();

// provide context
function ZoomContextProvider({ children }) {
  const [zoom, setZoom] = useState(10.5);
  const value = { zoom, setZoom };

  return <ZoomContext.Provider value={value}>{children}</ZoomContext.Provider>;
}

// use context
function useZoomContext() {
  const context = useContext(ZoomContext);
  if (context === undefined) {
    throw new Error("useZoomContext must be used within ZoomContextProvider");
  }
  return context;
}

export { ZoomContextProvider, useZoomContext };
