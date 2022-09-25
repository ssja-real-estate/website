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
import { modalSectionAtom } from "../FormsState";
import NewConditionalField from "./NewConditionalField";
import {
  innerFieldsAtom,
  optionsAtom,
  selectiveInnerFieldsAtom,
} from "./NewFieldStates";
import NewSelectField from "./NewSelectField";
import NewSelectiveConditionalField from "./NewSelectiveConditionalField";
import * as BiIcon from "react-icons/bi";
function NewField() {
  const [modalSection, setModalSection] = useRecoilState(modalSectionAtom);
  const [selectedType, setSelectedType] = useState<number>(FieldType.Text);
  const [newFieldTitle, setNewFieldTitle] = useState<string>("");
  const [fieldInputNecessity, setFieldInputNecessity] = useState<number>(
    FieldInputNecessity.Obligatory
  );
  const [filterableStatus, setFilterableStatus] = useState(
    FieldFilterableStatus.IsNotFilterable
  );
  const [options, setOptions] = useRecoilState(optionsAtom);
  const [innerFields, setInnerFields] = useRecoilState(innerFieldsAtom);
  const [selectiveInnerFields, setSelectiveInnerFields] = useRecoilState(
    selectiveInnerFieldsAtom
  );

  function addNewField(newField: Field) {
    if (
      newField.type === FieldType.Bool ||
      newField.type === FieldType.BooleanConditional
    ) {
      newField.value = false;
    } else if (newField.type === FieldType.Number) {
      newField.value = 0;
    }
    const newFields = [...modalSection.data.fields, newField];
    setModalSection({
      ...modalSection,
      data: { ...modalSection.data, fields: newFields },
    });
  }

  return (
    <>
      <div className="flex flex-row items-center gap-2 text-dark-blue">
        <div>{Strings.newInput}</div>
        <div className="flex-1 flex flex-row items-center justify-between">
          <div className="flex flex-row items-center">
            <input
              type="text"
              className="inputDecoration w-[35vw]"
              // style={{ minWidth: 100, maxWidth: "40vw" }}
              placeholder={Strings.newInputTitle}
              maxLength={30}
              value={newFieldTitle}
              onChange={(e: { target: { value: SetStateAction<string> } }) => {
                setNewFieldTitle(e.target.value);
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
              <option value={FieldType.Text}>{FieldTypeTitle.Text}</option>
              <option value={FieldType.Number}>{FieldTypeTitle.Number}</option>
              <option value={FieldType.Select}>{FieldTypeTitle.Select}</option>
              <option value={FieldType.Bool}>{FieldTypeTitle.Bool}</option>
              <option value={FieldType.BooleanConditional}>
                {FieldTypeTitle.BooleanConditional}
              </option>
              <option value={FieldType.SelectiveConditional}>
                {FieldTypeTitle.SelectiveCondition}
              </option>
              <option value={FieldType.MultiSelect}>
                {FieldTypeTitle.MultiSelect}
              </option>
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
              let newField: Field = {
                ...defaultField,
                title: newFieldTitle,
                type: selectedType,
                optional: fieldInputNecessity === FieldInputNecessity.Optional,
                filterable:
                  filterableStatus === FieldFilterableStatus.IsFilterable,
              };

              if (newFieldTitle.trim() !== "") {
                if (selectedType === FieldType.Select) {
                  if (options.length < 2) {
                    alert(Strings.chooseAtLeastTwoOptionsForSelect);
                    return;
                  }
                  newField.options = options;
                  setOptions(options);
                } else if (selectedType === FieldType.BooleanConditional) {
                  if (innerFields.length === 0) {
                    alert(Strings.conditionalShouldHaveAtLeastOneField);
                    return;
                  }
                  newField.fields = innerFields;
                  setInnerFields(innerFields);
                } else if (selectedType === FieldType.SelectiveConditional) {
                  if (options.length < 1) {
                    alert(Strings.addAtLeastOneOption);
                    return;
                  }
                  newField.fieldMaps = selectiveInnerFields.fieldMaps ?? [];
                  newField.options = options;
                  setOptions(options);
                  setSelectiveInnerFields(selectiveInnerFields);
                } else if (selectedType === FieldType.MultiSelect) {
                  if (options.length < 2) {
                    alert(Strings.chooseAtLeastTwoKeysForMultiSelect);
                    return;
                  }
                  newField.keys = options;
                  setOptions(options);
                }
                addNewField(newField);
                setOptions([]);
                setInnerFields([]);
                setSelectiveInnerFields(defaultField);
              } else {
                alert(Strings.enterValidTitleForInput);
              }
              setNewFieldTitle("");
              setFieldInputNecessity(FieldInputNecessity.Obligatory);
              setFilterableStatus(FieldFilterableStatus.IsNotFilterable);
            }}
          >
            <BiIcon.BiPlus className="" />
          </button>
        </div>
      </div>
      {selectedType === FieldType.Select && <NewSelectField />}
      {selectedType === FieldType.BooleanConditional && <NewConditionalField />}
      {selectedType === FieldType.SelectiveConditional && (
        <NewSelectiveConditionalField />
      )}
      {selectedType === FieldType.MultiSelect && <NewSelectField />}
    </>
  );
}

export default NewField;
