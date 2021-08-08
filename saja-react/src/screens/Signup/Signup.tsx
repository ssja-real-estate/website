import "./Signup.css";
import { useState } from "react";
import Input from "../../components/Input/Input";
import { Link } from "react-router-dom";

function SignupScreen() {
    const [visibility, setVisibility] = useState(false);
    function passwordVisible() {
        setVisibility(!visibility);
    }
    return (
        <div className="signup-container">
            <div className="signup card rounded-3 py-4 px-3">
                <h1 className="signup-title text-center">ثبت نام</h1>
                <form className="signup-form">
                    <Input
                        className="form-control rounded-3 py-2 my-3"
                        type="phone"
                        name="phone"
                        placeholder="شماره موبایل"
                        id="phone"
                    />
                    <Input
                        className="form-control rounded-3 py-2"
                        type={visibility ? "text" : "password"}
                        name="password"
                        placeholder="گذرواژه"
                        id="password"
                    />
                    <Input
                        className="form-control rounded-3 py-2 my-3"
                        type={visibility ? "text" : "password"}
                        name="password"
                        placeholder="تکرار گذرواژه"
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
                    <Input
                        className="btn btn-purple w-100 rounded-3 my-3"
                        type="submit"
                        name="submit"
                        id="submit"
                        value="ثبت نام در سامانه ثجـــا"
                        onClick={(event) => {
                            event.preventDefault();
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
            </div>
        </div>
    );
}

export default SignupScreen;
