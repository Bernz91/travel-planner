import React from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import { ref as databaseRef, set } from "@firebase/database";
import { database } from "../firebase";
import { useUserContext } from "../Context/UserContext";

const Register = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const { setUser } = useUserContext();

  let navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      alert("You are registered!");
      navigate("/home");
      const user = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      ).then((userCredential) => {
        // updateProfile(auth.currentUser, {
        //   displayName: data.firstName,
        // });
        setUser({ user: userCredential.user });
        const firstNameRef = databaseRef(
          database,
          `user/${userCredential.user.uid}/userDetails/firstName`
        );
        set(firstNameRef, data.firstName);

        const lastNameRef = databaseRef(
          database,
          `user/${userCredential.user.uid}/userDetails/lastName`
        );
        set(lastNameRef, data.lastName);
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <Container fluid className="justify-center" style={{ width: "40vw" }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col>
              First Name:
              <input
                placeholder="Joe"
                {...register("firstName", {
                  required: "required",
                  pattern: {
                    value: /^[A-Za-z]+$/i,
                    message: "Please enter letters only",
                  },
                })}
              />
              <p>{errors.firstName?.message}</p>
            </Col>
            <Col>
              Last Name:
              <input
                placeholder="Doe"
                {...register("lastName", {
                  required: "required",
                  pattern: {
                    value: /^[A-Za-z]+$/i,
                    message: "Please enter letters only",
                  },
                })}
              />
              <p>{errors.lastName?.message}</p>
            </Col>
          </Row>
          <Row>
            <Col>
              Email:
              <input
                placeholder="joedoe@gmail.com"
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
            </Col>
          </Row>
          <Row>
            <Col>
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
            </Col>
          </Row>
          <Row>
            <Col>
              <input type="submit" />
            </Col>
          </Row>
        </form>

        <Row>
          <Col>
            Already have an account?
            <Link to="/Login"> Click here to login</Link>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
export default Register;
