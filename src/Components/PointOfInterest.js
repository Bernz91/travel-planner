import React, { useRef } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const PointOfInterest = ({
  list,
  listRef,
  handleClick,
  handleMouseEnter,
  handleMouseLeave,
  favouriteClick,
}) => {
  return (
    <div className="listOfPlaces" id="listOfPlaces" style={{ height: "84vh" }}>
      {list.map((places, index) => {
        let tempURL;
        if (places.clicked) {
          try {
            tempURL =
              process.env.REACT_APP_IMAGEKIT_URL_ENDPOINT +
              "tr:w-200,h-300,fo-auto/" +
              places.wikidata.preview.source;
          } catch (error) {
            console.log(error);
          }
        }

        let placeDetails;
        if (places.clicked) {
          try {
            placeDetails = places.wikidata.wikipedia_extracts.text;
          } catch (error) {
            console.log(error);
          }
        }

        return (
          <div key={index} className="places" ref={listRef[index]}>
            <div
              className={
                places.mouseEnter ? "list-group-item active" : "list-group-item"
              }
              onMouseOver={() => handleMouseEnter(list, index)}
              onMouseLeave={() => handleMouseLeave(list, index)}
            >
              <Row className="d-flex">
                <Col xs={11} onClick={(e) => handleClick(list, index, e)}>
                  <h4>{places.properties.name}</h4>
                </Col>

                <div onClick={(e) => favouriteClick(list, index, e)}>
                  {places.favourite ? (
                    <FavoriteIcon sx={{ color: "red" }} />
                  ) : (
                    <FavoriteBorderIcon sx={{ color: "red" }} />
                  )}
                </div>
              </Row>
              <Row className={places.clicked ? "" : "d-none"}>
                <Col xs={6} className="p-1">
                  <img src={tempURL} alt="other" />
                </Col>
                <Col>{places.clicked ? placeDetails : ""}</Col>
              </Row>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PointOfInterest;
