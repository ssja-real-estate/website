import { SetStateAction, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import Strings from "../../../../../../data/strings";
import {
  defaultField,
  Field,
  FieldFilterableStatus,
  FieldFilterableStatusLabel,
  FieldInputNecessity,
  FieldInputNecessityLabel,
  FieldMap,
  FieldType,
  FieldTypeTitle,
} from "../../../../../../global/types/Field";
import { getFieldTypeAndNecessity } from "../../../../../../services/utilities/stringUtility";
import {
  editSelectFieldModalDataAtom,
  selectiveInnerFieldModalDataAtom,
} from "../FormsState";
import Accordion from "../NewField/Accordion";
import EditSelectField from "./EditSelectField";
import * as IoIcon from "react-icons/io";
import * as Io5Icon from "react-icons/io5";
import * as AiIcon from "react-icons/ai";
import * as MdIcon from "react-icons/md";
import * as BiIcon from "react-icons/bi";
function EditSelectiveConditionalField() {
  const [selectiveInnerFields, setInnerFields] = useRecoilState(
    selectiveInnerFieldModalDataAtom
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

  const [options, setOptions] = useRecoilState(editSelectFieldModalDataAtom);

  useEffect(() => {}, [options]);

  function addNewInnerField(newField: Field, key: string) {
    if (newField.type === FieldType.Bool) {
      newField.value = false;
    } else if (newField.type === FieldType.Number) {
      newField.value = 0;
    }

    const innerFields = getInnerFieldsByKey(key);
    const newInnerFields = [...(innerFields ?? []), newField];
    const fieldMaps = [...(selectiveInnerFields.data.fieldMaps ?? [])];
    const fieldMapIndex = fieldMaps.findIndex((f) => f.key === key);

    if (fieldMapIndex === -1) {
      fieldMaps.push({ key, fields: newInnerFields });
    } else {
      let fields = [...fieldMaps[fieldMapIndex].fields];
      fields.push(newField);
      fieldMaps[fieldMapIndex] = {
        key,
        fields,
      };
    }

    setInnerFields({
      ...selectiveInnerFields,
      data: {
        ...selectiveInnerFields.data,
        fieldMaps,
      },
    });
  }

  function moveItemUp(fieldIndex: number, key: string) {
    const innerFields = getInnerFieldsByKey(key);

    const tempInnerFields = Object.assign([], innerFields);
    const indexToMoveTo = fieldIndex === 0 ? 0 : fieldIndex - 1;
    const [reorderedItem] = tempInnerFields.splice(fieldIndex, 1);
    tempInnerFields.splice(indexToMoveTo, 0, reorderedItem);

    const fieldMaps = selectiveInnerFields.data.fieldMaps ?? [];
    const innerFieldIndex = fieldMaps.findIndex((f) => f.key === key);

    if (innerFieldIndex === -1) {
      fieldMaps.push({ key, fields: tempInnerFields });
    } else {
      fieldMaps[innerFieldIndex].fields = tempInnerFields;
    }

    setInnerFields({
      ...selectiveInnerFields,
      data: {
        ...selectiveInnerFields.data,
        fieldMaps,
      },
    });
  }

  function moveItemDown(fieldIndex: number, key: string) {
    const innerFields = getInnerFieldsByKey(key);

    const tempInnerFields = Object.assign([], innerFields ?? []);
    const indexToMoveTo =
      fieldIndex === tempInnerFields.length - 1
        ? tempInnerFields.length - 1
        : fieldIndex + 1;
    const [reorderedItem] = tempInnerFields.splice(fieldIndex, 1);
    tempInnerFields.splice(indexToMoveTo, 0, reorderedItem);

    const fieldMaps = selectiveInnerFields.data.fieldMaps ?? [];
    const innerFieldIndex = fieldMaps.findIndex((f) => f.key === key);

    if (innerFieldIndex === -1) {
      fieldMaps.push({ key, fields: tempInnerFields });
    } else {
      fieldMaps[innerFieldIndex].fields = tempInnerFields;
    }

    setInnerFields({
      ...selectiveInnerFields,
      data: {
        ...selectiveInnerFields.data,
        fieldMaps,
      },
    });
  }

  function getInnerFieldsByKey(key: string): Field[] {
    const innerFieldsMap = selectiveInnerFields.data.fieldMaps?.find(
      (f) => f.key === key
    );
    if (!innerFieldsMap || !innerFieldsMap.fields.length) return [];

    return innerFieldsMap.fields ?? [];
  }

  return (
    <>
      <EditSelectField />
      {(options.data.options ?? []).map((option, index) => {
        return (
          <Accordion
            key={index.toString()}
            title={Strings.newConditionalField + " " + option}
          >
            <div>
              <div>
                <div>
                  <ul className="flex flex-col gap-2">
                    {selectiveInnerFields.data.fieldMaps &&
                      (
                        selectiveInnerFields.data.fieldMaps.find(
                          (f) => f.key === option
                        )?.fields ?? []
                      ).map((field, fieldIndex) => {
                        return (
                          <li
                            className="bg-[#fff3cd] rounded-2xl px-2 py-2"
                            key={fieldIndex}
                          >
                            <div className="flex flex-row items-center justify-between px-2">
                              {/* <div>
                                <i
                                  className="bi-chevron-up d-block"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    moveItemUp(fieldIndex, option);
                                  }}
                                >
                                  up
                                </i>
                                <i
                                  className="bi-chevron-down d-block"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    moveItemDown(fieldIndex, option);
                                  }}
                                >
                                  down
                                </i>
                              </div> */}
                              <div className="flex flex-row gap-10">
                                <div>
                                  <h6 className="d-inline">{field.title}</h6>
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
                                    getInnerFieldsByKey(option) ?? [];
                                  const filteredFields = fields.filter(
                                    (_, index) => {
                                      return fieldIndex !== index;
                                    }
                                  );

                                  let newFieldMaps: FieldMap[] =
                                    field.fieldMaps ?? [];
                                  const fieldMapIndex = (
                                    field.fieldMaps ?? []
                                  ).findIndex((f) => f.key === option);

                                  if (fieldMapIndex === -1) {
                                    newFieldMaps.push({
                                      key: option,
                                      fields: filteredFields,
                                    });
                                  } else {
                                    newFieldMaps[fieldMapIndex].fields =
                                      filteredFields;
                                  }

                                  if (
                                    window.confirm(Strings.confirmDeleteInput)
                                  ) {
                                    setInnerFields({
                                      ...selectiveInnerFields,
                                      data: {
                                        ...selectiveInnerFields.data,
                                        fieldMaps: [...newFieldMaps],
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
                            fieldInputNecessity ===
                            FieldInputNecessity.Optional,
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
                            type="text"
                            className="inputDecoration"
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
                                key={innerOptionIndex}
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
              </div>
            </div>
          </Accordion>
        );
      })}
    </>
  );
}
export default EditSelectiveConditionalField;
