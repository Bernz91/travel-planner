import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import { UserContextProvider } from "./Context/UserContext";
import { DisplayPictureContextProvider } from "./Context/DisplayPictureContext";
import { PointOfInterestListContextProvider } from "./Context/PointOfInterestContext";
import { LatContextProvider } from "./Context/LatContext";
import { LonContextProvider } from "./Context/LonContext";
import { ZoomContextProvider } from "./Context/ZoomContext";
import { FavouriteListContextProvider } from "./Context/FavouriteContex";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <UserContextProvider>
      <DisplayPictureContextProvider>
        <PointOfInterestListContextProvider>
          <FavouriteListContextProvider>
            <LatContextProvider>
              <LonContextProvider>
                <ZoomContextProvider>
                  <App />
                </ZoomContextProvider>
              </LonContextProvider>
            </LatContextProvider>
          </FavouriteListContextProvider>
        </PointOfInterestListContextProvider>
      </DisplayPictureContextProvider>
    </UserContextProvider>
  </BrowserRouter>
);
