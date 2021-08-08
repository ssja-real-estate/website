import "./Login.css";
import Input from "../../components/Input/Input";
import { Link } from "react-router-dom";
import { useState } from "react";

function LoginScreen() {
    const [visibility, setVisibility] = useState(false);
    function passwordVisible() {
        setVisibility(!visibility);
    }
    return (
        <div className="login-container">
            <div className="login card rounded-3 py-4 px-3">
                <h1 className="login-title text-center">ورود</h1>
                <form className="login-form">
                    <Input
                        className="form-control rounded-3 py-2 my-3"
                        type="phone"
                        name="phone"
                        placeholder="شماره موبایل"
                        id="email"
                    />
                    <Input
                        className="form-control rounded-3 py-2 my-3"
                        type={visibility ? "text" : "password"}
                        name="password"
                        placeholder="گذرواژه"
                        id="password"
                    />
                    <label className="form-check-label" htmlFor="visCheck">
                        نمایش گذرواژه
                    </label>
                    <Input
                        className="form-check-input me-2"
                        type="checkbox"
                        name="visCheck"
                        id="visCheck"
                        checked={visibility}
                        onChange={passwordVisible}
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
                    <Input
                        className="btn btn-purple w-100 rounded-3"
                        type="submit"
                        name="submit"
                        id="submit"
                        value="ورود به سامانه ثجـــا"
                        onClick={(event) => {
                            event.preventDefault();
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
            </div>
        </div>
    );
}

export default LoginScreen;
