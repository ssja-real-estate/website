import { SetStateAction, useState } from "react";
import { InputGroup, Button, Form, Col, Row } from "react-bootstrap";
import { useRecoilState } from "recoil";

import Strings from "global/constants/strings";
import {
  defaultField,
  Field,
  FieldFilterableStatus,
  FieldFilterableStatusLabel,
  FieldInputNecessity,
  FieldInputNecessityLabel,
  FieldType,
  FieldTypeTitle,
} from "global/types/Field";
import { modalSectionAtom } from "../FormsState";
import NewConditionalField from "./NewConditionalField";
import { optionsAtom, innerFieldsAtom } from "./NewFieldStates";
import NewSelectField from "./NewSelectField";

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
      <Row className="align-items-center">
        <Col sm="auto">
          <Form.Label>{Strings.newInput}</Form.Label>
        </Col>
        <Col>
          <InputGroup style={{ direction: "ltr" }}>
            <Button
              variant="dark"
              onClick={() => {
                let newField: Field = {
                  ...defaultField,
                  title: newFieldTitle,
                  type: selectedType,
                  optional:
                    fieldInputNecessity === FieldInputNecessity.Optional,
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
                } else {
                  alert(Strings.enterValidTitleForInput);
                }
                setNewFieldTitle("");
                setFieldInputNecessity(FieldInputNecessity.Obligatory);
                setFilterableStatus(FieldFilterableStatus.IsNotFilterable);
              }}
            >
              <i className="bi-plus-lg fs-6"></i>
            </Button>
            <Form.Select
              style={{ minWidth: 100, maxWidth: "15vw" }}
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
            </Form.Select>
            <Form.Select
              style={{ minWidth: 50, maxWidth: "10vw" }}
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
            </Form.Select>
            <Form.Select
              style={{ minWidth: 100, maxWidth: "15vw" }}
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
            </Form.Select>
            <Form.Control
              type="text"
              placeholder={Strings.newInputTitle}
              maxLength={30}
              value={newFieldTitle}
              onChange={(e: { target: { value: SetStateAction<string> } }) => {
                setNewFieldTitle(e.target.value);
              }}
            />
          </InputGroup>
        </Col>
      </Row>
      {selectedType === FieldType.Select && <NewSelectField />}
      {selectedType === FieldType.BooleanConditional && <NewConditionalField />}
      {selectedType === FieldType.SelectiveConditional && <div></div>}
      {selectedType === FieldType.MultiSelect && <NewSelectField />}
    </>
  );
}

export default NewField;
