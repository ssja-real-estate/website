import { FC } from "react";
import Select from "react-select";
import SelectBox from "../formcomponent/SelectBox";

const EditProfile: FC<{ onExitEdit: () => void }> = (props) => {
  const options = [
    { value: "0", label: "آذربایجان شرقی" },
    { value: "1", label: "آذربایجان غربی" },
    { value: "2", label: "کردستان" },
  ];
  const options2 = [
    { value: "0", label: "ارومیه" },
    { value: "1", label: "مهاباد" },
    { value: "2", label: "میاندوآب" },
  ];

  return (
    <div className="flex flex-col text-[#2c3e50]">
      <div className="flex flex-row items-center justify-between">
        <span className="text-lg font-bold text-[#2c3e50]">ویرایش پروفایل</span>
        <button
          onClick={props.onExitEdit}
          className="border py-1 px-2 text-[13px] border-[#2c3e50] hover:text-[#f3bc65] hover:border-[#f3bc65]"
        >
          بازگشت به پروفایل
        </button>
      </div>
      <div className="my-10">
        <form>
          <div className="">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="">
                <label className="labelForm" htmlFor="agencyName">
                  نام آژانس
                </label>
                <div className="">
                  <input
                    type="text"
                    className="inputDecoration placeholder:text-sm"
                    id="agencyName"
                    placeholder="آژانس حرفه ای مسکن"
                  />
                </div>
              </div>
              <div className="">
                <label className="labelForm" htmlFor="agencyName">
                  انتخاب استان
                </label>
                <SelectBox options={options} placehodler="انتخاب استان..." />
              </div>
              <div className="">
                <label className="labelForm" htmlFor="agencyName">
                  انتخاب شهرستان
                </label>
                <SelectBox options={options2} placehodler="انتخاب شهرستان..." />
              </div>
              <div className="">
                <label className="labelForm" htmlFor="street">
                  خیابان
                </label>
                <div className="">
                  <input
                    type="text"
                    className="inputDecoration placeholder:text-sm"
                    id="street"
                    placeholder="خیابان"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-10">
            <h2 className="font-bold text-lg">تماس</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="">
                <label className="labelForm" htmlFor="name">
                  نام
                </label>
                <div className="">
                  <input
                    type="text"
                    className="inputDecoration placeholder:text-sm"
                    id="name"
                    placeholder="نام خانوادگی"
                  />
                </div>
              </div>
              <div className="">
                <label className="labelForm" htmlFor="family">
                  نام خانوادگی
                </label>
                <div className="">
                  <input
                    type="text"
                    className="inputDecoration placeholder:text-sm"
                    id="family"
                    placeholder="نام خانوادگی"
                  />
                </div>
              </div>
              <div className="">
                <label className="labelForm" htmlFor="workPhone">
                  تلفن محل کار
                </label>
                <div className="">
                  <input
                    type="number"
                    className="inputDecoration placeholder:text-sm"
                    id="workPhone"
                    placeholder="تلفن محل کار"
                  />
                </div>
              </div>
              <div className="">
                <label className="labelForm" htmlFor="mobile">
                  شماره موبایل
                </label>
                <div className="">
                  <input
                    type="number"
                    className="inputDecoration placeholder:text-sm"
                    id="mobile"
                    placeholder="شماره موبایل"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-10">
            <h2 className="font-bold text-lg">درباره من</h2>
            <label className="labelForm" htmlFor="description">
              توضیحات
            </label>
            <textarea
              className="inputDecoration py-2 h-36  "
              name=""
              id="description"
              rows={30}
              cols={20}
            ></textarea>
          </div>
          <div className="mt-10 flex flex-row justify-end gap-2">
            <div className="">
              <button
                onClick={props.onExitEdit}
                className="border h-12 w-32 py-1 px-2 text-[13px] border-[#2c3e50] hover:text-[#f3bc65] hover:border-[#f3bc65]"
              >
                انصراف
              </button>
            </div>
            <div className="w-32">
              <button className="submitButton text-sm">ذخیره تغییرات</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
