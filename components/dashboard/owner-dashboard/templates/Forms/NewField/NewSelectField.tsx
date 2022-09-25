import { SetStateAction, useState } from "react";
import { useRecoilState } from "recoil";
import Strings from "../../../../../../data/strings";
import { optionsAtom } from "./NewFieldStates";
import * as BiIcon from "react-icons/bi";
import * as Io5Icon from "react-icons/io5";
function NewSelectField() {
  const [newOptionTitle, setNewOptionTitle] = useState<string>("");
  const [options, setOptions] = useRecoilState(optionsAtom);

  return (
    // <div className="">NewSelectField</div>
    <div className="flex flex-row justify-center">
      <div className="w-[30%] flex flex-col justify-center gap-2 pt-3">
        <div className="flex flex-row items-center justify-center">
          <input
            className="inputDecoration"
            type="text"
            placeholder={Strings.newOption}
            value={newOptionTitle}
            onChange={(e: { target: { value: SetStateAction<string> } }) => {
              setNewOptionTitle(e.target.value);
            }}
          />
          <button
            className="border border-[#0ba] p-2 text-[#0ba] hover:text-white hover:bg-[#0ba]"
            onClick={() => {
              if (newOptionTitle.trim() !== "") {
                setOptions([...options, newOptionTitle]);
                setNewOptionTitle("");
              } else {
                setNewOptionTitle("");
                alert(Strings.enterValidInputForNewOption);
              }
            }}
          >
            <BiIcon.BiPlus className="" />
          </button>
        </div>
        <ul className="flex flex-col gap-1">
          {options.map((option, optionIndex) => {
            return (
              <li
                key={optionIndex}
                className="flex flex-row justify-between items-center border p-2 rounded-lg bg-[#f6f6f6]"
              >
                <span>{option}</span>
                <button
                  onClick={() => {
                    const newOptions = options;
                    const filteredOptions = newOptions.filter((_, index) => {
                      return optionIndex !== index;
                    });
                    setOptions(filteredOptions);
                  }}
                >
                  <Io5Icon.IoCloseSharp />
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default NewSelectField;
