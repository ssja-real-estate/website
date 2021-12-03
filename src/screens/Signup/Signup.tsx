import "./Signup.css";
import { useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { motion } from "framer-motion";
import { elevationEffect } from "../../animations/motionVariants";
import { Button, Form, InputGroup } from "react-bootstrap";
// import { useSetRecoilState } from "recoil";
// import { globalState } from "global/states/globalStates";
import Strings from "global/constants/strings";
import RegexValidator from "services/utilities/RegexValidator";
import toast from "react-hot-toast";
import UserService from "services/api/UserService/UserService";

function SignupScreen() {
  const [visibility, setVisibility] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassowrd, setRepeatPassword] = useState("");
  // const setGlobalState = useSetRecoilState(globalState);
  const history = useHistory();
  const service = useRef(new UserService());

  function passwordVisible() {
    setVisibility(!visibility);
  }

  const signupUser = async () => {
    if (password !== repeatPassowrd) {
      toast.error(Strings.invalidRepeatPassword);
    }
    if (!RegexValidator.validatePhone(mobile)) {
      toast.error(Strings.invalidPhoneNumber);
      return;
    }
    if (!RegexValidator.validatePassword(password)) {
      toast.error(Strings.invalidPassword);
      return;
    }

    await service.current.signupUser(mobile, password);
    history.push("/code");

    // if (signupState) {
    //   setGlobalState(signupState!);
    //   history.push("/dashboard");
    // }
  };

  return (
    <div className="signup-container">
      <motion.div
        variants={elevationEffect}
        initial="first"
        animate="second"
        className="signup card glass shadow rounded-3 py-4 px-3"
      >
        <h1 className="signup-title text-center">{Strings.signup}</h1>
        <form className="signup-form">
          <Form.Control
            className="form-control rounded-3 py-2 my-3"
            name="phone"
            placeholder={Strings.mobile}
            value={mobile}
            id="phone"
            onChange={(e) => {
              setMobile(e.currentTarget.value);
            }}
          />
          <Form.Control
            className="form-control rounded-3 py-2 my-3"
            type={visibility ? "text" : "password"}
            name="password"
            placeholder={Strings.password}
            value={password}
            id="password"
            onChange={(e) => {
              setPassword(e.currentTarget.value);
            }}
          />
          <Form.Control
            className="form-control rounded-3 py-2 my-3"
            type={visibility ? "text" : "password"}
            name="repeatPassword"
            placeholder={Strings.repeatPassword}
            value={repeatPassowrd}
            id="repeatPassword"
            onChange={(e) => {
              setRepeatPassword(e.currentTarget.value);
            }}
          />
          <InputGroup>
            <Form.Check
              name="visCheck"
              id="visCheck"
              checked={visibility}
              onChange={passwordVisible}
              label={Strings.showPassword}
            />
          </InputGroup>
          <Button
            variant="purple"
            className="w-100 rounded-3 my-3"
            type="submit"
            name="submit"
            id="submit"
            value={Strings.sajaSignup}
            onClick={(event) => {
              event.preventDefault();
              signupUser();
            }}
          >
            {Strings.sajaSignup}
          </Button>
          <div className="text-center">
            <span className="fw-light">{Strings.doHaveAnAccount}</span>
            <Link
              className="purple fw-bold text-decoration-none me-2"
              to="/login"
            >
              {Strings.login}
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default SignupScreen;
