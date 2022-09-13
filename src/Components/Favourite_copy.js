import React, { useState, useEffect } from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import {
  ref as databaseRef,
  child,
  remove,
  onChildAdded,
} from "firebase/database";
import { database } from "../firebase";
import { useUserContext } from "../Context/UserContext";
import { useFavouriteListContext } from "../Context/FavouriteContex";
import Login from "./Login";

const FavouritePage2 = (handleClick) => {
  const [list, setList] = useState([]);
  const { user } = useUserContext();
  const [favourite, setFavourite] = useState(true);

  useEffect(() => {
    if (user) {
      const dbRef = databaseRef(database, `user/${user.user.uid}/favourite/`);
      setList([]);
      // onChildAdded will return data for every child at the reference and every subsequent new child
      onChildAdded(dbRef, (data) => {
        // Add the subsequent child to local component state, initialising a new array to trigger re-render
        // console.log(data.val());
        setList((prevState) =>
          // Store message key so we can use it as a key in our list items when rendering messages
          [...prevState, data.val()]
        );
      });
      // console.log(list);
    }
  }, [favourite]);

  const favouriteClick = (index, e) => {
    e.preventDefault();

    let copy = list;
    copy[index].favourite
      ? (copy[index].favourite = false)
      : (copy[index].favourite = true);

    // for rendering
    favourite ? setFavourite(false) : setFavourite(true);

    //firebase folder path
    const favouriteListRef = databaseRef(
      database,
      `user/${user.user.uid}/favourite/${list[index].properties.xid}`
    );

    if (copy[index].favourite === false) {
      const dbRef = databaseRef(database);
      remove(
        child(
          dbRef,
          `user/${user.user.uid}/favourite/${list[index].properties.xid}`
        )
      );

      // setPointOfInterestList(copy);
    }
  };

  return (
    <div>
      {!user && <Login />}
      {user && (
        <div className="listOfPlaces" id="listOfPlaces">
          {list.length === 0
            ? ""
            : list.map((xid, index) => {
                let tempURL;

                try {
                  tempURL =
                    process.env.REACT_APP_IMAGEKIT_URL_ENDPOINT +
                    "tr:w-220,h-300,fo-auto/" +
                    xid.wikidata.preview.source;
                } catch (error) {
                  console.log(error);
                }

                // let placeDetails;

                //   try {
                //     placeDetails = xid.wikidata.wikipedia_extracts.text;
                //   } catch (error) {
                //     console.log(error);
                //   }

                return (
                  <div key={index} className="xid">
                    <div
                      className={
                        xid.mouseEnter
                          ? "list-group-item active"
                          : "list-group-item"
                      }
                      // onMouseOver={() => handleMouseEnter(list, index)}
                      // onMouseLeave={() => handleMouseLeave(list, index)}
                    >
                      <Row className="d-flex">
                        <Col xs={2} className="p-1 text-center">
                          <img src={tempURL} alt="other" />
                        </Col>
                        <Col
                          xs={9}
                          onClick={(e) => handleClick(list, index, e)}
                        >
                          <Row>
                            <Col>
                              <h4>{xid.properties.name}</h4>
                            </Col>
                          </Row>
                          <Row>
                            <Col>
                              <p>
                                <b>Tags:</b>{" "}
                                {xid.wikidata.kinds.split(",").join(", ")}
                              </p>
                              <p>
                                <b>Location:</b> {xid.wikidata.address.city},{" "}
                                {xid.wikidata.address.state},{" "}
                                {xid.wikidata.address.country}
                              </p>
                              <p>
                                <b>Description:</b>{" "}
                                {xid.wikidata.wikipedia_extracts.text}
                              </p>
                              <p>
                                Wikipedia Link:{" "}
                                <a
                                  href={xid.wikidata.wikipedia}
                                  target="_blank"
                                >
                                  {xid.wikidata.wikipedia}
                                </a>
                              </p>
                            </Col>
                          </Row>
                        </Col>

                        <Col
                          className="text-right"
                          onClick={(e) => favouriteClick(index, e)}
                        >
                          {xid.favourite ? (
                            <FavoriteIcon sx={{ color: "red" }} />
                          ) : (
                            <FavoriteBorderIcon sx={{ color: "red" }} />
                          )}
                        </Col>
                      </Row>
                    </div>
                  </div>
                );
              })}
        </div>
      )}
    </div>
  );
};

export default FavouritePage2;
