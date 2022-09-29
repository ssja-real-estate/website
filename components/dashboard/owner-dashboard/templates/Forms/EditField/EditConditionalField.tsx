import { SetStateAction, useState } from "react";
import { useRecoilState } from "recoil";
import Strings from "../../../../../../data/strings";
import {
  defaultField,
  Field,
  FieldFilterableStatus,
  FieldFilterableStatusLabel,
  FieldInputNecessity,
  FieldInputNecessityLabel,
  FieldType,
  FieldTypeTitle,
} from "../../../../../../global/types/Field";
import { getFieldTypeAndNecessity } from "../../../../../../services/utilities/stringUtility";
import InnerCustomModal from "../../../../../modal/InnerCustomModal";
import {
  defaultEditSelectFieldModalData,
  EditFieldModalData,
  editSelectFieldModalDataAtom,
  innerFieldModalDataAtom,
} from "../FormsState";
import * as IoIcon from "react-icons/io";
import * as Io5Icon from "react-icons/io5";
import * as AiIcon from "react-icons/ai";
import * as MdIcon from "react-icons/md";
import * as BiIcon from "react-icons/bi";

function EditConditionalField() {
  const [innerFieldModalData, setInnerFieldModalData] = useRecoilState(
    innerFieldModalDataAtom
  );
  const [showRenameInnerFieldModal, setShowRenameInnerFieldModal] =
    useState<boolean>(false);
  const [renameInnerFieldModalData, setRenameInnerFieldModalData] =
    useState<EditFieldModalData>({ index: -1, newTitle: "", newType: 0 });
  const [newInnerFieldTitle, setNewInnerFieldTitle] = useState<string>("");
  const [selectedType, setSelectedType] = useState<FieldType>(0);
  const [options, setOptions] = useState<string[]>([]);
  const [newOptionTitle, setNewOptionTitle] = useState<string>("");
  const [showEditSelectFieldModal, setShowEditSelectFieldModal] =
    useState<boolean>(false);
  const [editSelectFieldModalData, setEditSelectFieldModalData] =
    useRecoilState(editSelectFieldModalDataAtom);
  const [fieldInputNecessity, setFieldInputNecessity] = useState<number>(
    FieldInputNecessity.Obligatory
  );
  const [filterableStatus, setFilterableStatus] = useState(
    FieldFilterableStatus.IsNotFilterable
  );

  function addNewInnerField(field: Field) {
    const newField = { ...field, options };
    if (newField.type === FieldType.Bool) {
      newField.value = false;
    } else if (newField.type === FieldType.Number) {
      newField.value = 0;
    }
    const newInnerFields = [...innerFieldModalData.data.fields!, newField];
    setInnerFieldModalData({
      ...innerFieldModalData,
      data: {
        ...innerFieldModalData.data,
        fields: newInnerFields,
      },
    });
  }

  function updateChangedSelectField() {
    const innerFieldIndex = editSelectFieldModalData.index;
    const data = editSelectFieldModalData.data;
    const innerFields = innerFieldModalData.data.fields!.slice();

    const changedField: Field = {
      id: data.id,
      title: data.title,
      type: data.type,
      value: data.value,
      options: data.options!,
    };
    innerFields.splice(innerFieldIndex, 1, changedField);

    setInnerFieldModalData({
      ...innerFieldModalData,
      data: { ...innerFieldModalData.data, fields: innerFields },
    });
  }

  function moveItemUp(fieldIndex: number) {
    const tempFields = [...innerFieldModalData.data.fields!];
    const indexToMoveTo = fieldIndex === 0 ? 0 : fieldIndex - 1;
    const [reorderedItem] = tempFields.splice(fieldIndex, 1);
    tempFields.splice(indexToMoveTo, 0, reorderedItem);
    setInnerFieldModalData({
      ...innerFieldModalData,
      data: {
        ...innerFieldModalData.data,
        fields: tempFields,
      },
    });
  }

  function moveItemDown(fieldIndex: number) {
    const tempFields = [...innerFieldModalData.data.fields!];
    const indexToMoveTo =
      fieldIndex === tempFields.length - 1
        ? tempFields.length - 1
        : fieldIndex + 1;
    const [reorderedItem] = tempFields.splice(fieldIndex, 1);
    tempFields.splice(indexToMoveTo, 0, reorderedItem);
    setInnerFieldModalData({
      ...innerFieldModalData,
      data: {
        ...innerFieldModalData.data,
        fields: tempFields,
      },
    });
  }

  return (
    <>
      <ul className="flex flex-col gap-2">
        {innerFieldModalData.data.fields!.map((innerField, innerFieldIndex) => {
          return (
            <li
              className="bg-[#fff3cd] rounded-2xl px-2 py-2"
              key={innerFieldIndex}
            >
              <div className="flex flex-row justify-between items-center">
                <div className="flex flex-row gap-10 items-center  w-full">
                  <div>
                    <IoIcon.IoIosArrowDown
                      onClick={() => {
                        moveItemUp(innerFieldIndex);
                      }}
                      className="rotate-180 cursor-pointer"
                    />
                    <IoIcon.IoIosArrowDown
                      onClick={() => {
                        moveItemDown(innerFieldIndex);
                      }}
                      className="cursor-pointer"
                    />
                    {/* <i
                    className="bi-chevron-up d-block"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      moveItemUp(innerFieldIndex);
                    }}
                  >
                    up
                  </i>
                  <i
                    className="bi-chevron-down d-block"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      moveItemDown(innerFieldIndex);
                    }}
                  >
                    down
                  </i> */}
                  </div>
                  <div className="flex flex-row gap-8">
                    <div className="flex flex-row items-center">
                      <h6 className="d-inline">{innerField.title}</h6>
                      <AiIcon.AiFillEdit
                        className="bi-pencil-fill me-2"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setRenameInnerFieldModalData({
                            index: innerFieldIndex,
                            newTitle: innerField.title,
                            newType: innerField.type,
                            newFieldInputNecessity: innerField.optional
                              ? FieldInputNecessity.Optional
                              : FieldInputNecessity.Obligatory,
                          });
                          setShowRenameInnerFieldModal(true);
                        }}
                      />
                    </div>
                    <div className="flex flex-row gap-2">
                      <h6 className="d-inline text-muted">
                        {getFieldTypeAndNecessity(innerField)}
                      </h6>
                      {innerField.type === FieldType.Select && (
                        <MdIcon.MdOutlineEditNote
                          className="cursor-pointer text-2xl"
                          onClick={() => {
                            setEditSelectFieldModalData({
                              index: innerFieldIndex,
                              data: { ...innerField },
                            });
                            setShowEditSelectFieldModal(true);
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>
                <button
                  className="m-3"
                  onClick={() => {
                    const fields = innerFieldModalData.data.fields!;
                    const filteredFields = fields!.filter((_, index) => {
                      return innerFieldIndex !== index;
                    });
                    if (window.confirm(Strings.confirmDeleteInput)) {
                      setInnerFieldModalData({
                        ...innerFieldModalData,
                        data: {
                          ...innerFieldModalData.data,
                          fields: filteredFields,
                        },
                      });
                    }
                  }}
                >
                  <Io5Icon.IoCloseSharp />
                </button>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="flex flex-row items-center justify-between my-2">
        <div className="flex flex-row items-center">
          <input
            className="inputDecoration w-[35vw]"
            type="text"
            placeholder={Strings.newInnerInputTitle}
            maxLength={30}
            value={newInnerFieldTitle}
            onChange={(e: { target: { value: SetStateAction<string> } }) => {
              setNewInnerFieldTitle(e.target.value);
            }}
          />
          <select
            // style={{ minWidth: 100, maxWidth: "15vw" }}
            className="defaultSelectbox w-[15vw]"
            value={selectedType}
            onChange={(e: { currentTarget: { value: any } }) => {
              setSelectedType(Number(e.currentTarget.value));
            }}
          >
            <option value={FieldType.Text}>{FieldTypeTitle.Text}</option>
            <option value={FieldType.Number}>{FieldTypeTitle.Number}</option>
            <option value={FieldType.Select}>{FieldTypeTitle.Select}</option>
            <option value={FieldType.Bool}>{FieldTypeTitle.Bool}</option>
          </select>
          <select
            className="defaultSelectbox w-[15vw]"
            // style={{ minWidth: 50, maxWidth: "10vw" }}
            value={filterableStatus}
            onChange={(e: { currentTarget: { value: string | number } }) => {
              const value = +e.currentTarget.value;
              setFilterableStatus(value as FieldFilterableStatus);
            }}
          >
            <option value={FieldFilterableStatus.IsNotFilterable}>
              {FieldFilterableStatusLabel.IsNotFilterable}
            </option>
            <option value={FieldFilterableStatus.IsFilterable}>
              {FieldFilterableStatusLabel.IsFilterable}
            </option>
          </select>
          <select
            className="defaultSelectbox w-[15vw]"
            // style={{ minWidth: 100, maxWidth: "15vw" }}
            value={fieldInputNecessity}
            onChange={(e: { currentTarget: { value: any } }) => {
              setFieldInputNecessity(Number(e.currentTarget.value));
            }}
          >
            <option value={FieldInputNecessity.Obligatory}>
              {FieldInputNecessityLabel.Obligatory}
            </option>
            <option value={FieldInputNecessity.Optional}>
              {FieldInputNecessityLabel.Optional}
            </option>
          </select>
        </div>
        <button
          className="border border-[#0ba] p-2 text-[#0ba] hover:text-white hover:bg-[#0ba]"
          onClick={() => {
            let newInnerField: Field = {
              ...defaultField,
              title: newInnerFieldTitle,
              type: selectedType,
              optional: fieldInputNecessity === FieldInputNecessity.Optional,
              filterable:
                filterableStatus === FieldFilterableStatus.IsFilterable,
            };
            if (newInnerFieldTitle.trim() === "") {
              alert(Strings.enterValidTitleForInnerInput);
              return;
            }

            if (selectedType === FieldType.Select) {
              if (options.length < 2) {
                alert(Strings.chooseAtLeastTwoOptionsForSelect);
                return;
              }
              newInnerField.options = options;
            }
            addNewInnerField(newInnerField);
            setNewInnerFieldTitle("");
            setOptions([]);
            setFieldInputNecessity(FieldInputNecessity.Obligatory);
            setFilterableStatus(FieldFilterableStatus.IsNotFilterable);
          }}
        >
          <BiIcon.BiPlus className="" />
        </button>
      </div>
      {selectedType === FieldType.Select && (
        <div className="w-full flex flex-row justify-center">
          <div className="flex flex-col justify-center gap-2 pt-3">
            <div className="flex flex-row items-center">
              <input
                className="inputDecoration"
                type="text"
                placeholder={Strings.newOption}
                value={newOptionTitle}
                onChange={(e: {
                  target: { value: SetStateAction<string> };
                }) => {
                  setNewOptionTitle(e.target.value);
                }}
              />
              <button
                className="border border-[#0ba] p-2 text-[#0ba] hover:text-white hover:bg-[#0ba]"
                onClick={() => {
                  if (newOptionTitle.trim() !== "") {
                    setOptions([...options, newOptionTitle]);
                  } else {
                    alert(Strings.enterValidInputForNewOption);
                  }
                  setNewOptionTitle("");
                }}
              >
                <BiIcon.BiPlus className="" />
              </button>
            </div>
            <ul className="mt-2">
              {options.map((option, optionIndex) => {
                return (
                  <li
                    key={optionIndex}
                    className="flex flex-row justify-between items-center border bg-gray-200 px-2 py-2 rounded-xl"
                  >
                    {option}
                    <button
                      onClick={() => {
                        const newOptions = options;
                        const filteredOptions = newOptions.filter(
                          (_, index) => {
                            return optionIndex !== index;
                          }
                        );
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
      )}

      <InnerCustomModal
        show={showRenameInnerFieldModal}
        title={Strings.editInnerInputTitle}
        cancelTitle={Strings.cancel}
        successTitle={Strings.save}
        handleClose={() => {
          setShowRenameInnerFieldModal(false);
        }}
        handleSuccess={() => {
          let innerFields = innerFieldModalData.data.fields!.slice();
          const index = renameInnerFieldModalData.index;

          if (index === -1) return;

          innerFields[index] = {
            ...innerFields[index],
            title: renameInnerFieldModalData.newTitle,
            type: renameInnerFieldModalData.newType,
            optional:
              renameInnerFieldModalData.newFieldInputNecessity ===
              FieldInputNecessity.Optional,
          };

          setInnerFieldModalData({
            ...innerFieldModalData,
            data: {
              ...innerFieldModalData.data,
              fields: innerFields,
            },
          });
          setShowRenameInnerFieldModal(false);
          setRenameInnerFieldModalData({ index: -1, newTitle: "", newType: 0 });
        }}
      >
        <div style={{ direction: "rtl" }}>
          <input
            type="text"
            placeholder={Strings.newTitle}
            value={renameInnerFieldModalData.newTitle}
            onChange={(e: { target: { value: any } }) => {
              setRenameInnerFieldModalData({
                ...renameInnerFieldModalData!,
                newTitle: e.target.value,
              });
            }}
          />
          <select
            style={{ minWidth: 50, maxWidth: "10vw" }}
            value={
              renameInnerFieldModalData.filterable
                ? FieldFilterableStatus.IsFilterable
                : FieldFilterableStatus.IsNotFilterable
            }
            onChange={(e: { currentTarget: { value: string | number } }) => {
              const value = +e.currentTarget.value;
              setRenameInnerFieldModalData({
                ...renameInnerFieldModalData,
                filterable: value === FieldFilterableStatus.IsFilterable,
              });
            }}
          >
            <option value={FieldFilterableStatus.IsNotFilterable}>
              {FieldFilterableStatusLabel.IsNotFilterable}
            </option>
            <option value={FieldFilterableStatus.IsFilterable}>
              {FieldFilterableStatusLabel.IsFilterable}
            </option>
          </select>
          <select
            style={{ minWidth: 50, maxWidth: "10vw" }}
            value={renameInnerFieldModalData.newFieldInputNecessity}
            onChange={(e: { currentTarget: { value: any } }) => {
              setRenameInnerFieldModalData({
                ...renameInnerFieldModalData!,
                newFieldInputNecessity: Number(e.currentTarget.value),
              });
            }}
          >
            <option value={FieldInputNecessity.Obligatory}>
              {FieldInputNecessityLabel.Obligatory}
            </option>
            <option value={FieldInputNecessity.Optional}>
              {FieldInputNecessityLabel.Optional}
            </option>
          </select>
        </div>
      </InnerCustomModal>
      <InnerCustomModal
        show={showEditSelectFieldModal}
        title={Strings.editOptions}
        cancelTitle={Strings.cancel}
        successTitle={Strings.save}
        handleClose={() => {
          setShowEditSelectFieldModal(false);
          setEditSelectFieldModalData(defaultEditSelectFieldModalData);
        }}
        handleSuccess={() => {
          if (editSelectFieldModalData.data.options!.length > 1) {
            updateChangedSelectField();
            setShowEditSelectFieldModal(false);
          } else {
            alert(Strings.chooseAtLeastTwoOptionsForSelect);
          }
        }}
      >
        <div className="w-full border-t border-b my-2 flex flex-row justify-center px-2">
          <div className="flex flex-col items-center justify-center gap-2 pt-3">
            <div className="flex flex-row">
              <input
                type="text"
                className="inputDecoration"
                placeholder={Strings.newOption}
                value={newOptionTitle}
                onChange={(e: {
                  target: { value: SetStateAction<string> };
                }) => {
                  setNewOptionTitle(e.target.value);
                }}
              />
              <button
                className="border border-[#0ba] p-2 text-[#0ba] hover:text-white hover:bg-[#0ba]"
                onClick={() => {
                  if (newOptionTitle.trim() !== "") {
                    const options = editSelectFieldModalData.data.options!;
                    const newOptions = [...options, newOptionTitle];
                    setEditSelectFieldModalData({
                      ...editSelectFieldModalData,
                      data: {
                        ...editSelectFieldModalData.data,
                        options: newOptions,
                      },
                    });
                  } else {
                    alert(Strings.enterValidInputForNewOption);
                  }
                  setNewOptionTitle("");
                }}
              >
                <BiIcon.BiPlus className="" />
              </button>
            </div>
            <ul className="w-full flex flex-col gap-2 my-2">
              {editSelectFieldModalData.data.options?.map(
                (option, optionIndex) => {
                  return (
                    <li
                      key={optionIndex}
                      className="flex flex-row justify-between items-center border bg-gray-200 px-2 py-2 rounded-xl"
                    >
                      {option}
                      <button
                        onClick={() => {
                          const newOptions =
                            editSelectFieldModalData.data.options!;
                          const filteredOptions = newOptions.filter(
                            (_, index) => {
                              return optionIndex !== index;
                            }
                          );
                          setEditSelectFieldModalData({
                            ...editSelectFieldModalData,
                            data: {
                              ...editSelectFieldModalData.data,
                              options: filteredOptions,
                            },
                          });
                        }}
                      >
                        <Io5Icon.IoCloseSharp />
                      </button>
                    </li>
                  );
                }
              )}
            </ul>
          </div>
        </div>
      </InnerCustomModal>
    </>
  );
}

export default EditConditionalField;
