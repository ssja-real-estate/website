import "./Login.css";
import { Link, useHistory } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { elevationEffect } from "../../animations/motionVariants";
import { useRecoilState } from "recoil";
import { isLoggedInAtom } from "../../global/states/globalStates";
import { Button, Form, InputGroup } from "react-bootstrap";

function LoginScreen() {
    const [visibility, setVisibility] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [loggedIn, setLoggedIn] = useRecoilState(isLoggedInAtom);
    const history = useHistory();

    function passwordVisible() {
        setVisibility(!visibility);
    }
    return (
        <div className="login-container">
            <motion.div
                variants={elevationEffect}
                initial="first"
                animate="second"
                className="login card glass shadow rounded-3 py-4 px-3"
            >
                <h1 className="login-title text-center">ورود</h1>
                <form className="login-form">
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
                    <InputGroup>
                        <Form.Check
                            name="visCheck"
                            id="visCheck"
                            checked={visibility}
                            onChange={passwordVisible}
                            label="نمایش گذرواژه"
                        />
                    </InputGroup>
                    <div className="text-center my-3">
                        <span className="fw-light">
                            گذرواژه خود را فراموش کردید؟
                        </span>
                        <a
                            className="purple fw-bold text-decoration-none me-2"
                            href="/restore-password"
                        >
                            بازیابی گذرواژه
                        </a>
                    </div>
                    <Button
                        variant="purple"
                        className="w-100 rounded-3"
                        type="submit"
                        name="submit"
                        id="submit"
                        onClick={(event) => {
                            event.preventDefault();
                            setLoggedIn(true);
                            history.push("/dashboard");
                        }}
                    >
                        ورود به سامانه ثجـــا
                    </Button>
                    <div className="text-center my-3">
                        <span className="fw-light">حساب کاربری ندارید؟</span>
                        <Link
                            className="purple fw-bold text-decoration-none me-2"
                            to="/signup"
                        >
                            ثبت نام
                        </Link>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}

export default LoginScreen;
