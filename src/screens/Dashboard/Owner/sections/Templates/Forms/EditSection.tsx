import Strings from "global/constants/strings";
import Section from "global/types/Section";
import { useEffect, useRef, useState } from "react";
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
import CustomModal from "../../../../../../components/CustomModal/CustomModal";
import {
  Field,
  FieldType,
  FieldTypeTitle,
} from "../../../../../../global/types/Field";
import EditConditionalField from "./EditField/EditConditionalField";
import EditSelectField from "./EditField/EditSelectField";
import {
  editSelectFieldModalDataAtom,
  innerFieldModalDataAtom,
  modalSectionAtom,
} from "./FormsState";
import NewField from "./NewField/NewField";

interface EditFieldModalData {
  index: number;
  newTitle: string;
  newType: number;
}

function EditSection() {
  const [modalSection, setModalSection] = useRecoilState(modalSectionAtom);
  const [sectionTitle, setSectionTitle] = useState<string>("");
  const [showRenameFieldModal, setShowRenameFieldModal] =
    useState<boolean>(false);
  const [renameFieldModalData, setRenameFieldModalData] =
    useState<EditFieldModalData>({ index: -1, newTitle: "", newType: 0 });
  const [showEditInnerFieldsModal, setShowEditInnerFieldsModal] =
    useState<boolean>(false);
  const [innerFieldModalData, setInnerFieldModalData] = useRecoilState(
    innerFieldModalDataAtom
  );
  const [showEditSelectFieldModal, setShowEditSelectFieldModal] =
    useState<boolean>(false);
  const [editSelectFieldModalData, setEditSelectFieldModalData] =
    useRecoilState(editSelectFieldModalDataAtom);
  const mounted = useRef(true);

  useEffect(() => {
    if (mounted.current) {
      modalSection && setSectionTitle(modalSection.section.title);
    }

    return () => {
      mounted.current = false;
    };
  }, [modalSection, modalSection.section.title]);

  function moveItemUp(fieldIndex: number) {
    const tempFields = [...modalSection.section.fields];
    const indexToMoveTo = fieldIndex === 0 ? 0 : fieldIndex - 1;
    const [reorderedItem] = tempFields.splice(fieldIndex, 1);
    tempFields.splice(indexToMoveTo, 0, reorderedItem);
    setModalSection({
      ...modalSection,
      section: { ...modalSection.section, fields: tempFields },
    });
  }

  function moveItemDown(fieldIndex: number) {
    const tempFields = [...modalSection.section.fields];
    const indexToMoveTo =
      fieldIndex === tempFields.length - 1
        ? tempFields.length - 1
        : fieldIndex + 1;
    const [reorderedItem] = tempFields.splice(fieldIndex, 1);
    tempFields.splice(indexToMoveTo, 0, reorderedItem);
    setModalSection({
      ...modalSection!,
      section: { ...modalSection.section, fields: tempFields },
    });
  }

  function updateChangedConditionalField(fieldIndex: string) {
    const section: Section = { ...modalSection.section };
    const fields: Field[] = section.fields.slice();
    // const changedField: Field = {
    //   id: innerFieldModalData.id,
    //   title: innerFieldModalData.title,
    //   type: innerFieldModalData.type,
    //   value: innerFieldModalData.value,
    //   fields: innerFieldModalData.fields,
    // };
    // fields.splice(fieldIndex, 1, changedField);

    setModalSection({
      ...modalSection,
      section: { ...section, fields: fields },
    });
  }

  function updateChangedSelectField() {
    const section: Section = { ...modalSection.section };
    const fields: Field[] = section.fields.slice();

    // const changedField: Field = {
    //   id: editSelectFieldModalData!.id,
    //   title: editSelectFieldModalData!.title,
    //   type: editSelectFieldModalData!.type,
    //   value: editSelectFieldModalData!.value,
    //   options: editSelectFieldModalData!.options,
    // };
    // fields.splice(fieldIndex, 1, changedField);

    setModalSection({
      ...modalSection,
      section: { ...section, fields: fields },
    });
  }

  return (
    <>
      <Row className="align-items-center my-3">
        <Col sm="auto">
          <Form.Label>{Strings.sectionTitle}</Form.Label>
        </Col>
        <InputGroup style={{ direction: "ltr" }}>
          <Button
            variant="dark"
            onClick={() => {
              if (sectionTitle.trim() === "") {
                alert(Strings.enterValidTitleForSection);
                setSectionTitle("");
              } else {
                setModalSection({
                  ...modalSection,
                  section: { ...modalSection.section, title: sectionTitle },
                });
              }
            }}
          >
            {Strings.save}
          </Button>
          <Form.Control
            type="text"
            defaultValue={modalSection.section.title}
            onChange={(e) => {
              setSectionTitle(e.target.value);
            }}
          />
        </InputGroup>
      </Row>
      <ListGroup>
        {modalSection.section.fields.map((field, fieldIndex) => {
          return (
            <ListGroup.Item key={fieldIndex} variant="info">
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
                  <i
                    className="bi-pencil-fill me-2"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setRenameFieldModalData({
                        index: fieldIndex,
                        newTitle: field.title,
                        newType: field.type,
                      });
                      setShowRenameFieldModal(true);
                    }}
                  ></i>
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
                  {field.type === FieldType.Conditional ? (
                    <i
                      className="bi-list-ul fs-4 me-3"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setInnerFieldModalData({
                          ...field,
                          id: fieldIndex.toString(),
                        });
                        setShowEditInnerFieldsModal(true);
                      }}
                    ></i>
                  ) : (
                    field.type === FieldType.Select && (
                      <i
                        className="bi-list fs-4 me-3"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setEditSelectFieldModalData({
                            ...field,
                          });
                          setShowEditSelectFieldModal(true);
                        }}
                      ></i>
                    )
                  )}
                </Col>
                <CloseButton
                  className="m-3"
                  onClick={() => {
                    const fields = modalSection.section.fields;
                    const filteredFields = fields.filter((_, index) => {
                      return fieldIndex !== index;
                    });
                    if (window.confirm(Strings.confirmDeleteInput)) {
                      setModalSection({
                        ...modalSection,
                        section: {
                          ...modalSection.section,
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
      <CustomModal
        show={showRenameFieldModal}
        title={Strings.changeInputTitle}
        cancelTitle={Strings.cancel}
        successTitle={Strings.save}
        handleClose={() => {
          setShowRenameFieldModal(false);
        }}
        handleSuccess={() => {
          let fields = modalSection.section.fields.slice();
          let index = renameFieldModalData.index;

          if (index !== -1) {
            fields[index] = {
              ...fields[index],
              title: renameFieldModalData.newTitle,
              type: renameFieldModalData.newType,
            };
          }

          setModalSection({
            ...modalSection,
            section: { ...modalSection.section, fields: fields },
          });
          setShowRenameFieldModal(false);
          setRenameFieldModalData({ index: -1, newTitle: "", newType: 0 });
        }}
      >
        <Form.Control
          type="text"
          placeholder={Strings.newTitle}
          value={renameFieldModalData.newTitle}
          onChange={(e) => {
            setRenameFieldModalData({
              ...renameFieldModalData!,
              newTitle: e.target.value,
            });
          }}
        />
        <Form.Select
          value={renameFieldModalData.newType}
          onChange={(e) => {
            setRenameFieldModalData({
              ...renameFieldModalData,
              newType: Number(e.currentTarget.value),
            });
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
      </CustomModal>
      <CustomModal
        isFullscreen
        show={showEditInnerFieldsModal}
        title={Strings.editInnerInputs}
        cancelTitle={Strings.cancel}
        successTitle={Strings.save}
        handleClose={() => {
          setShowEditInnerFieldsModal(false);
        }}
        handleSuccess={() => {
          updateChangedConditionalField(innerFieldModalData.id ?? "");
          setShowEditInnerFieldsModal(false);
        }}
      >
        <EditConditionalField />
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
          if (editSelectFieldModalData.options!.length > 1) {
            updateChangedSelectField();
            setShowEditSelectFieldModal(false);
          } else {
            alert(Strings.chooseAtLeastTwoOptionsForSelect);
          }
        }}
      >
        <EditSelectField />
      </CustomModal>
      <div className="d-flex flex-column justify-content-center align-items-stretch my-3">
        <h5>{Strings.inputs}</h5>
        <NewField />
      </div>
    </>
  );
}

export default EditSection;
