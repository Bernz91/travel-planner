import React, { useContext, useState } from "react";

// create context
const FavouriteListContext = React.createContext();

// provide context
function FavouriteListContextProvider({ children }) {
  const [favouriteList, setFavouriteList] = useState({});
  const value = { favouriteList, setFavouriteList };

  return (
    <FavouriteListContext.Provider value={value}>
      {children}
    </FavouriteListContext.Provider>
  );
}

// use context
function useFavouriteListContext() {
  const context = useContext(FavouriteListContext);
  if (context === undefined) {
    throw new Error(
      "useFavouriteListContext must be used within FavouriteListContextProvider"
    );
  }
  return context;
}

export { FavouriteListContextProvider, useFavouriteListContext };
