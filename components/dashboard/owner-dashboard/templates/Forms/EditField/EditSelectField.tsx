import { SetStateAction, useState } from "react";
import { useRecoilState } from "recoil";
import Strings from "../../../../../../data/strings";
import { FieldType } from "../../../../../../global/types/Field";
import { editSelectFieldModalDataAtom } from "../FormsState";
import * as BiIcon from "react-icons/bi";
import * as IoIcon from "react-icons/io";
import * as Io5Icon from "react-icons/io5";
function EditSelectField() {
  const [editSelectFieldModalData, setEditSelectFieldModalData] =
    useRecoilState(editSelectFieldModalDataAtom);
  const [newItemTitle, setNewItemTitle] = useState<string>("");
  console.log(editSelectFieldModalData);

  return (
    <div className="w-full flex flex-row justify-center">
      <div className="flex flex-col justify-center gap-2 pt-3">
        <div className="flex flex-row">
          <input
            className="inputDecoration "
            type="text"
            placeholder={Strings.newOption}
            value={newItemTitle}
            onChange={(e: { target: { value: SetStateAction<string> } }) => {
              setNewItemTitle(e.target.value);
            }}
          />
          <button
            className="border border-[#0ba] p-2 text-[#0ba] hover:text-white hover:bg-[#0ba]"
            onClick={() => {
              if (newItemTitle.trim() !== "") {
                const fieldType = editSelectFieldModalData.data.type;
                const field = editSelectFieldModalData.data;
                const items =
                  fieldType === FieldType.Select
                    ? field.options ?? []
                    : field.keys ?? [];
                const newItems = [...items, newItemTitle];
                setEditSelectFieldModalData({
                  ...editSelectFieldModalData,
                  data: {
                    ...editSelectFieldModalData.data,
                    options: fieldType === FieldType.Select ? newItems : [],
                    keys: fieldType === FieldType.MultiSelect ? newItems : [],
                  },
                });
              } else {
                alert(Strings.enterValidInputForNewOption);
              }
              setNewItemTitle("");
            }}
          >
            <BiIcon.BiPlus className="" />
          </button>
        </div>
        <ul className="my-2 flex flex-col gap-2">
          {(editSelectFieldModalData.data.type === FieldType.Select
            ? editSelectFieldModalData.data.options!
            : editSelectFieldModalData.data.keys!
          ).map((option, optionIndex) => {
            return (
              <li
                key={optionIndex}
                className="flex flex-row justify-between items-center border bg-gray-100 text-sm rounded-2xl p-2"
              >
                {option}
                <button
                  onClick={() => {
                    const fieldType = editSelectFieldModalData.data.type;
                    const field = editSelectFieldModalData.data;
                    const items =
                      (fieldType === FieldType.Select
                        ? field.options
                        : field.keys) ?? [];
                    // const newOptions = editSelectFieldModalData.data.options!;
                    const filteredItems = items.filter((_, index) => {
                      return optionIndex !== index;
                    });
                    setEditSelectFieldModalData({
                      ...editSelectFieldModalData,
                      data: {
                        ...editSelectFieldModalData.data,
                        options:
                          fieldType === FieldType.Select
                            ? filteredItems
                            : undefined,
                        keys:
                          fieldType === FieldType.MultiSelect
                            ? filteredItems
                            : undefined,
                      },
                    });
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

export default EditSelectField;
