import { AxiosError, AxiosResponse } from "axios";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import * as ImIcon from "react-icons/im";
import { useSetRecoilState } from "recoil";
import CustomModal from "../../components/modal/CustomModal";
import ModalInfo from "../../components/modal/ModalInfo";
import Strings from "../../data/strings";
import { verificationState } from "../../global/states/VerificationState";
import UserService from "../../services/api/UserService/UserService";
import RegexValidator from "../../utilities/RegexValidator";

const Signup: NextPage = () => {
  const router = useRouter();
  const [visibility, setVisibility] = useState(false);
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassowrd, setRepeatPassword] = useState("");
  const [errorForm, setErroFrorm] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [passError, setPassError] = useState("");
  const [isSignUp, setIsignUp] = useState(false);
  const setVerificationState = useSetRecoilState(verificationState);

  const service = useRef(new UserService());

  function passwordVisible() {
    setVisibility(!visibility);
  }

  const signupUser = async () => {
    const valid = RegexValidator.validatePhone(mobile);
    if (!valid.isCheck) {
      // alert("2222222222");
      setMobileError(valid.error);
      return;
    } else {
      setMobileError("");
    }

    if (!RegexValidator.validatePassword(password)) {
      setPassError(Strings.invalidPassword);
      return;
    }
    if (password !== repeatPassowrd) {
      // toast.error(Strings.invalidRepeatPassword);
      setErroFrorm(Strings.invalidRepeatPassword);
      return;
    }
    try {
      await service.current.signupUser(mobile, password);
      setIsignUp(true);
    } catch (error) {
      console.log(error);
      setErroFrorm(error as string);
      alert(error);
    }

    // setVerificationState({
    //   mobile: mobile,
    //   password: password,
    //   previousScreen: PreviousScreen.Signup,
    // });
    // history.push("/code", {});
  };
  return (
    <div className="">
      <ModalInfo
        show={isSignUp}
        cancelTitle="ورود"
        handleClose={() => {
          setIsignUp(false);
          router.push("/login");
        }}
      >
        <div className="text-center border border-green-500 bg-green-200 p-2 rounded-lg">
          <div className="p-2">ثبت نام با موفقیت انجام شد</div>
          <div className="">لطفا وارد شوید</div>
        </div>
      </ModalInfo>
      <div className="container mt-20 sm:mt-0 flex w-full items-center justify-center sm:h-screen">
        <div className=" w-[90%] sm:w-96 md:w-[500px] lg:w-[600px] pb-6 bg-white text-[#2c3e50] shadow-lg ">
          <div
            onClick={() => router.push("/")}
            className="cursor-pointer h-14 flex justify-center items-center text-[#0ba] mt-2"
          >
            <ImIcon.ImSection className="w-10 h-10 text-[#0ba]" />
            <h2 className="text-center text-lg font-bold">سامانه ثجا</h2>
          </div>
          <div className="">
            <h2 className="text-center text-lg">ثبت نام</h2>
          </div>
          <div className="space-y-4 mt-2 px-4">
            <div className=" text-[#2c3e50] space-y-1">
              <label htmlFor="mobileNumber" className="text-[#2c3e50]">
                شماره موبایل
              </label>
              <input
                id="mobileNumber"
                className="inputDecoration placeholder:tracking-[.5rem]"
                type="text"
                placeholder="----------"
                onChange={(e) => {
                  setMobile(e.currentTarget.value);
                }}
              />
              {mobileError && (
                <div className="my-1 text-red-700">{mobileError}</div>
              )}
            </div>
            <div className="text-[#2c3e50] space-y-1">
              <label htmlFor="password" className="text-[#2c3e50]">
                رمز عبور
              </label>
              <input
                id="password"
                className="inputDecoration"
                type={visibility ? "text" : "password"}
                placeholder={Strings.password}
                onChange={(e) => {
                  setPassword(e.currentTarget.value);
                }}
              />
              <div className="text-red-700">{passError}</div>
            </div>
            <div className="text-[#2c3e50] space-y-1">
              <label htmlFor="repassword" className="text-[#2c3e50]">
                تکرار رمز عبور
              </label>
              <input
                id="repassword"
                className="inputDecoration focus:shadow-1input"
                type={visibility ? "text" : "password"}
                placeholder={Strings.repeatPassword}
                onChange={(e) => {
                  setRepeatPassword(e.currentTarget.value);
                }}
              />
            </div>
            <div className="flex flex-row gap-2">
              <span>{Strings.showPassword}</span>
              <input
                checked={visibility}
                onChange={passwordVisible}
                type="checkbox"
                className=""
                name=""
                id=""
              />
            </div>
            {errorForm && <div className="text-red-700">{errorForm}</div>}
            <div className="">
              <button
                onClick={(event) => {
                  event.preventDefault();
                  signupUser();
                }}
                className="submitButton"
              >
                ثبت نام در سامانه
              </button>
            </div>
            <div className="flex flex-row gap-2 justify-center items-center">
              <span>حساب کاربری دارید؟</span>
              <span className="text-[#0ba]">
                <Link href="/login">{Strings.login}</Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
