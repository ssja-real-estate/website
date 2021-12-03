import { elevationEffect } from "animations/motionVariants";
import { motion } from "framer-motion";
import { useHistory } from "react-router-dom";
import Strings from "global/constants/strings";
import { globalState } from "global/states/globalStates";
import {
  PreviousScreen,
  verificationState,
} from "global/states/VerificationState";
import React, { useEffect, useRef, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useRecoilValue, useSetRecoilState } from "recoil";
import UserService from "services/api/UserService/UserService";
import "./CodeVerification.css";
import Timer from "components/Timer/Timer";

const CodeVerification = () => {
  const [code, setCode] = useState("");
  const setGlobalState = useSetRecoilState(globalState);
  const state = useRecoilValue(verificationState);
  const service = useRef(new UserService());
  const mounted = useRef(true);
  const history = useHistory();

  useEffect(() => {
    return () => {
      mounted.current = false;
    };
  });

  const submitCode = async () => {
    if (state.previousScreen === PreviousScreen.Signup) {
      const newGlobalState = await service.current.verifyUser(
        state.mobile,
        code
      );
      if (newGlobalState) {
        setGlobalState(newGlobalState);
        history.push("/dashboard");
      }
    } else {
    }
  };

  return (
    <div className="code-verification-container">
      <motion.div
        variants={elevationEffect}
        initial="first"
        animate="second"
        className="code-verification card glass shadow rounded-3 py-4 px-3"
      >
        <h1 className="code-verification-title text-center">
          {Strings.codeVerification}
        </h1>
        <form className="code-verification-form">
          <Form.Control
            className="form-control rounded-3 py-2 my-3"
            name="code"
            placeholder={Strings.verificationCode}
            value={code}
            id="code"
            onChange={(e) => {
              setCode(e.currentTarget.value);
            }}
          ></Form.Control>
          <Timer
            seconds={120}
            onExpire={() => {
              service.current.signupUser(state.mobile, state.password);
            }}
          ></Timer>
          <Button
            variant="purple"
            className="w-100 rounded-3 my-3"
            type="submit"
            name="submit"
            id="submit"
            value={Strings.sajaSignup}
            onClick={(event) => {
              event.preventDefault();
              submitCode();
            }}
          >
            {Strings.sajaSignup}
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default CodeVerification;
