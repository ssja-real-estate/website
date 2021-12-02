import Strings from "global/constants/strings";
import { useState } from "react";
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
import CustomModal from "../../../../../../../components/CustomModal/CustomModal";
import {
  defaultField,
  Field,
  FieldType,
  FieldTypeTitle,
} from "../../../../../../../global/types/Field";
import { innerFieldModalDataAtom, Modal } from "../FormsState";

interface ModalField extends Field {
  id: string;
}

function EditConditionalField() {
  const [innerFieldModalData, setInnerFieldModalData] = useRecoilState(
    innerFieldModalDataAtom
  );
  const [showRenameInnerFieldModal, setShowRenameInnerFieldModal] =
    useState<boolean>(false);
  const [renameInnerFieldModalData, setRenameInnerFieldModalData] =
    useState<ModalField>();
  const [newInnerFieldTitle, setNewInnerFieldTitle] = useState<string>("");
  const [selectedType, setSelectedType] = useState<number>(0);
  const [options, setOptions] = useState<string[]>([]);
  const [newOptionTitle, setNewOptionTitle] = useState<string>("");
  const [showEditSelectFieldModal, setShowEditSelectFieldModal] =
    useState<boolean>(false);
  const [editSelectFieldModalData, setEditSelectFieldModalData] =
    useState<ModalField>();

  function addNewInnerField(newField: Field) {
    const newInnerFields = [newField, ...innerFieldModalData.data.fields!];
    setInnerFieldModalData({
      ...innerFieldModalData,
      data: {
        ...innerFieldModalData.data,
        fields: newInnerFields,
      },
    });
  }

  function updateChangedSelectField(
    modal: Modal<Field>,
    innerFieldIndex: string
  ) {
    const innerFields = Object.assign([], modal.data.fields!);
    // const changedField: Field = {
    //   id: editSelectFieldModalData!.id,
    //   title: editSelectFieldModalData!.title,
    //   type: editSelectFieldModalData!.type,
    //   value: editSelectFieldModalData!.value,
    //   options: editSelectFieldModalData!.options,
    // };
    // innerFields.splice(innerFieldIndex, 1, changedField);

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
                        ...innerField,
                        id: innerFieldIndex.toString(),
                      });
                      setShowRenameInnerFieldModal(true);
                    }}
                  ></i>
                </Col>
                <Col>
                  <h6 className="d-inline text-muted">
                    {innerField.type === FieldType.Text
                      ? FieldTypeTitle.Text
                      : innerField.type === FieldType.Number
                      ? FieldTypeTitle.Number
                      : innerField.type === FieldType.Select
                      ? FieldTypeTitle.Select
                      : innerField.type === FieldType.Bool
                      ? FieldTypeTitle.Bool
                      : innerField.type === FieldType.Conditional
                      ? FieldTypeTitle.Conditional
                      : innerField.type === FieldType.Image
                      ? FieldTypeTitle.Image
                      : "---"}
                  </h6>
                  {innerField.type === FieldType.Select && (
                    <i
                      className="bi-list fs-4 me-3"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setEditSelectFieldModalData({
                          ...innerField,
                          id: innerFieldIndex.toString(),
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
              alert(Strings.enterValidTitleForInnerInput);
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

      <CustomModal
        show={showRenameInnerFieldModal}
        title={Strings.editInnerInputTitle}
        cancelTitle={Strings.cancel}
        successTitle={Strings.save}
        handleClose={() => {
          setShowRenameInnerFieldModal(false);
        }}
        handleSuccess={() => {
          // const changedInnerField: Field = {
          //   ...renameInnerFieldModalData!,
          // };
          const innerFields = Object.assign(
            [],
            innerFieldModalData.data.fields!
          );
          // innerFields.splice(
          //   renameInnerFieldModalData!.id,
          //   1,
          //   changedInnerField
          // );

          setInnerFieldModalData({
            ...innerFieldModalData,
            data: {
              ...innerFieldModalData.data,
              fields: innerFields,
            },
          });
          setShowRenameInnerFieldModal(false);
        }}
      >
        <Form.Control
          type="text"
          placeholder={Strings.newTitle}
          value={renameInnerFieldModalData?.title}
          onChange={(e) => {
            setRenameInnerFieldModalData({
              ...renameInnerFieldModalData!,
              title: e.target.value,
            });
          }}
        />
      </CustomModal>
      <CustomModal
        show={showEditSelectFieldModal}
        title={Strings.editOptions}
        cancelTitle={Strings.cancel}
        successTitle={Strings.save}
        handleClose={() => {
          setShowEditSelectFieldModal(false);
        }}
        handleSuccess={() => {
          if (editSelectFieldModalData!.options!.length > 1) {
            updateChangedSelectField(
              innerFieldModalData,
              editSelectFieldModalData!.id
            );
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
                    const options = editSelectFieldModalData?.options!;
                    const newOptions = [...options, newOptionTitle];
                    setEditSelectFieldModalData({
                      ...editSelectFieldModalData!,
                      options: newOptions,
                    });
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
              {editSelectFieldModalData?.options?.map((option, optionIndex) => {
                return (
                  <ListGroup.Item
                    key={optionIndex}
                    className="d-flex flex-row justify-content-between align-items-center"
                  >
                    {option}
                    <CloseButton
                      onClick={() => {
                        const newOptions = editSelectFieldModalData.options!;
                        const filteredOptions = newOptions.filter(
                          (_, index) => {
                            return optionIndex !== index;
                          }
                        );
                        setEditSelectFieldModalData({
                          ...editSelectFieldModalData,
                          options: filteredOptions,
                        });
                      }}
                    />
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
          </div>
        </div>
      </CustomModal>
    </>
  );
}

export default EditConditionalField;
