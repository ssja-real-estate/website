import "./Signup.css";
import { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { motion } from "framer-motion";
import { elevationEffect } from "../../animations/motionVariants";
import { useRecoilState } from "recoil";
import { isLoggedInAtom } from "../../global/globalStates";
import { Button, Form, InputGroup } from "react-bootstrap";

function SignupScreen() {
    const [visibility, setVisibility] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [loggedIn, setLoggedIn] = useRecoilState(isLoggedInAtom);
    const history = useHistory();

    function passwordVisible() {
        setVisibility(!visibility);
    }
    return (
        <div className="signup-container">
            <motion.div
                variants={elevationEffect}
                initial="first"
                animate="second"
                className="signup card glass shadow rounded-3 py-4 px-3"
            >
                <h1 className="signup-title text-center">ثبت نام</h1>
                <form className="signup-form">
                    <Form.Control
                        className="form-control rounded-3 py-2 my-3"
                        name="phone"
                        placeholder="شماره موبایل"
                        id="phone"
                    />
                    <Form.Control
                        className="form-control rounded-3 py-2 my-3"
                        type={visibility ? "text" : "password"}
                        name="password"
                        placeholder="گذرواژه"
                        id="password"
                    />
                    <Form.Control
                        className="form-control rounded-3 py-2 my-3"
                        type={visibility ? "text" : "password"}
                        name="repeatPassword"
                        placeholder="تکرار گذرواژه"
                        id="repeatPassword"
                    />
                    <InputGroup>
                        <Form.Check
                            name="visCheck"
                            id="visCheck"
                            checked={visibility}
                            onChange={passwordVisible}
                            label="نمایش گذرواژه"
                        />
                    </InputGroup>
                    <Button
                        variant=""
                        className="btn-purple w-100 rounded-3 my-3"
                        type="submit"
                        name="submit"
                        id="submit"
                        value="ثبت نام در سامانه ثجـــا"
                        onClick={(event) => {
                            event.preventDefault();
                            setLoggedIn(true);
                            history.push("/dashboard");
                        }}
                    >
                        ثبت نام در سامانه ثجـــا
                    </Button>
                    <div className="text-center">
                        <span className="fw-light">حساب کاربری دارید؟</span>
                        <Link
                            className="purple fw-bold text-decoration-none me-2"
                            to="/login"
                        >
                            ورود
                        </Link>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}

export default SignupScreen;
