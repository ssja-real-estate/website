import "./Signup.css";
import { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { motion } from "framer-motion";
import { elevationEffect } from "../../animations/motionVariants";
import TextInput from "../../components/TextInput/TextInput";
import Checkbox from "../../components/Checkbox/Checkbox";
import Button from "../../components/Button/Button";
import { useRecoilState } from "recoil";
import { isLoggedInAtom } from "../../global/globalStates";

function SignupScreen() {
    const [visibility, setVisibility] = useState(false);
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
                    <TextInput
                        className="form-control rounded-3 py-2 my-3"
                        type={visibility ? "text" : "password"}
                        name="repeatPassword"
                        placeholder="تکرار گذرواژه"
                        id="repeatPassword"
                    />
                    <Checkbox
                        className="form-check-input me-2"
                        name="visCheck"
                        id="visCheck"
                        checked={visibility}
                        onChange={passwordVisible}
                        label="نمایش گذرواژه"
                    />
                    <Button
                        className="btn btn-purple w-100 rounded-3 my-3"
                        type="submit"
                        name="submit"
                        id="submit"
                        value="ثبت نام در سامانه ثجـــا"
                        onClick={(event) => {
                            event.preventDefault();
                            setLoggedIn(true);
                            history.push("/dashboard");
                        }}
                    />
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
