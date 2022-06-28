import { SetStateAction, useEffect, useState } from "react";
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
  FieldFilterableStatus,
  FieldFilterableStatusLabel,
  FieldInputNecessity,
  FieldInputNecessityLabel,
  FieldType,
  FieldTypeTitle,
} from "global/types/Field";
import { optionsAtom, selectiveInnerFieldsAtom } from "./NewFieldStates";
import { getFieldTypeAndNecessity } from "services/utilities/stringUtility";
import NewSelectField from "./NewSelectField";

function NewSelectiveConditionalField() {
  const [selectiveInnerFields, setInnerFields] = useRecoilState(
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [options, setOptions] = useRecoilState(optionsAtom);

  console.log(options);

  useEffect(() => {}, [options]);

  function addNewInnerField(newField: Field, key: string) {
    if (newField.type === FieldType.Bool) {
      newField.value = false;
    } else if (newField.type === FieldType.Number) {
      newField.value = 0;
    }
    const newInnerFields = [...(selectiveInnerFields[key] ?? []), newField];
    setInnerFields({
      ...selectiveInnerFields,
      [key]: newInnerFields,
    });
  }

  function moveItemUp(fieldIndex: number, key: string) {
    const tempInnerFields = Object.assign([], selectiveInnerFields[key]);
    const indexToMoveTo = fieldIndex === 0 ? 0 : fieldIndex - 1;
    const [reorderedItem] = tempInnerFields.splice(fieldIndex, 1);
    tempInnerFields.splice(indexToMoveTo, 0, reorderedItem);
    setInnerFields({
      ...selectiveInnerFields,
      [key]: tempInnerFields,
    });
  }

  function moveItemDown(fieldIndex: number, key: string) {
    const tempInnerFields = Object.assign([], selectiveInnerFields[key]);
    const indexToMoveTo =
      fieldIndex === tempInnerFields.length - 1
        ? tempInnerFields.length - 1
        : fieldIndex + 1;
    const [reorderedItem] = tempInnerFields.splice(fieldIndex, 1);
    tempInnerFields.splice(indexToMoveTo, 0, reorderedItem);
    setInnerFields({
      ...selectiveInnerFields,
      [key]: tempInnerFields,
    });
  }

  return (
    <Accordion className="mt-3">
      <NewSelectField />

      {options.map((option, index) => {
        return (
          <>
            <h3>{option}</h3>
            <Accordion.Item eventKey={index.toString()}>
              <Accordion.Header>
                <span className="ms-3">{Strings.newConditionalField}</span>
              </Accordion.Header>
              <Accordion.Body>
                <ListGroup>
                  {selectiveInnerFields[option] &&
                    selectiveInnerFields[option].map((field, fieldIndex) => {
                      return (
                        <ListGroup.Item key={fieldIndex} variant="warning">
                          <Row className="align-items-center">
                            <Col xs="auto">
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
                            </Col>
                            <Col>
                              <h6 className="d-inline">{field.title}</h6>
                            </Col>
                            <Col>
                              <h6 className="d-inline text-muted">
                                {getFieldTypeAndNecessity(field)}
                              </h6>
                            </Col>
                            <CloseButton
                              className="m-3"
                              onClick={() => {
                                const fields = selectiveInnerFields[option];
                                const filteredFields = fields.filter(
                                  (_, index) => {
                                    return fieldIndex !== index;
                                  }
                                );
                                if (
                                  window.confirm(Strings.confirmDeleteInput)
                                ) {
                                  setInnerFields({
                                    ...selectiveInnerFields,
                                    [option]: filteredFields,
                                  });
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
                    style={{ minWidth: 100, maxWidth: "15vw" }}
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
                  </Form.Select>
                  <Form.Select
                    style={{ minWidth: 100, maxWidth: "15vw" }}
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
                  </Form.Select>
                  <Form.Control
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
                </InputGroup>
                {selectedType === FieldType.Select && (
                  <div className="w-100 d-flex flex-row justify-content-center">
                    <div className="d-flex flex-column justify-content-center gap-2 pt-3">
                      <InputGroup style={{ direction: "ltr" }}>
                        <Button
                          variant="dark"
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
                          <i className="bi-plus-lg fs-6"></i>
                        </Button>
                        <Form.Control
                          type="text"
                          placeholder={Strings.newOption}
                          value={innerNewOptionTitle}
                          onChange={(e: {
                            target: { value: SetStateAction<string> };
                          }) => {
                            setInnerNewOptionTitle(e.target.value);
                          }}
                        />
                      </InputGroup>
                      <ListGroup>
                        {innerOptions.map((innerOption, innerOptionIndex) => {
                          return (
                            <ListGroup.Item
                              key={innerOptionIndex}
                              className="d-flex flex-row justify-content-between align-items-center"
                            >
                              {innerOption}
                              <CloseButton
                                onClick={() => {
                                  const newOptions = innerOptions;
                                  const filteredOptions = newOptions.filter(
                                    (_, index) => {
                                      return innerOptionIndex !== index;
                                    }
                                  );
                                  setInnerOptions(filteredOptions);
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
          </>
        );
      })}
    </Accordion>
  );
}

export default NewSelectiveConditionalField;
