import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useRef } from "react";
import * as ImIcon from "react-icons/im";
import * as MdIcon from "react-icons/md";
import UserService from "../../services/api/UserService/UserService";

import RegexValidator from "../../services/utilities/RegexValidator";
import { useSetRecoilState } from "recoil";
import { globalState } from "../../global/states/globalStates";
import Strings from "../../global/constants/strings";

const Login: NextPage = () => {
  const [mobile, setMobile] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [mobileMessageError, setIsMobileValidate] = useState<string>("");
  const [passwordMessageError, setIsPasswordValidate] = useState<string>("");
  const [serverError, setServerError] = useState<string>();
  const [isShowPassword, setIshowPassord] = useState<boolean>(false);
  const service = useRef(new UserService());
  const setGlobalState = useSetRecoilState(globalState);
  const router = useRouter();

  const loginUser = async () => {
    if (!RegexValidator.validatePhone(mobile)) {
      setIsMobileValidate(Strings.invalidPhoneNumber);
      return;
    } else {
      setIsMobileValidate("");
    }
    if (!RegexValidator.validatePassword(password)) {
      // toast.error(Strings.invalidPassword);
      // console.log(password);

      setIsPasswordValidate(Strings.invalidPassword);
      return;
    } else {
      setIsPasswordValidate("");
    }
    try {
      const loginState = await service.current.loginUser(mobile, password);

      if (loginState) {
        console.log(loginState);

        setGlobalState(loginState!);
        router.push("/");
      }
    } catch (e: any) {
      console.log(e.response.data.error);
      setServerError(e.response.data.error);
    }
  };

  return (
    <div className="">
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
            <h2 className="text-center text-lg">ورود</h2>
          </div>
          <div className="space-y-4 mt-2 px-4">
            {/* <InputMobile
              getVal={getMobile}
              lable="شماره موبایل"
              regex={RegexValidator.validatePhone}
              type="text"
            /> */}
            <div className=" text-[#2c3e50] space-y-2">
              <label htmlFor="mobileNumber1" className="text-[#2c3e50]">
                شماره موبایل
              </label>
              <input
                onChange={(e) => setMobile(e.target.value)}
                id="mobileNumber1"
                className={`${
                  mobileMessageError
                    ? "inputErroeDecoration"
                    : "inputDecoration"
                }  placeholder:tracking-[.5rem]`}
                type="text"
                placeholder="----------"
              />
              <div className="text-red-700 text-sm">{mobileMessageError}</div>
            </div>
            <div className="text-[#2c3e50] space-y-1">
              <label htmlFor="password" className="text-[#2c3e50]">
                رمز عبور
              </label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                id="password"
                className={`${
                  passwordMessageError
                    ? "inputErroeDecoration"
                    : "inputDecoration"
                } `}
                type={isShowPassword ? "text" : "password"}
                placeholder="رمز عبور"
              />
              <div className="text-red-700 text-sm">{passwordMessageError}</div>
            </div>

            <div className="flex flex-row items-center gap-2">
              <span>نمایش رمز عبور</span>
              <input
                type="checkbox"
                className="accent-[#0ba] w-5 h-5"
                name=""
                id=""
                onChange={(e) => setIshowPassord(e.target.checked)}
              />
            </div>
            <div className="">
              <button onClick={() => loginUser()} className="submitButton">
                ورود به سامانه
              </button>
              {serverError && (
                <div className="flex flex-row gap-2 justify-center items-center text-red-700 text-sm mt-5 border border-red-700/50 py-2 bg-red-100 rounded-lg">
                  {serverError}
                  <MdIcon.MdOutlineError className="w-5 h-5" />
                </div>
              )}
            </div>
            <div className="flex flex-row gap-2 justify-center items-center">
              <span>حساب کاربری ندارید؟</span>
              <span className="text-[#0ba]">
                <Link href="/signup">ثبت نام</Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
