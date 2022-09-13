import React from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, database } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useUserContext } from "../Context/UserContext";
import { useDisplayPictureContext } from "../Context/DisplayPictureContext";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import { ref as databaseRef, get, child } from "@firebase/database";

const Login = () => {
  const { setUser } = useUserContext();
  const { setDisplayPicture } = useDisplayPictureContext();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  let navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const firebaseUser = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      if (firebaseUser) {
        setUser(firebaseUser);
      }
      const wait = async () => {
        navigate("/home");

        const dbRef = databaseRef(database);
        await get(
          child(
            dbRef,
            `firebaseUser/${firebaseUser.firebaseUser.uid}/userDetails`
          )
        ).then((data) => {
          if (data.exists()) {
            const tempURL = data.val().displayPicture;
            const truncatedURL = tempURL.split(
              "https://firebasestorage.googleapis.com/v0/b/travel-planner-c05b0.appspot.com/"
            );
            setDisplayPicture(truncatedURL[1]);
          }
        });
      };
      wait();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <Container fluid className="justify-center" style={{ width: "40vw" }}>
        <Row>
          <Col>
            <h1>Login</h1>
          </Col>
        </Row>
        <Row>
          <Col>
            <form onSubmit={handleSubmit(onSubmit)}>
              Email:
              <input
                placeholder="joe@gmail.com"
                {...register("email", {
                  required: "Email Address is required",
                  pattern: {
                    value:
                      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                    message: "Please enter a valid email",
                  },
                })}
              />
              <p>{errors.email?.message}</p>
              Password:
              <input
                type="password"
                {...register("password", {
                  required: "You must specify a password",
                  minLength: {
                    value: 8,
                    message: "Password must have at least 8 characters",
                  },
                })}
              />
              <p>{errors.password?.message}</p>
              <input type="submit" name="Login" />
            </form>
          </Col>
        </Row>
        <Row>
          <Col>
            Do not have an account? Click here to
            <Link to="/Register"> register</Link>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
