import React from "react";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Outlet, Link } from "react-router-dom";
import Logout from "./Logout";
import { IKImage } from "imagekitio-react";
import { useUserContext } from "../Context/UserContext";
import { useDisplayPictureContext } from "../Context/DisplayPictureContext";

const Header = () => {
  const { user } = useUserContext();
  const { displayPicture } = useDisplayPictureContext();

  
  return (
    <div>
      <Container>
        <Row className="header">
          <Col
            xs={7}
            className="text-left pl-4 align-items-center align-self-center"
          >
            <Link to="/">Travel-planner</Link>
          </Col>

          {user && (
            <Col>
              <Link to="/favourite">Favourite</Link>
            </Col>
          )}

          {user && (
            <Col>
              <Link to="/user">
                {displayPicture && (
                  <img
                    src={`${process.env.REACT_APP_IMAGEKIT_URL_ENDPOINT}tr:w-35,h-35,r-max,fo-auto/${displayPicture}`}
                    alt="none"
                  />
                )}
                {!displayPicture && (
                  <IKImage
                    urlEndpoint={process.env.REACT_APP_IMAGEKIT_URL_ENDPOINT}
                    path="default-picture1.jpg"
                    transformation={[
                      {
                        height: 35,
                        width: 35,
                        radius: "max",
                        focus: "auto",
                      },
                    ]}
                  />
                )}
              </Link>
            </Col>
          )}
          {user && (
            <Col>
              <Logout />
            </Col>
          )}
        </Row>
      </Container>
      <Outlet />
    </div>
  );
};

export default Header;
