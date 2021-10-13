import { useEffect, useRef, useState } from 'react';
import {
  Button,
  CloseButton,
  Col,
  Form,
  InputGroup,
  ListGroup,
  Row,
} from 'react-bootstrap';
import { atom, useRecoilState } from 'recoil';
import CustomModal from '../../../../../../components/CustomModal/CustomModal';
import { Section } from '../../../../../../global/types/EstateForm';
import { Field, FieldType } from '../../../../../../global/types/Field';
import EditConditionalField from './EditField/EditConditionalField';
import EditSelectField from './EditField/EditSelectField';
import { modalSectionAtom } from './FormsState';
import NewField from './NewField/NewField';

interface ModalSection extends Section {
  id: number;
}

interface ModalField extends Field {
  id: number;
}

export const innerFieldModalDataAtom = atom<ModalField>({
  key: 'ownerEditInnerFieldsModalDataState',
  default: {
    title: '',
    name: '',
    type: FieldType.Conditional,
    value: false,
    fields: [],
    id: 0,
  },
});

export const editSelectFieldModalDataAtom = atom<ModalField>({
  key: 'ownerEditSelectFieldModalState',
  default: {
    title: '',
    name: '',
    type: FieldType.Select,
    value: '',
    options: [],
    id: 0,
  },
});

function EditSection() {
  const [modalSection, setModalSection] = useRecoilState(modalSectionAtom);
  const [sectionTitle, setSectionTitle] = useState<string>('');
  const [showRenameFieldModal, setShowRenameFieldModal] =
    useState<boolean>(false);
  const [renameFieldModalData, setRenameFieldModalData] =
    useState<ModalField>();
  const [showEditInnerFieldsModal, setShowEditInnerFieldsModal] =
    useState<boolean>(false);
  const [innerFieldModalData, setInnerFieldModalData] = useRecoilState(
    innerFieldModalDataAtom
  );
  const [showEditSelectFieldModal, setShowEditSelectFieldModal] =
    useState<boolean>(false);
  const [editSelectFieldModalData, setEditSelectFieldModalData] =
    useRecoilState(editSelectFieldModalDataAtom);
  // const [state, setGlobalState] = useRecoilState(globalState);
  const mounted = useRef(true);

  useEffect(() => {
    if (mounted.current) {
      modalSection && setSectionTitle(modalSection.title);
    }

    return () => {
      mounted.current = false;
    };
  }, [modalSection, modalSection?.title]);

  function moveItemUp(fieldIndex: number) {
    const tempFields = [...modalSection!.fields];
    const indexToMoveTo = fieldIndex === 0 ? 0 : fieldIndex - 1;
    const [reorderedItem] = tempFields.splice(fieldIndex, 1);
    tempFields.splice(indexToMoveTo, 0, reorderedItem);
    setModalSection({ ...modalSection!, fields: tempFields });
  }

  function moveItemDown(fieldIndex: number) {
    const tempFields = [...modalSection!.fields];
    const indexToMoveTo =
      fieldIndex === tempFields.length - 1
        ? tempFields.length - 1
        : fieldIndex + 1;
    const [reorderedItem] = tempFields.splice(fieldIndex, 1);
    tempFields.splice(indexToMoveTo, 0, reorderedItem);
    setModalSection({ ...modalSection!, fields: tempFields });
  }

  function updateChangedConditionalField(
    section: ModalSection,
    fieldIndex: number
  ) {
    const fields = Object.assign([], section.fields);
    const changedField: Field = {
      title: innerFieldModalData.title,
      name: innerFieldModalData.name,
      type: innerFieldModalData.type,
      value: innerFieldModalData.value,
      fields: innerFieldModalData.fields,
    };
    fields.splice(fieldIndex, 1, changedField);

    setModalSection({ ...section, fields: fields });
  }

  function updateChangedSelectField(section: ModalSection, fieldIndex: number) {
    const fields = Object.assign([], section.fields);
    const changedField: Field = {
      title: editSelectFieldModalData!.title,
      name: editSelectFieldModalData!.name,
      type: editSelectFieldModalData!.type,
      value: editSelectFieldModalData!.value,
      options: editSelectFieldModalData!.options,
    };
    fields.splice(fieldIndex, 1, changedField);

    setModalSection({ ...section, fields: fields });
  }

  return (
    <>
      <Row className="align-items-center my-3">
        <Col sm="auto">
          <Form.Label>عنوان بخش</Form.Label>
        </Col>
        <InputGroup style={{ direction: 'ltr' }}>
          <Button
            variant="dark"
            onClick={() => {
              if (sectionTitle.trim() === '') {
                alert('لطفاً یک عنوان معتبر برای بخش انتخاب کنید');
                setSectionTitle('');
              } else {
                setModalSection({
                  ...modalSection!,
                  title: sectionTitle!,
                });
              }
            }}
          >
            ذخیره
          </Button>
          <Form.Control
            type="text"
            value={sectionTitle}
            onChange={(e) => {
              setSectionTitle(e.target.value);
            }}
          />
        </InputGroup>
      </Row>
      <ListGroup>
        {modalSection?.fields.map((field, fieldIndex) => {
          return (
            <ListGroup.Item key={fieldIndex} variant="info">
              <Row className="align-items-center">
                <Col xs="auto">
                  <i
                    className="bi-chevron-up d-block"
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      moveItemUp(fieldIndex);
                    }}
                  ></i>
                  <i
                    className="bi-chevron-down d-block"
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      moveItemDown(fieldIndex);
                    }}
                  ></i>
                </Col>
                <Col>
                  <h6 className="d-inline">{field.title}</h6>
                  <i
                    className="bi-pencil-fill me-2"
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      setRenameFieldModalData({
                        ...field,
                        id: fieldIndex,
                      });
                      setShowRenameFieldModal(true);
                    }}
                  ></i>
                </Col>
                <Col>
                  <h6 className="d-inline text-muted">
                    {field.type === FieldType.Text
                      ? 'متن'
                      : field.type === FieldType.Number
                      ? 'عدد'
                      : field.type === FieldType.Select
                      ? 'انتخابی'
                      : field.type === FieldType.Bool
                      ? 'کلید'
                      : field.type === FieldType.Conditional
                      ? 'شرطی'
                      : field.type === FieldType.Image
                      ? 'تصویر'
                      : '---'}
                  </h6>
                  {field.type === FieldType.Conditional ? (
                    <i
                      className="bi-list-ul fs-4 me-3"
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        setInnerFieldModalData({
                          ...field,
                          id: fieldIndex,
                        });
                        setShowEditInnerFieldsModal(true);
                      }}
                    ></i>
                  ) : (
                    field.type === FieldType.Select && (
                      <i
                        className="bi-list fs-4 me-3"
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          setEditSelectFieldModalData({
                            ...field,
                            id: fieldIndex,
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
                    const fields = modalSection.fields;
                    const filteredFields = fields.filter((_, index) => {
                      return fieldIndex !== index;
                    });
                    if (window.confirm('آیا از حذف این ورودی مطمئن هستید؟')) {
                      setModalSection({
                        ...modalSection,
                        fields: filteredFields,
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
        title="تغییر عنوان ورودی"
        cancelTitle="لغو"
        successTitle="ذخیره"
        handleClose={() => {
          setShowRenameFieldModal(false);
        }}
        handleSuccess={() => {
          const changedField: Field = {
            ...renameFieldModalData!,
          };
          const fields = Object.assign([], modalSection.fields);
          fields.splice(renameFieldModalData!.id, 1, changedField);

          setModalSection({ ...modalSection, fields: fields });
          setShowRenameFieldModal(false);
        }}
      >
        <Form.Control
          type="text"
          placeholder="عنوان جدید"
          value={renameFieldModalData?.title}
          onChange={(e) => {
            setRenameFieldModalData({
              ...renameFieldModalData!,
              title: e.target.value,
            });
          }}
        />
      </CustomModal>
      <CustomModal
        isFullscreen
        show={showEditInnerFieldsModal}
        title="ویرایش ورودی های داخلی"
        cancelTitle="لغو"
        successTitle="ذخیره"
        handleClose={() => {
          setShowEditInnerFieldsModal(false);
        }}
        handleSuccess={() => {
          updateChangedConditionalField(modalSection, innerFieldModalData.id);
          setShowEditInnerFieldsModal(false);
        }}
      >
        <EditConditionalField />
      </CustomModal>
      <CustomModal
        show={showEditSelectFieldModal}
        title="ویرایش گزینه های ورودی انتخابی"
        cancelTitle="لغو"
        successTitle="ذخیره"
        handleClose={() => {
          setShowEditSelectFieldModal(false);
        }}
        handleSuccess={() => {
          if (editSelectFieldModalData!.options!.length > 1) {
            updateChangedSelectField(
              modalSection,
              editSelectFieldModalData!.id
            );
            setShowEditSelectFieldModal(false);
          } else {
            alert('لطفاً حداقل دو گزینه برای ورودی جدید انتخاب کنید');
          }
        }}
      >
        <EditSelectField />
      </CustomModal>
      <div className="d-flex flex-column justify-content-center align-items-stretch my-3">
        <h5>ورودی ها</h5>
        <NewField />
      </div>
    </>
  );
}

export default EditSection;
