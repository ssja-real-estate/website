import "./Login.css";
import { Link, useHistory } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { elevationEffect } from "../../animations/motionVariants";
import TextInput from "../../components/TextInput/TextInput";
import Checkbox from "../../components/Checkbox/Checkbox";
import Button from "../../components/Button/Button";
import { useRecoilState } from "recoil";
import { isLoggedIn } from "../../global/globalStates";

function LoginScreen() {
    const [visibility, setVisibility] = useState(false);
    const [loggedIn, setLoggedIn] = useRecoilState(isLoggedIn);
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
                    <TextInput
                        className="form-control rounded-3 py-2 my-3"
                        name="phone"
                        placeholder="شماره موبایل"
                        id="phone"
                    />
                    <TextInput
                        className="form-control rounded-3 py-2 my-3"
                        type={visibility ? "text" : "password"}
                        name="password"
                        placeholder="گذرواژه"
                        id="password"
                    />
                    <Checkbox
                        className="form-check-input me-2"
                        name="visCheck"
                        id="visCheck"
                        checked={visibility}
                        onChange={passwordVisible}
                        label="نمایش گذرواژه"
                    />
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
                        className="btn btn-purple w-100 rounded-3"
                        type="submit"
                        name="submit"
                        id="submit"
                        value="ورود به سامانه ثجـــا"
                        onClick={(event) => {
                            event.preventDefault();
                            setLoggedIn(true);
                            history.push("/dashboard");
                        }}
                    />
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
