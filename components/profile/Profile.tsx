import Image from "next/image";
import React from "react";

const Profile: React.FC<{ children?: JSX.Element }> = (props) => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-row items-center justify-between">
        <span className="text-lg font-bold text-[#2c3e50]">پروفایل</span>
        <button className="border py-1 px-2 text-[13px] border-[#2c3e50] hover:text-[#f3bc65] hover:border-[#f3bc65]">
          ویرایش پروفایل
        </button>
      </div>
      <div className="my-10">
        <div className="flex flex-col md:flex-row gap-10">
          <div className="w-full md:w-[200px]">
            <Image
              src="/image/user/user.jpg"
              layout="responsive"
              width={500}
              height={480}
              alt="user"
            />
          </div>
          <div className="text-[#2c3e50] flex flex-col space-y-2 divide-y-2 divide-dotted w-full">
            <div className="py-1">
              <h3 className="text-2xl font-bold my-2">رضا مفتی زاده</h3>
              <h6 className="text-[#606e7c] text-sm my-2">
                آژانس املاک حرفه ای
              </h6>
            </div>
            <div className="py-3">
              <div className="flex flex-col">
                <div className="flex flex-col gap-2 md:flex-row md:gap-10">
                  <div className="space-y-2 w-full">
                    <div>تلفن</div>
                    <div className="text-right text-[#0ba] text-sm" dir="ltr">
                      +98 044 42344444
                    </div>
                  </div>
                  <div className="space-y-2 w-full">
                    <div>ایمیل</div>
                    <div className="text-right text-[#0ba] text-sm" dir="ltr">
                      test.test@gmail.com
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 md:flex-row md:gap-10">
                  <div className="space-y-2 w-full">
                    <div>موبایل</div>
                    <div className="text-right text-[#0ba] text-sm" dir="ltr">
                      +98 0914 42344444
                    </div>
                  </div>
                  <div className="space-y-2 w-full">
                    <div>skype</div>
                    <div className="text-right text-[#0ba] text-sm" dir="ltr">
                      Rezt
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
