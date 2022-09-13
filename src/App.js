import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./Components/Login";
import Logout from "./Components/Logout";
import Home from "./Components/Home";
import Favourite from "./Components/Favourite";
import Register from "./Components/Register";
import Header from "./Components/Header";
import User from "./Components/User";

const App = () => {
  console.log("test");
  return (
    <div>
      <Routes>
        <Route path="/" element={<Header />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="favourite" element={<Favourite />} />
          <Route path="logout" element={<Logout />} />
          <Route path="user" element={<User />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
