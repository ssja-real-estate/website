import { useState } from "react";
import {
  Accordion,
  Button,
  CloseButton,
  Col,
  Form,
  InputGroup,
  ListGroup,
  Row,
} from "react-bootstrap";
import { useRecoilState } from "recoil";

import Strings from "global/constants/strings";
import {
  defaultField,
  Field,
  FieldType,
  FieldTypeTitle,
} from "global/types/Field";
import { innerFieldsAtom } from "./NewFieldStates";

function NewConditionalField() {
  const [innerFields, setInnerFields] = useRecoilState(innerFieldsAtom);
  const [newInnerFieldTitle, setNewInnerFieldTitle] = useState<string>("");
  const [selectedType, setSelectedType] = useState<number>(0);
  const [newOptionTitle, setNewOptionTitle] = useState<string>("");
  const [options, setOptions] = useState<string[]>([]);

  function addNewInnerField(newField: Field) {
    if (newField.type === FieldType.Bool) {
      newField.value = false;
    } else if (newField.type === FieldType.Number) {
      newField.value = 0;
    }
    const newInnerFields = [newField, ...innerFields];
    setInnerFields(newInnerFields);
  }

  function moveItemUp(fieldIndex: number) {
    const tempInnerFields = Object.assign([], innerFields);
    const indexToMoveTo = fieldIndex === 0 ? 0 : fieldIndex - 1;
    const [reorderedItem] = tempInnerFields.splice(fieldIndex, 1);
    tempInnerFields.splice(indexToMoveTo, 0, reorderedItem);
    setInnerFields(tempInnerFields);
  }

  function moveItemDown(fieldIndex: number) {
    const tempInnerFields = Object.assign([], innerFields);
    const indexToMoveTo =
      fieldIndex === tempInnerFields.length - 1
        ? tempInnerFields.length - 1
        : fieldIndex + 1;
    const [reorderedItem] = tempInnerFields.splice(fieldIndex, 1);
    tempInnerFields.splice(indexToMoveTo, 0, reorderedItem);
    setInnerFields(tempInnerFields);
  }

  return (
    <Accordion className="mt-3">
      <Accordion.Item eventKey="0">
        <Accordion.Header>
          <span className="ms-3">{Strings.newConditionalField}</span>
        </Accordion.Header>
        <Accordion.Body>
          <ListGroup>
            {innerFields.map((field, fieldIndex) => {
              return (
                <ListGroup.Item key={fieldIndex} variant="warning">
                  <Row className="align-items-center">
                    <Col xs="auto">
                      <i
                        className="bi-chevron-up d-block"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          moveItemUp(fieldIndex);
                        }}
                      ></i>
                      <i
                        className="bi-chevron-down d-block"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          moveItemDown(fieldIndex);
                        }}
                      ></i>
                    </Col>
                    <Col>
                      <h6 className="d-inline">{field.title}</h6>
                    </Col>
                    <Col>
                      <h6 className="d-inline text-muted">
                        {field.type === FieldType.Text
                          ? FieldTypeTitle.Text
                          : field.type === FieldType.Number
                          ? FieldTypeTitle.Number
                          : field.type === FieldType.Select
                          ? FieldTypeTitle.Select
                          : field.type === FieldType.Bool
                          ? FieldTypeTitle.Bool
                          : field.type === FieldType.Conditional
                          ? FieldTypeTitle.Conditional
                          : field.type === FieldType.Image
                          ? FieldTypeTitle.Image
                          : "---"}
                      </h6>
                    </Col>
                    <CloseButton
                      className="m-3"
                      onClick={() => {
                        const fields = innerFields;
                        const filteredFields = fields.filter((_, index) => {
                          return fieldIndex !== index;
                        });
                        if (window.confirm(Strings.confirmDeleteInput)) {
                          setInnerFields(filteredFields);
                        }
                      }}
                    />
                  </Row>
                </ListGroup.Item>
              );
            })}
          </ListGroup>
          <InputGroup className="mt-3" style={{ direction: "ltr" }}>
            <Button
              variant="dark"
              onClick={() => {
                let newInnerField: Field = {
                  ...defaultField,
                  title: newInnerFieldTitle,
                  type: selectedType,
                };
                if (newInnerFieldTitle.trim() !== "") {
                  if (selectedType === FieldType.Select) {
                    if (options.length < 2) {
                      alert(Strings.chooseAtLeastTwoOptionsForSelect);
                      return;
                    }
                  }
                  addNewInnerField(newInnerField);
                  setNewInnerFieldTitle("");
                  setOptions([]);
                } else {
                  setNewInnerFieldTitle("");
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
            </Form.Select>
            <Form.Control
              type="text"
              placeholder={Strings.newInnerInputTitle}
              maxLength={30}
              value={newInnerFieldTitle}
              onChange={(e) => {
                setNewInnerFieldTitle(e.target.value);
              }}
            />
          </InputGroup>
          {selectedType === FieldType.Select && (
            <div className="w-100 d-flex flex-row justify-content-center">
              <div className="d-flex flex-column justify-content-center gap-2 pt-3">
                <InputGroup style={{ direction: "ltr" }}>
                  <Button
                    variant="dark"
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
                    <i className="bi-plus-lg fs-6"></i>
                  </Button>
                  <Form.Control
                    type="text"
                    placeholder={Strings.newOption}
                    value={newOptionTitle}
                    onChange={(e) => {
                      setNewOptionTitle(e.target.value);
                    }}
                  />
                </InputGroup>
                <ListGroup>
                  {options.map((option, optionIndex) => {
                    return (
                      <ListGroup.Item
                        key={optionIndex}
                        className="d-flex flex-row justify-content-between align-items-center"
                      >
                        {option}
                        <CloseButton
                          onClick={() => {
                            const newOptions = options;
                            const filteredOptions = newOptions.filter(
                              (_, index) => {
                                return optionIndex !== index;
                              }
                            );
                            setOptions(filteredOptions);
                          }}
                        />
                      </ListGroup.Item>
                    );
                  })}
                </ListGroup>
              </div>
            </div>
          )}
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
}

export default NewConditionalField;
