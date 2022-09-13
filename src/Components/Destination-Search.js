import React, { useState, useEffect, createRef } from "react";
import { Formik, Form, Field } from "formik";
import axios from "axios";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Map from "./Map";
import PointOfInterest from "./PointOfInterest";
import { ref as databaseRef, set, child, remove } from "firebase/database";
import { database } from "../firebase";
import { useUserContext } from "../Context/UserContext";
import { usePointOfInterestListContext } from "../Context/PointOfInterestContext";
import { useLatContext } from "../Context/LatContext";
import { useLonContext } from "../Context/LonContext";
import { useZoomContext } from "../Context/ZoomContext";
import { useFavouriteListContext } from "../Context/FavouriteContex";

const DestinationSearch = () => {
  const { lat, setLat } = useLatContext();
  const { lon, setLon } = useLonContext();
  const { zoom, setZoom } = useZoomContext();
  const [destinationSearch, setDestinationSearch] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [mouseEnter, setMouseEnter] = useState(-1);
  const [favourite, setFavourite] = useState(false);
  const { favouriteList, setFavouriteList } = useFavouriteListContext();
  // const [favouriteList, setFavouriteList] = useState({});
  const { pointOfInterestList, setPointOfInterestList } =
    usePointOfInterestListContext();
  const [pointOfInterestRefList, setPointOfInterestRefList] = useState([]);

  const { user } = useUserContext();

  useEffect(() => {
    const length = pointOfInterestList.length;
    // console.log("creating refList");
    // console.log(pointOfInterestList.length, pointOfInterestList);
    setPointOfInterestRefList(
      Array(length)
        .fill()
        .map((_, i) => createRef())
    );
    // console.log(pointOfInterestRefList.length);
  }, [pointOfInterestList]);

  // const ref = useRef(null);

  const handleClick = (list, index, e, refList) => {
    e.preventDefault();
    // console.log("click");

    let refListLength;
    try {
      refListLength = refList.length;
    } catch {
      refListLength = 0;
    }

    if (refListLength !== 0) {
      refList[index].current.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    }

    let copy = list;

    if (copy[index].clicked === true && refListLength !== 0) {
      return;
    } else if (copy[index].clicked === true && refListLength === 0) {
      copy[index].clicked = false;
      setPointOfInterestList(copy);
      clicked ? setClicked(false) : setClicked(true);
    } else if (Object.keys(list[index].wikidata).length === 0) {
      // console.log(copy);
      copy[index].clicked = true;
      axios
        .get(
          `https://api.opentripmap.com/0.1/en/places/xid/${list[index].properties.xid}?apikey=${process.env.REACT_APP_TRIMAP_API_KEY}`
        )
        .then((res) => res.data)
        .then((res) => {
          // console.log(res);
          copy[index].wikidata = res;
          // console.log(copy);
          setPointOfInterestList(copy);
          clicked ? setClicked(false) : setClicked(true);
        });
    } else {
      copy[index].clicked = true;
      setPointOfInterestList(copy);
      clicked ? setClicked(false) : setClicked(true);
    }
  };

  // useEffect(() => {
  //   setPointOfInterestDetails(pointOfInterestList);
  // }, [pointOfInterestList]);

  const handleMouseEnter = (list, index) => {
    let copy = list;
    copy[index].mouseEnter = true;
    setPointOfInterestList(copy);
    setMouseEnter(index);
  };

  const handleMouseLeave = (list, index) => {
    let copy = list;
    copy[index].mouseEnter = false;
    setPointOfInterestList(copy);
    setMouseEnter(-1);
  };

  const favouriteClick = (list, index, e) => {
    e.preventDefault();
    // console.log("fav clicked");
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

    // avoid duplicate
    if (list[index].properties.xid in favouriteList && copy[index].favourite) {
      return;
    }

    let favouriteListCopy = favouriteList;

    // set state for favourite list in the format of xid:{data}
    if (copy[index].favourite) {
      favouriteListCopy[list[index].properties.xid] = list[index];
      setFavouriteList(favouriteListCopy);
    }

    if (
      copy[index].favourite === true &&
      Object.keys(list[index].wikidata).length === 0
    ) {
      // console.log(copy);
      axios
        .get(
          `https://api.opentripmap.com/0.1/en/places/xid/${list[index].properties.xid}?apikey=${process.env.REACT_APP_TRIMAP_API_KEY}`
        )
        .then((res) => res.data)
        .then((res) => {
          // console.log(res);
          copy[index].wikidata = res;
          setPointOfInterestList(copy);
          copy[index].mouseEnter = false;
          // copy[index].clicked = false;
          set(favouriteListRef, copy[index]);
        });
    } else if (copy[index].favourite === true) {
      setPointOfInterestList(copy);
      copy[index].mouseEnter = false;
      // copy[index].clicked = false;
      set(favouriteListRef, copy[index]);
    } else {
      delete favouriteListCopy[list[index].properties.xid];
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
      <Container fluid className="p-0" style={{ heigh: "94vh" }}>
        <Row className="p-0 m-0" style={{ width: "100vw" }}>
          <Col sm={8} className="p-0">
            <Map
              lng={lon}
              lat={lat}
              zoom={zoom}
              list={pointOfInterestList}
              listRef={pointOfInterestRefList}
              handleClick={handleClick}
              handleMouseEnter={handleMouseEnter}
              handleMouseLeave={handleMouseLeave}
              mouseEnter={mouseEnter}
              destinationSearch={destinationSearch}
            />
          </Col>
          <Col className="p-0">
            <Formik
              initialValues={{ city: "", type: "natural" }}
              onSubmit={(values, { setSubmitting }) => {
                // setCity(values.city);
                // console.log(values);

                axios
                  .get(
                    `https://api.opentripmap.com/0.1/en/places/geoname?name=${values.city}&apikey=${process.env.REACT_APP_TRIMAP_API_KEY}`
                  )
                  .then((response) => response.data)
                  .then((res) => {
                    // console.log(res);
                    setLat(res.lat);
                    setLon(res.lon);

                    //radius
                    // axios
                    //   .get(
                    //     `https://api.opentripmap.com/0.1/en/places/radius?radius=500&lon=${res.lon}&lat=${res.lat}&apikey=${process.env.REACT_APP_TRIMAP_API_KEY}`
                    //   )
                    //   .then((response) => {
                    //     console.log(response);
                    //   })

                    axios
                      .get(
                        `https://api.opentripmap.com/0.1/en/places/bbox?lon_min=${
                          res.lon - 0.026
                        }&lon_max=${res.lon + 0.026}&lat_min=${
                          res.lat - 0.012
                        }&lat_max=${res.lat + 0.012}&kinds=${
                          values.type
                        }&limit=50&apikey=${
                          process.env.REACT_APP_TRIMAP_API_KEY
                        }`
                      )
                      .then((response) => {
                        const places = response.data.features;
                        const temp = [];

                        // const url = [];

                        for (let i = 0; i < places.length; i++) {
                          if (
                            i === 0 ||
                            places[i].properties.wikidata !==
                              places[i - 1].properties.wikidata
                          ) {
                            const internal = {
                              clicked: false,
                              wikidata: {},
                              mouseEnter: false,
                              favourite: false,
                            };
                            let combined = { ...places[i], ...internal };
                            temp.push(combined);
                          }
                        }
                        // console.log(temp);
                        setZoom(14);
                        setPointOfInterestList(temp);
                        destinationSearch
                          ? setDestinationSearch(false)
                          : setDestinationSearch(true);
                      });
                  });
                setSubmitting(false);
              }}
            >
              {({ isSubmitting }) => (
                <Form
                  className="pl-2 pr-2 pb-2 pt-1"
                  style={{ height: "10vh" }}
                >
                  <Field
                    type="text"
                    name="city"
                    placeholder="Enter target destination name"
                  />
                  <Field name="type" as="select" className="my-select">
                    <option value="natural">Natural</option>
                    <option value="historic">Historical</option>
                    <option value="cultural">Cultural</option>
                    <option value="amusements">Amusements</option>
                    <option value="accomodations">Accomodations</option>
                    <option value="foods">Food</option>
                    <option value="shops">Shop</option>
                    <option value="churches">Church</option>
                  </Field>
                  <button type="submit" disabled={isSubmitting}>
                    Submit
                  </button>
                </Form>
              )}
            </Formik>
            <div className="pl-2 pr-2" style={{ height: "84vh" }}>
              <PointOfInterest
                list={pointOfInterestList}
                listRef={pointOfInterestRefList}
                handleClick={handleClick}
                handleMouseEnter={handleMouseEnter}
                handleMouseLeave={handleMouseLeave}
                favouriteClick={favouriteClick}
              />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default DestinationSearch;
