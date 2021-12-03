import { elevationEffect } from "animations/motionVariants";
import { motion } from "framer-motion";
import Strings from "global/constants/strings";
import {
  PreviousScreen,
  verificationState,
} from "global/states/VerificationState";
import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useRecoilValue } from "recoil";
import "./CodeVerification.css";

const CodeVerification = () => {
  const [code, setCode] = useState("");
  const state = useRecoilValue(verificationState);

  const submitCode = () => {
    if (state.previousScreen === PreviousScreen.Signup) {
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
