import Strings from "global/constants/strings";
import { useState } from "react";
import { InputGroup, Button, Form, Col, Row } from "react-bootstrap";
import { useRecoilState } from "recoil";
import {
  defaultField,
  Field,
  FieldType,
  FieldTypeTitle,
} from "../../../../../../../global/types/Field";
import { modalSectionAtom } from "../FormsState";
import NewConditionalField from "./NewConditionalField";
import { optionsAtom, innerFieldsAtom } from "./NewFieldStates";
import NewSelectField from "./NewSelectField";

function NewField() {
  const [modalSection, setModalSection] = useRecoilState(modalSectionAtom);
  const [selectedType, setSelectedType] = useState<number>(FieldType.Text);
  const [newFieldTitle, setNewFieldTitle] = useState<string>("");
  const [options, setOptions] = useRecoilState(optionsAtom);
  const [innerFields, setInnerFields] = useRecoilState(innerFieldsAtom);

  function addNewField(newField: Field) {
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
                };

                if (newFieldTitle.trim() !== "") {
                  if (selectedType === FieldType.Select) {
                    if (options.length < 2) {
                      alert(Strings.chooseAtLeastTwoOptionsForSelect);
                      return;
                    }
                    newField.options = options;
                    setOptions(options);
                  } else if (selectedType === FieldType.Conditional) {
                    if (innerFields.length === 0) {
                      alert(Strings.conditionalShouldHaveAtLeastOneField);
                      return;
                    }
                    newField.fields = innerFields;
                    setInnerFields(innerFields);
                  }
                  addNewField(newField);
                  setNewFieldTitle("");
                  setOptions([]);
                  setInnerFields([]);
                } else {
                  setNewFieldTitle("");
                  alert(Strings.enterValidTitleForInput);
                }
              }}
            >
              <i className="bi-plus-lg fs-6"></i>
            </Button>
            <Form.Select
              style={{ minWidth: 100, maxWidth: "15vw" }}
              value={selectedType}
              onChange={(e) => {
                setSelectedType(Number(e.currentTarget.value));
              }}
            >
              <option value={FieldType.Text}>{FieldTypeTitle.Text}</option>
              <option value={FieldType.Number}>{FieldTypeTitle.Number}</option>
              <option value={FieldType.Select}>{FieldTypeTitle.Select}</option>
              <option value={FieldType.Bool}>{FieldTypeTitle.Bool}</option>
              <option value={FieldType.Conditional}>
                {FieldTypeTitle.Conditional}
              </option>
            </Form.Select>
            <Form.Control
              type="text"
              placeholder={Strings.newInputTitle}
              maxLength={30}
              value={newFieldTitle}
              onChange={(e) => {
                setNewFieldTitle(e.target.value);
              }}
            />
          </InputGroup>
        </Col>
      </Row>
      {selectedType === FieldType.Select ? (
        <NewSelectField />
      ) : (
        selectedType === FieldType.Conditional && <NewConditionalField />
      )}
    </>
  );
}

export default NewField;
