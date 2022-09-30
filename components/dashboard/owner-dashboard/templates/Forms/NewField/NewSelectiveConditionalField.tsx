import { SetStateAction, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { v4 } from "uuid";
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
import Accordion from "./Accordion";
import { optionsAtom, selectiveInnerFieldsAtom } from "./NewFieldStates";
import NewSelectField from "./NewSelectField";
import * as BiIcon from "react-icons/bi";
import * as IoIcon from "react-icons/io";
import * as Io5Icon from "react-icons/io5";
import { getFieldTypeAndNecessity } from "../../../../../../services/utilities/stringUtility";

function NewSelectiveConditionalField() {
  const [selectiveField, setInnerFields] = useRecoilState(
    selectiveInnerFieldsAtom
  );
  const [newInnerFieldTitle, setNewInnerFieldTitle] = useState<string>("");
  const [selectedType, setSelectedType] = useState<number>(0);
  const [innerNewOptionTitle, setInnerNewOptionTitle] = useState<string>("");
  const [innerOptions, setInnerOptions] = useState<string[]>([]);
  const [fieldInputNecessity, setFieldInputNecessity] = useState<number>(
    FieldInputNecessity.Obligatory
  );
  const [filterableStatus, setFilterableStatus] = useState(
    FieldFilterableStatus.IsNotFilterable
  );

  const [options, setOptions] = useRecoilState(optionsAtom);

  useEffect(() => {}, [options]);

  function addNewInnerField(newField: Field, key: string) {
    if (newField.type === FieldType.Bool) {
      newField.value = false;
    } else if (newField.type === FieldType.Number) {
      newField.value = 0;
    }

    const fieldMaps = [...(selectiveField.fieldMaps ?? [])];
    const fieldMap = fieldMaps.find((f) => f.key === key);
    const newInnerFields = [...(fieldMap?.fields ?? []), newField];
    const innerFieldMapIndex = fieldMaps.findIndex((f) => f.key === key);

    if (innerFieldMapIndex === -1) {
      fieldMaps.push({ key, fields: newInnerFields });
    } else {
      fieldMaps[innerFieldMapIndex] = {
        ...fieldMaps[innerFieldMapIndex],
        fields: newInnerFields,
      };
    }
    setInnerFields({
      ...selectiveField,
      fieldMaps,
    });
  }

  function getInnerFieldsByKey(key: string): Field[] {
    const innerFieldsMap = (selectiveField.fieldMaps ?? []).find(
      (f) => f.key === key
    );
    if (!innerFieldsMap || !innerFieldsMap.fields.length) return [];

    return innerFieldsMap.fields ?? [];
  }

  function moveItemUp(fieldIndex: number, key: string) {
    const innerFields = getInnerFieldsByKey(key);
    const tempInnerFields = Object.assign([], innerFields);
    const indexToMoveTo = fieldIndex === 0 ? 0 : fieldIndex - 1;
    const [reorderedItem] = tempInnerFields.splice(fieldIndex, 1);
    tempInnerFields.splice(indexToMoveTo, 0, reorderedItem);

    const fieldMaps = [...(selectiveField.fieldMaps ?? [])];
    const fieldMapIndex = fieldMaps.findIndex((fm) => fm.key === key);
    debugger;
    if (fieldMapIndex === -1) {
      fieldMaps.push({ key, fields: tempInnerFields });
    } else {
      debugger;
      fieldMaps[fieldMapIndex].fields = tempInnerFields;
    }

    setInnerFields({
      ...selectiveField,
      fieldMaps,
    });
  }

  function moveItemDown(fieldIndex: number, key: string) {
    const innerFields = getInnerFieldsByKey(key);
    const tempInnerFields = Object.assign([], innerFields);
    const indexToMoveTo =
      fieldIndex === tempInnerFields.length - 1
        ? tempInnerFields.length - 1
        : fieldIndex + 1;
    const [reorderedItem] = tempInnerFields.splice(fieldIndex, 1);
    tempInnerFields.splice(indexToMoveTo, 0, reorderedItem);

    const fieldMaps = [...(selectiveField.fieldMaps ?? [])];
    const fieldMapIndex = fieldMaps.findIndex((fm) => fm.key === key);

    if (fieldMapIndex === -1) {
      fieldMaps.push({ key, fields: tempInnerFields });
    } else {
      // fieldMaps[fieldMapIndex].fields = tempInnerFields;
    }

    setInnerFields({
      ...selectiveField,
      fieldMaps,
    });
  }

  return (
    <div className="">
      <NewSelectField />
      {options.map((option, index) => {
        return (
          <div key={index.toString()}>
            <Accordion title={option + " " + Strings.newConditionalField}>
              <div>
                {/* <h3 className="mt-4">{option}</h3> */}
                <ul className="flex flex-col gap-2">
                  {selectiveField.fieldMaps &&
                  selectiveField.fieldMaps.length > 0
                    ? (
                        selectiveField.fieldMaps.find((f) => f.key === option)
                          ?.fields ?? []
                      ).map((field, fieldIndex) => {
                        return (
                          <li
                            className="bg-[#fff3cd] rounded-2xl px-2 py-2"
                            key={fieldIndex + v4()}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex flex-row items-center gap-2">
                                {/* <div className="">
                                  <IoIcon.IoIosArrowDown
                                    onClick={() => {
                                      moveItemUp(fieldIndex, option);
                                    }}
                                    className="rotate-180 cursor-pointer"
                                  />
                                  <IoIcon.IoIosArrowDown
                                    onClick={() => {
                                      moveItemDown(fieldIndex, option);
                                    }}
                                    className="cursor-pointer"
                                  />
                                </div> */}
                                {/* <Col xs="auto">
                                <i
                                  className="bi-chevron-up d-block"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    moveItemUp(fieldIndex, option);
                                  }}
                                ></i>
                                <i
                                  className="bi-chevron-down d-block"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    moveItemDown(fieldIndex, option);
                                  }}
                                ></i>
                              </Col> */}
                                <div>
                                  <h6 className="">{field.title}</h6>
                                </div>
                                <div>
                                  <h6 className="d-inline text-muted">
                                    {getFieldTypeAndNecessity(field)}
                                  </h6>
                                </div>
                              </div>
                              <button
                                className="m-3"
                                onClick={() => {
                                  const fields =
                                    selectiveField.fieldMaps?.find(
                                      (f) => f.key === option
                                    )?.fields ?? [];
                                  const filteredFields = fields.filter(
                                    (_, index) => {
                                      return fieldIndex !== index;
                                    }
                                  );
                                  let fieldMaps = [
                                    ...(selectiveField.fieldMaps ?? []),
                                  ];
                                  const fieldMapIndex =
                                    selectiveField.fieldMaps?.findIndex(
                                      (f) => f.key === option
                                    ) ?? -1;
                                  if (fieldMapIndex !== -1) {
                                    fieldMaps[fieldMapIndex] = {
                                      key: option,
                                      fields: filteredFields,
                                    };
                                  }
                                  if (
                                    window.confirm(Strings.confirmDeleteInput)
                                  ) {
                                    setInnerFields({
                                      ...selectiveField,
                                      fieldMaps,
                                    });
                                  }
                                }}
                              >
                                <Io5Icon.IoCloseSharp />
                              </button>
                            </div>
                          </li>
                        );
                      })
                    : null}
                </ul>
                <div className="mt-3 flex flex-row justify-between">
                  <div className="flex flex-row items-center">
                    <input
                      className="inputDecoration w-[35vw]"
                      type="text"
                      placeholder={Strings.newInnerInputTitle}
                      maxLength={30}
                      value={newInnerFieldTitle}
                      onChange={(e: {
                        target: { value: SetStateAction<string> };
                      }) => {
                        setNewInnerFieldTitle(e.target.value);
                      }}
                    />
                    <select
                      className="defaultSelectbox w-[15vw]"
                      // style={{ minWidth: 100, maxWidth: "15vw" }}
                      value={selectedType}
                      onChange={(e: { currentTarget: { value: any } }) => {
                        setSelectedType(Number(e.currentTarget.value));
                      }}
                    >
                      <option value={FieldType.Text}>
                        {FieldTypeTitle.Text}
                      </option>
                      <option value={FieldType.Number}>
                        {FieldTypeTitle.Number}
                      </option>
                      <option value={FieldType.Select}>
                        {FieldTypeTitle.Select}
                      </option>
                      <option value={FieldType.Bool}>
                        {FieldTypeTitle.Bool}
                      </option>
                    </select>
                    <select
                      className="defaultSelectbox w-[15vw]"
                      // style={{ minWidth: 100, maxWidth: "15vw" }}
                      value={filterableStatus}
                      onChange={(e: {
                        currentTarget: { value: string | number };
                      }) => {
                        setFilterableStatus(+e.currentTarget.value);
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
                        optional:
                          fieldInputNecessity === FieldInputNecessity.Optional,
                        filterable:
                          filterableStatus ===
                          FieldFilterableStatus.IsFilterable,
                      };
                      if (newInnerFieldTitle.trim() !== "") {
                        if (selectedType === FieldType.Select) {
                          if (innerOptions.length < 2) {
                            alert(Strings.chooseAtLeastTwoOptionsForSelect);
                            return;
                          }
                        }
                        newInnerField.options = innerOptions;
                        addNewInnerField(newInnerField, option);
                        setInnerOptions([]);
                      } else {
                        alert(Strings.enterValidTitleForInput);
                      }
                      setNewInnerFieldTitle("");
                      setFieldInputNecessity(FieldInputNecessity.Obligatory);
                      setFilterableStatus(
                        FieldFilterableStatus.IsNotFilterable
                      );
                    }}
                  >
                    <BiIcon.BiPlus className="" />
                  </button>
                </div>
                {selectedType === FieldType.Select && (
                  <div className="w-full flex flex-row justify-center">
                    <div className="flex flex-col items-center gap-2 pt-3">
                      <div className="flex flex-row">
                        <input
                          className="inputDecoration"
                          type="text"
                          placeholder={Strings.newOption}
                          value={innerNewOptionTitle}
                          onChange={(e: {
                            target: { value: SetStateAction<string> };
                          }) => {
                            setInnerNewOptionTitle(e.target.value);
                          }}
                        />
                        <button
                          className="border border-[#0ba] p-2 text-[#0ba] hover:text-white hover:bg-[#0ba]"
                          onClick={() => {
                            if (innerNewOptionTitle.trim() !== "") {
                              setInnerOptions([
                                ...innerOptions,
                                innerNewOptionTitle,
                              ]);
                              setInnerNewOptionTitle("");
                            } else {
                              setInnerNewOptionTitle("");
                              alert(Strings.enterValidInputForNewOption);
                            }
                          }}
                        >
                          <BiIcon.BiPlus className="" />
                        </button>
                      </div>
                      <ul className="w-full flex flex-col gap-1">
                        {innerOptions.map((innerOption, innerOptionIndex) => {
                          return (
                            <li
                              key={innerOptionIndex + v4()}
                              className="p-2 flex flex-row justify-between items-center border rounded-2xl bg-gray-100"
                            >
                              {innerOption}
                              <button
                                onClick={() => {
                                  const newOptions = innerOptions;
                                  const filteredOptions = newOptions.filter(
                                    (_, index) => {
                                      return innerOptionIndex !== index;
                                    }
                                  );
                                  setInnerOptions(filteredOptions);
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
              </div>
            </Accordion>
          </div>
        );
      })}
    </div>
  );
}

export default NewSelectiveConditionalField;
