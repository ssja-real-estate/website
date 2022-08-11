import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import * as ImIcon from "react-icons/im";

const Signup: NextPage = () => {
  const router = useRouter();
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
              />
            </div>
            <div className="text-[#2c3e50] space-y-1">
              <label htmlFor="password" className="text-[#2c3e50]">
                رمز عبور
              </label>
              <input
                id="password"
                className="inputDecoration"
                type="password"
                placeholder="رمز عبور"
              />
            </div>
            <div className="text-[#2c3e50] space-y-1">
              <label htmlFor="repassword" className="text-[#2c3e50]">
                تکرار رمز عبور
              </label>
              <input
                id="repassword"
                className="inputDecoration focus:shadow-1input"
                type="password"
                placeholder="تکرار رمز عبور"
              />
            </div>
            <div className="flex flex-row gap-2">
              <span>نمایش رمز عبور</span>
              <input type="checkbox" className="" name="" id="" />
            </div>
            <div className="">
              <button className="submitButton">ثبت نام در سامانه</button>
            </div>
            <div className="flex flex-row gap-2 justify-center items-center">
              <span>حساب کاربری دارید؟</span>
              <span className="text-[#0ba]">
                <Link href="/login">ورود</Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
