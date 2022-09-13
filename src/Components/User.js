import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import { IKImage } from "imagekitio-react";
import { useUserContext } from "../Context/UserContext";
import { useDisplayPictureContext } from "../Context/DisplayPictureContext";
import { database, storage } from "../firebase";
import { ref as databaseRef, set, child, get } from "@firebase/database";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";

const User = () => {
  const [edit, setEdit] = useState(false);
  const [email, setEmail] = useState();
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [updateProfile, setUpdateProfile] = useState(false);
  const [imagePreview, setImagePreview] = useState();

  let navigate = useNavigate();

  const { user, setUser } = useUserContext();
  const { register, handleSubmit } = useForm();
  const { displayPicture, setDisplayPicture } = useDisplayPictureContext();

  useEffect(() => {
    if (user) {
      const stateUpdateUserProfile = async () => {
        // console.log(user);
        setEmail(user.user.email);

        const dbRef = databaseRef(database);
        await get(child(dbRef, `user/${user.user.uid}/userDetails`)).then(
          (data) => {
            if (data.exists()) {
              setFirstName(data.val().firstName);
              setLastName(data.val().lastName);
              const tempURL = data.val().displayPicture;
              const truncatedURL = tempURL.split(
                "https://firebasestorage.googleapis.com/v0/b/travel-planner-c05b0.appspot.com/"
              );
              setDisplayPicture(truncatedURL[1]);
            }
          }
        );
      };
      stateUpdateUserProfile();
    }
  }, [updateProfile]);

  const onSubmit = (data) => {
    // console.log(data);

    if (data.firstName !== "") {
      const firstNameRef = databaseRef(
        database,
        `user/${user.user.uid}/userDetails/firstName`
      );
      set(firstNameRef, data.firstName);
    }

    if (data.lastName !== "") {
      const lastNameRef = databaseRef(
        database,
        `user/${user.user.uid}/userDetails/lastName`
      );
      set(lastNameRef, data.lastName);
    }

    if (data.displayPicture.length !== 0) {
      const fileRef = storageRef(
        storage,
        `user/${user.user.uid}/images/displayPicture`
      );
      uploadBytes(fileRef, data.displayPicture[0]).then(() => {
        getDownloadURL(fileRef).then((downloadUrl) => {
          const displayPictureRef = databaseRef(
            database,
            `user/${user.user.uid}/userDetails/displayPicture`
          );
          set(displayPictureRef, downloadUrl);
          const truncatedURL = downloadUrl.split(
            "https://firebasestorage.googleapis.com/v0/b/travel-planner-c05b0.appspot.com/"
          );
          user.user.photoUrl = truncatedURL[1];
          setDisplayPicture(truncatedURL[1]);
        });
      });
    }
    updateProfile ? setUpdateProfile(false) : setUpdateProfile(true);
    setEdit(false);
  };

  const onEdit = () => {
    edit ? setEdit(false) : setEdit(true);
    setImagePreview("");
  };

  const onPreview = (e) => {
    if (e.target.files[0]) {
      // console.log("picture: ", e.target.files);
      const fileRef = storageRef(
        storage,
        `user/${user.user.uid}/images/displayPicturePreview`
      );
      uploadBytes(fileRef, e.target.files[0]).then(() => {
        getDownloadURL(fileRef).then((downloadUrl) => {
          const truncatedURL = downloadUrl.split(
            "https://firebasestorage.googleapis.com/v0/b/travel-planner-c05b0.appspot.com/"
          );
          const url =
            process.env.REACT_APP_IMAGEKIT_URL_ENDPOINT +
            "tr:w-200,h-200,r-max,fo-auto/" +
            truncatedURL[1];
          setImagePreview(url);
        });
      });
    }
  };

  // console.log(imagePreview);

  return (
    <div>
      {!user ? (
        <div className="justify-center">
          Please <Link to="/login"> login</Link> to continue
        </div>
      ) : (
        // navigate("/login")
        <Container fluid className="justify-center" style={{ width: "40vw" }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col className="p-5 text-center">
                {imagePreview === "" || imagePreview === undefined ? (
                  displayPicture ? (
                    <img
                      src={`${process.env.REACT_APP_IMAGEKIT_URL_ENDPOINT}tr:w-200,h-200,r-max,fo-auto/${displayPicture}`}
                      alt="none"
                    />
                  ) : (
                    <IKImage
                      urlEndpoint={process.env.REACT_APP_IMAGEKIT_URL_ENDPOINT}
                      path="default-picture1.jpg"
                      transformation={[
                        {
                          height: 200,
                          width: 200,
                          radius: "max",
                          focus: "auto",
                        },
                      ]}
                    />
                  )
                ) : (
                  <img src={imagePreview} alt="none" />
                )}
              </Col>
            </Row>
            <Row>
              <Col className={edit ? "" : "d-none"}>
                <input
                  type="file"
                  name="displayPicture"
                  {...register("displayPicture")}
                  onChange={onPreview}
                />
              </Col>
            </Row>

            <Row>
              <Col className="text-right">First Name:</Col>
              <Col>
                {edit ? (
                  <input
                    placeholder={
                      firstName === null ? "Enter First Name" : firstName
                    }
                    {...register("firstName")}
                  ></input>
                ) : (
                  firstName
                )}
              </Col>
            </Row>
            <Row>
              <Col className="text-right">Last Name:</Col>
              <Col>
                {edit ? (
                  <input
                    placeholder={
                      lastName === null ? "Enter Last Name" : lastName
                    }
                    {...register("lastName")}
                  ></input>
                ) : (
                  lastName
                )}
              </Col>
            </Row>

            <Row>
              <Col className="text-right">Email:</Col>
              <Col>{email}</Col>
            </Row>

            <Row>
              <Col className="p-4 text-right">
                {edit ? (
                  <div>
                    <Button type="submit">Update</Button>
                    <Button onClick={onEdit}>Cancel</Button>
                  </div>
                ) : (
                  <Button onClick={onEdit}>Edit</Button>
                )}
              </Col>
            </Row>
          </form>
        </Container>
      )}
    </div>
  );
};

export default User;
