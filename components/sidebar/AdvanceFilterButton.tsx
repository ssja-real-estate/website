import { FC, useState } from "react";
import * as FiIcon from "react-icons/fi";
import * as RiIcon from "react-icons/ri";
const AdvanceFilterButton: FC<{
  isDefault: boolean;
  advancedSearchHandler: () => void;
  clearAdvancedFilter: () => void;
  // loadLoaction: () => void;
  // loadOption: () => void;
  setNoFilterExists: () => void;
}> = (props) => {
  const [isClicked, setIsCliked] = useState(false);
  return (
    <button
      onClick={
        props.isDefault
          ? () => {
              props.advancedSearchHandler();
              setIsCliked(false);
            }
          : !isClicked
          ? () => {
              props.advancedSearchHandler();
              setIsCliked(true);
            }
          : () => {
              setIsCliked(false);
              // props.loadLoaction();
              // props.loadOption();
              props.clearAdvancedFilter();
              props.setNoFilterExists();
            }
      }
      className="border border-white w-full h-10 px-3 flex flex-row items-center justify-center text-white gap-2 transition-all duration-200 hover:shadow-lg active:pt-2"
    >
      {!isClicked ? (
        <>
          <FiIcon.FiFilter className="w-5 h-5" />
          <span>فیلتر پیشرفته</span>
        </>
      ) : (
        <>
          (<RiIcon.RiDeleteBin2Line className="w-5 h-5 text-red-300" />
          <span className="text-red-300">حذف فیلتر پیشرفته</span>)
        </>
      )}
    </button>
  );
};

export default AdvanceFilterButton;
