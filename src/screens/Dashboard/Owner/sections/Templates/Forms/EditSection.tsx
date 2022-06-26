import { useEffect, useRef, useState } from "react";
import {
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
  Field,
  FieldFilterableStatus,
  FieldFilterableStatusLabel,
  FieldInputNecessity,
  FieldInputNecessityLabel,
  FieldType,
} from "global/types/Field";
import Section from "global/types/Section";
import { getFieldTypeAndNecessity } from "services/utilities/stringUtility";
import EditConditionalField from "./EditField/EditConditionalField";
import EditSelectField from "./EditField/EditSelectField";
import {
  defaultEditSelectFieldModalData,
  EditFieldModalData,
  editSelectFieldModalDataAtom,
  innerFieldModalDataAtom,
  modalSectionAtom,
} from "./FormsState";
import NewField from "./NewField/NewField";

function EditSection() {
  const [modalSection, setModalSection] = useRecoilState(modalSectionAtom);
  const [showRenameFieldModal, setShowRenameFieldModal] =
    useState<boolean>(false);
  const [renameFieldModalData, setRenameFieldModalData] =
    useState<EditFieldModalData>({
      index: -1,
      newTitle: "",
      newType: 0,
      newFieldInputNecessity: FieldInputNecessity.Obligatory,
      filterable: false,
    });
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
    return () => {
      mounted.current = false;
    };
  }, [modalSection, modalSection.data.title]);

  function moveItemUp(fieldIndex: number) {
    const tempFields = [...modalSection.data.fields];
    const indexToMoveTo = fieldIndex === 0 ? 0 : fieldIndex - 1;
    const [reorderedItem] = tempFields.splice(fieldIndex, 1);
    tempFields.splice(indexToMoveTo, 0, reorderedItem);
    setModalSection({
      ...modalSection,
      data: { ...modalSection.data, fields: tempFields },
    });
  }

  function moveItemDown(fieldIndex: number) {
    const tempFields = [...modalSection.data.fields];
    const indexToMoveTo =
      fieldIndex === tempFields.length - 1
        ? tempFields.length - 1
        : fieldIndex + 1;
    const [reorderedItem] = tempFields.splice(fieldIndex, 1);
    tempFields.splice(indexToMoveTo, 0, reorderedItem);
    setModalSection({
      ...modalSection!,
      data: { ...modalSection.data, fields: tempFields },
    });
  }

  function updateChangedConditionalField() {
    const section: Section = { ...modalSection.data };
    const fields: Field[] = section.fields.slice();
    const fieldIndex = innerFieldModalData.index;
    const data = innerFieldModalData.data;

    const changedField: Field = {
      id: data.id,
      title: data.title,
      type: data.type,
      value: data.value,
      fields: data.fields!,
    };
    fields.splice(fieldIndex, 1, changedField);

    setModalSection({
      ...modalSection,
      data: { ...modalSection.data, fields: fields },
    });
  }

  function updateChangedSelectField() {
    const section: Section = { ...modalSection.data };
    const fields: Field[] = section.fields.slice();
    const fieldIndex = editSelectFieldModalData.index;
    const data = editSelectFieldModalData.data;

    const changedField: Field = {
      id: data.id,
      title: data.title,
      type: data.type,
      value: data.value,
      options: data.options,
      keys: data.keys,
    };
    fields.splice(fieldIndex, 1, changedField);

    setModalSection({
      ...modalSection,
      data: { ...modalSection.data, fields: fields },
    });
  }

  return (
    <>
      <ListGroup>
        {modalSection.data.fields.map((field, fieldIndex) => {
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
                  {field.type !== FieldType.Image ? (
                    <i
                      className="bi-pencil-fill me-2"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setRenameFieldModalData({
                          index: fieldIndex,
                          newTitle: field.title,
                          newType: field.type,
                          newFieldInputNecessity: field.optional
                            ? FieldInputNecessity.Optional
                            : FieldInputNecessity.Obligatory,
                          filterable: field.filterable,
                        });
                        setShowRenameFieldModal(true);
                      }}
                    ></i>
                  ) : null}
                </Col>
                <Col>
                  <h6 className="d-inline text-muted">
                    {getFieldTypeAndNecessity(field)}
                  </h6>

                  {field.type === FieldType.BooleanConditional && (
                    <i
                      className="bi-list-ul fs-4 me-3"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setInnerFieldModalData({
                          index: fieldIndex,
                          data: { ...field },
                        });
                        setShowEditInnerFieldsModal(true);
                      }}
                    ></i>
                  )}
                  {(field.type === FieldType.Select ||
                    field.type === FieldType.MultiSelect) && (
                    <i
                      className="bi-list fs-4 me-3"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setEditSelectFieldModalData({
                          index: fieldIndex,
                          data: { ...field },
                        });
                        setShowEditSelectFieldModal(true);
                      }}
                    ></i>
                  )}
                </Col>
                {field.type !== FieldType.Image ? (
                  <CloseButton
                    className="m-3"
                    onClick={() => {
                      const fields = modalSection.data.fields;
                      const filteredFields = fields.filter((_, index) => {
                        return fieldIndex !== index;
                      });
                      if (window.confirm(Strings.confirmDeleteInput)) {
                        setModalSection({
                          ...modalSection,
                          data: {
                            ...modalSection.data,
                            fields: filteredFields,
                          },
                        });
                      }
                    }}
                  />
                ) : null}
              </Row>
            </ListGroup.Item>
          );
        })}
      </ListGroup>
      <CustomModal
        show={showRenameFieldModal}
        isLarge
        title={Strings.changeInputTitle}
        cancelTitle={Strings.cancel}
        successTitle={Strings.save}
        handleClose={() => {
          setShowRenameFieldModal(false);
        }}
        handleSuccess={() => {
          let fields = modalSection.data.fields.slice();
          let index = renameFieldModalData.index;

          if (index !== -1) {
            fields[index] = {
              ...fields[index],
              title: renameFieldModalData.newTitle,
              type: renameFieldModalData.newType,
              optional:
                renameFieldModalData.newFieldInputNecessity ===
                FieldInputNecessity.Optional,
              filterable: renameFieldModalData.filterable,
            };
          }

          setModalSection({
            ...modalSection,
            data: { ...modalSection.data, fields: fields },
          });
          setShowRenameFieldModal(false);
          setRenameFieldModalData({ index: -1, newTitle: "", newType: 0 });
        }}
      >
        <InputGroup style={{ direction: "rtl" }}>
          <Form.Control
            type="text"
            placeholder={Strings.newTitle}
            value={renameFieldModalData.newTitle}
            onChange={(e: { target: { value: any } }) => {
              setRenameFieldModalData({
                ...renameFieldModalData!,
                newTitle: e.target.value,
              });
            }}
          />
          <Form.Select
            style={{ minWidth: 50, maxWidth: "10vw" }}
            value={
              renameFieldModalData.filterable
                ? FieldFilterableStatus.IsFilterable
                : FieldFilterableStatus.IsNotFilterable
            }
            onChange={(e: { currentTarget: { value: string | number } }) => {
              const value = +e.currentTarget.value;
              setRenameFieldModalData({
                ...renameFieldModalData!,
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
            value={renameFieldModalData.newFieldInputNecessity}
            onChange={(e: { currentTarget: { value: any } }) => {
              setRenameFieldModalData({
                ...renameFieldModalData!,
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
        isFullscreen
        show={showEditInnerFieldsModal}
        title={Strings.editInnerInputs}
        cancelTitle={Strings.cancel}
        successTitle={Strings.save}
        handleClose={() => {
          setShowEditInnerFieldsModal(false);
        }}
        handleSuccess={() => {
          updateChangedConditionalField();
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
          setEditSelectFieldModalData(defaultEditSelectFieldModalData);
        }}
        handleSuccess={() => {
          const selectField = editSelectFieldModalData.data;
          let validToUpdate =
            (selectField.type === FieldType.Select &&
              selectField.options!.length > 1) ||
            (selectField.type === FieldType.MultiSelect &&
              selectField.keys!.length > 1);

          if (validToUpdate) {
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
