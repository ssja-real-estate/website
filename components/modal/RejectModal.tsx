import React, { FC } from "react";
import { useRecoilState } from "recoil";
import Strings from "../../data/strings";
import { rejectEstateAtom } from "../dashboard/EstateStatus/RejectEstateModal/RejectEstateModalState";

const RejectModal: FC = () => {
  const [rejectEstateState, setRejectEstateState] =
    useRecoilState(rejectEstateAtom);
  return (
    <div className="border-b border-t py-5 px-2 space-y-2 my-2">
      <label className="text-dark-blue" htmlFor="">
        {Strings.description}
      </label>
      <input
        onChange={(e) => {
          setRejectEstateState({
            ...rejectEstateState,
            description: e.currentTarget.value,
          });
        }}
        type="text"
        className="w-full h-10 border outline-none focus-within:border-[#0ba] px-3"
        name=""
        id=""
      />
    </div>
  );
};

export default RejectModal;
