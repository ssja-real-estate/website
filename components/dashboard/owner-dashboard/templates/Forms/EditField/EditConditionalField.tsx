import { SetStateAction, useState } from "react";
import {
  Button,
  CloseButton,
  Col,
  Form,
  InputGroup,
  ListGroup,
  Row,
} from "react-bootstrap";
import { useRecoilState } from "recoil";

import CustomModal from "components/CustomModal/CustomModal";
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
import { getFieldTypeAndNecessity } from "services/utilities/stringUtility";
import {
  defaultEditSelectFieldModalData,
  EditFieldModalData,
  editSelectFieldModalDataAtom,
  innerFieldModalDataAtom,
} from "../FormsState";

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
      <ListGroup>
        {innerFieldModalData.data.fields!.map((innerField, innerFieldIndex) => {
          return (
            <ListGroup.Item key={innerFieldIndex} variant="warning">
              <Row className="align-items-center">
                <Col xs="auto">
                  <i
                    className="bi-chevron-up d-block"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      moveItemUp(innerFieldIndex);
                    }}
                  ></i>
                  <i
                    className="bi-chevron-down d-block"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      moveItemDown(innerFieldIndex);
                    }}
                  ></i>
                </Col>
                <Col>
                  <h6 className="d-inline">{innerField.title}</h6>
                  <i
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
                  ></i>
                </Col>
                <Col>
                  <h6 className="d-inline text-muted">
                    {getFieldTypeAndNecessity(innerField)}
                  </h6>
                  {innerField.type === FieldType.Select && (
                    <i
                      className="bi-list fs-4 me-3"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setEditSelectFieldModalData({
                          index: innerFieldIndex,
                          data: { ...innerField },
                        });
                        setShowEditSelectFieldModal(true);
                      }}
                    ></i>
                  )}
                </Col>
                <CloseButton
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
        </Form.Select>
        <Form.Control
          type="text"
          placeholder={Strings.newInnerInputTitle}
          maxLength={30}
          value={newInnerFieldTitle}
          onChange={(e: { target: { value: SetStateAction<string> } }) => {
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
                  } else {
                    alert(Strings.enterValidInputForNewOption);
                  }
                  setNewOptionTitle("");
                }}
              >
                <i className="bi-plus-lg fs-6"></i>
              </Button>
              <Form.Control
                type="text"
                placeholder={Strings.newOption}
                value={newOptionTitle}
                onChange={(e: {
                  target: { value: SetStateAction<string> };
                }) => {
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

      <CustomModal
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
        <InputGroup style={{ direction: "rtl" }}>
          <Form.Control
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
          <Form.Select
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
          </Form.Select>
          <Form.Select
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
          </Form.Select>
        </InputGroup>
      </CustomModal>
      <CustomModal
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
        <div className="w-100 d-flex flex-row justify-content-center">
          <div className="d-flex flex-column justify-content-center gap-2 pt-3">
            <InputGroup style={{ direction: "ltr" }}>
              <Button
                variant="dark"
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
                <i className="bi-plus-lg fs-6"></i>
              </Button>
              <Form.Control
                type="text"
                placeholder={Strings.newOption}
                value={newOptionTitle}
                onChange={(e: {
                  target: { value: SetStateAction<string> };
                }) => {
                  setNewOptionTitle(e.target.value);
                }}
              />
            </InputGroup>
            <ListGroup>
              {editSelectFieldModalData.data.options?.map(
                (option, optionIndex) => {
                  return (
                    <ListGroup.Item
                      key={optionIndex}
                      className="d-flex flex-row justify-content-between align-items-center"
                    >
                      {option}
                      <CloseButton
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
                      />
                    </ListGroup.Item>
                  );
                }
              )}
            </ListGroup>
          </div>
        </div>
      </CustomModal>
    </>
  );
}

export default EditConditionalField;
