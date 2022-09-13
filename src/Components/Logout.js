import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../Context/UserContext";
import { usePointOfInterestListContext } from "../Context/PointOfInterestContext";
import { useLatContext } from "../Context/LatContext";
import { useLonContext } from "../Context/LonContext";
import { useZoomContext } from "../Context/ZoomContext";
import { useFavouriteListContext } from "../Context/FavouriteContex";

const Logout = () => {
  const { handleSubmit } = useForm();
  let navigate = useNavigate();
  const { setUser } = useUserContext();
  const { setPointOfInterestList } = usePointOfInterestListContext();
  const { setLat } = useLatContext();
  const { setLon } = useLonContext();
  const { setZoom } = useZoomContext();
  const { setFavouriteList } = useFavouriteListContext();

  const onSubmit = async () => {
    signOut(auth)
      .then(() => {
        alert("sign out successful");
        navigate("/login");
        setUser();
        setPointOfInterestList([]);
        setLat(1.35);
        setLon(103.825);
        setZoom(10.5);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="p-0">
      <div className="p-0" onClick={handleSubmit(onSubmit)}>
        Logout
      </div>
    </div>
  );
};

export default Logout;
