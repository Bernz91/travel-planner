import React from "react";
import DestinationSearch from "./Destination-Search";
import Login from "./Login";
import { useUserContext } from "../Context/UserContext";

const Home = () => {
  const { user } = useUserContext();

  return (
    <div>
      {!user && <Login />}
      {user && <DestinationSearch />}
    </div>
  );
};

export default Home;
