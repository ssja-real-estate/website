import { useEffect, useState } from 'react';
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd';
import {
  Button,
  CloseButton,
  Col,
  Form,
  InputGroup,
  ListGroup,
  Row,
  Spinner,
} from 'react-bootstrap';
import {
  DelegationType,
  EstateType,
} from '../../../../../../global/types/Estate';
import { EstateForm, Section } from '../../../../../../global/types/EstateForm';
import {
  FieldType,
  FieldTypeTitle,
} from '../../../../../../global/types/Field';
import { fetchGet, fetchPut } from '../../../../../../services/api/fetch';
import CustomModal from '../../../../../../components/CustomModal/CustomModal';
import EditSection from './EditSection';
import { atom, useRecoilState } from 'recoil';
import toast from 'react-hot-toast';

interface ModalSection extends Section {
  id: number;
}

export const modalSectionAtom = atom<ModalSection>({
  key: 'ownerModalSectionState',
  default: {
    id: 0,
    title: '',
    name: '',
    fields: [],
  },
});

function Forms() {
  const [delegationTypes, setDelegationTypes] = useState<DelegationType[]>([]);
  const [estateTypes, setEstateTypes] = useState<EstateType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [delegationType, setDelegationType] = useState<DelegationType>({
    id: '',
    value: 'default',
  });
  const [estateType, setEstateType] = useState<EstateType>({
    id: '',
    value: 'default',
  });
  const isDefault =
    delegationType.value === 'default' || estateType.value === 'default'
      ? true
      : false;
  const [form, setForm] = useState<EstateForm>();
  const [hasImage, setHasImage] = useState<boolean>(false);
  const [showNewSectionModal, setShowNewSectionModal] =
    useState<boolean>(false);
  const [newSectionTitle, setNewSectionTitle] = useState<string>('');
  const [showEditSectionModal, setShowEditSectionModal] =
    useState<boolean>(false);
  const [modalSection, setModalSection] = useRecoilState(modalSectionAtom);

  function handleSectionDragEnd(result: DropResult) {
    if (!result.destination) {
      return;
    }

    const tempSections = [...form!.sections];
    const [reorderedSection] = tempSections.splice(result.source.index, 1);
    tempSections.splice(result.destination!.index, 0, reorderedSection);

    setForm({ ...form!, sections: tempSections });
  }

  function includesImageSection(form: EstateForm): boolean {
    const imageSections = form.sections.filter((section) => {
      let isImageSection = false;
      section.fields.forEach((field) => {
        if (field.type === FieldType.Image) {
          isImageSection = true;
        } else {
          isImageSection = false;
        }
      });
      return isImageSection;
    });
    if (imageSections.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  function formWithImageSection(form: EstateForm): EstateForm {
    const imageSection: Section = {
      title: 'تصاویر',
      name: 'imageSection',
      fields: [
        {
          type: FieldType.Image,
          title: 'انتخاب تصاویر',
          value: [],
          name: 'image',
        },
      ],
    };

    const sections = form.sections;
    sections.unshift(imageSection);
    const newForm: EstateForm = {
      ...form,
      sections: sections,
    };

    return newForm;
  }

  function formNoImageSection(form: EstateForm): EstateForm {
    if (includesImageSection(form)) {
      form.sections.shift();
    }

    return form;
  }

  function formWithNewSection(form: EstateForm, title: string): EstateForm {
    const sections = form.sections;
    const newSection: Section = {
      name: title,
      title: title,
      fields: [],
    };
    sections.push(newSection);

    const newForm = { ...form, sections: sections };

    return newForm;
  }

  function updateChangedSection(form: EstateForm, sectionIndex: number) {
    const sections = form.sections;
    const changedSection: Section = {
      title: modalSection.title,
      name: modalSection.name,
      fields: modalSection.fields,
    };
    sections.splice(sectionIndex, 1, changedSection);

    setForm({ ...form, sections: sections });
  }

  async function getDelegationTypes(url: string) {
    fetchGet(url)
      .then((data) => {
        setDelegationTypes(data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async function getEstateTypes(url: string) {
    fetchGet(url)
      .then((data) => {
        setEstateTypes(data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async function getFormData(url: string) {
    fetchGet(url)
      .then((data) => {
        setForm(data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    getDelegationTypes('http://localhost:8000/delegationTypes');
    getEstateTypes('http://localhost:8000/estateTypes');
  }, []);

  useEffect(() => {
    setLoading(true);
    !isDefault &&
      getFormData(
        `http://localhost:8000/forms/${delegationType.value}-${estateType.value}`
      );
  }, [isDefault, delegationType.value, estateType.value]);

  useEffect(() => {
    if (form) {
      if (includesImageSection(form)) {
        setHasImage(true);
      } else {
        setHasImage(false);
      }
    }
  }, [form]);

  return (
    <>
      <h4 className="mt-4 ms-3 d-inline">فرم ها</h4>
      <Button
        variant="dark"
        className="refresh-btn d-inline rounded-circle"
        onClick={() => {
          setLoading(true);
          getDelegationTypes('http://localhost:8000/delegationTypes');
          getEstateTypes('http://localhost:8000/estateTypes');
          getFormData(
            `http://localhost:8000/forms/${delegationType.value}-${estateType.value}`
          );
        }}
      >
        <i className="bi-arrow-counterclockwise"></i>
      </Button>
      <CustomModal
        title="افزودن بخش جدید"
        cancelTitle="لغو"
        successTitle="افزودن بخش"
        show={showNewSectionModal}
        handleClose={() => {
          setShowNewSectionModal(false);
        }}
        handleSuccess={() => {
          if (newSectionTitle.trim() !== '') {
            setForm(formWithNewSection(form!, newSectionTitle));
            setShowNewSectionModal(false);
          } else {
            setNewSectionTitle('');
            alert('لطفاً یک عنوان برای بخش جدید انتخاب کنید');
          }
        }}
      >
        <Form.Control
          type="text"
          value={newSectionTitle}
          onChange={(e) => {
            setNewSectionTitle(e.target.value);
          }}
        />
      </CustomModal>
      <Row>
        <Col>
          <InputGroup className="my-4" style={{ direction: 'ltr' }}>
            <Button
              variant="dark"
              onClick={() => {
                setShowNewSectionModal(true);
              }}
              disabled={isDefault}
            >
              <i className="bi-plus-lg fs-6"></i>
            </Button>
            <Form.Select
              value={estateType.value}
              onChange={(e) => {
                setEstateType({
                  ...estateType,
                  value: e.currentTarget.value,
                });
              }}
            >
              <option value="default" disabled>
                انتخاب کنید
              </option>
              {estateTypes.map((estateType, index) => {
                return (
                  <option key={index} value={estateType.id}>
                    {estateType.value}
                  </option>
                );
              })}
            </Form.Select>
            <Form.Select
              value={delegationType.value}
              onChange={(e) => {
                setDelegationType({
                  ...delegationType,
                  value: e.currentTarget.value,
                });
              }}
            >
              <option value="default" disabled>
                انتخاب کنید
              </option>
              {delegationTypes.map((delegationType, index) => {
                return (
                  <option key={index} value={delegationType.id}>
                    {delegationType.value}
                  </option>
                );
              })}
            </Form.Select>
          </InputGroup>
        </Col>
        <Col sm={'auto'}>
          <Button
            variant="purple"
            className="my-4"
            onClick={() => {
              setLoading(true);
              if (form) {
                toast.promise(
                  fetchPut(
                    `http://localhost:8000/forms/${delegationType.value}-${estateType.value}`,
                    {
                      id: `${delegationType.value}-${estateType.value}`,
                      sections: form?.sections,
                    }
                  ).then(() => {
                    getFormData(
                      `http://localhost:8000/forms/${delegationType.value}-${estateType.value}`
                    );
                  }),
                  {
                    loading: 'در حال ذخیره سازی تغییرات',
                    success: 'تغییرات با موفقیت ذخیره شد',
                    error: 'خطا در ذخیره سازی تغییرات',
                  },
                  {
                    style: { width: 250 },
                  }
                );
              }
            }}
          >
            ذخیره تغییرات
          </Button>
        </Col>
      </Row>
      <Row>
        {isDefault ? (
          <h5 className="fw-light py-5">
            لطفاً نوع واگذاری و نوع ملک را انتخاب کنید
          </h5>
        ) : loading ? (
          <Row>
            <Col>
              <Spinner animation="border" variant="primary" className="my-5" />
            </Col>
          </Row>
        ) : (
          <Col>
            <Form.Switch
              label="قابلیت انتخاب تصاویر"
              style={{ maxWidth: 200 }}
              className="my-3"
              checked={hasImage}
              onChange={(e) => {
                if (form) {
                  includesImageSection(form)
                    ? setForm(formNoImageSection(form))
                    : setForm(formWithImageSection(form));
                }
                setHasImage(e.target.checked);
              }}
            />
            <CustomModal
              isFullscreen
              show={showEditSectionModal}
              title={modalSection?.title}
              cancelTitle="لغو"
              successTitle="ذخیره"
              handleClose={() => {
                setShowEditSectionModal(false);
              }}
              handleSuccess={() => {
                if (form) {
                  updateChangedSection(form, modalSection.id);
                  setShowEditSectionModal(false);
                }
              }}
            >
              <EditSection />
            </CustomModal>
            <DragDropContext onDragEnd={handleSectionDragEnd}>
              <Droppable droppableId="sections">
                {(provided) => {
                  return (
                    <ListGroup
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      style={{ userSelect: 'none' }}
                    >
                      {form?.sections.map((section, sectionIndex) => {
                        let isImageSection = false;
                        section.fields.forEach((field) => {
                          if (field.type === FieldType.Image) {
                            isImageSection = true;
                          } else {
                            isImageSection = false;
                          }
                        });
                        if (isImageSection) {
                          return (
                            <ListGroup.Item key={sectionIndex} className="py-3">
                              <h5 className="d-inline">{section.title}</h5>
                              <ListGroup className="my-3">
                                {section.fields.map((field, fieldIndex) => {
                                  return (
                                    <ListGroup.Item
                                      variant="secondary"
                                      key={fieldIndex}
                                    >
                                      <Row>
                                        <Col>
                                          <h6 className="d-inline">
                                            {field.title}
                                          </h6>
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
                                              : field.type ===
                                                FieldType.Conditional
                                              ? 'شرطی'
                                              : field.type === FieldType.Image
                                              ? 'تصویر'
                                              : '---'}
                                          </h6>
                                        </Col>
                                      </Row>
                                    </ListGroup.Item>
                                  );
                                })}
                              </ListGroup>
                            </ListGroup.Item>
                          );
                        } else {
                          return (
                            <Draggable
                              draggableId={`section-${sectionIndex}`}
                              index={sectionIndex}
                              key={sectionIndex}
                            >
                              {(provided) => {
                                return (
                                  <ListGroup.Item
                                    {...provided.dragHandleProps}
                                    {...provided.draggableProps}
                                    ref={provided.innerRef}
                                    key={sectionIndex}
                                    className="section py-3"
                                  >
                                    <div className="d-flex flex-row justify-content-between align-items-center py-3">
                                      <div>
                                        <h5 className="d-inline ps-4">
                                          {section.title}
                                        </h5>
                                        <Button
                                          variant="outline-secondary"
                                          className="section-edit-btn"
                                          onClick={() => {
                                            setModalSection({
                                              ...section,
                                              id: sectionIndex,
                                            });
                                            setShowEditSectionModal(true);
                                          }}
                                        >
                                          <i className="bi-pencil-square"></i>
                                        </Button>
                                      </div>
                                      <div>
                                        <CloseButton
                                          onClick={() => {
                                            const sections = form.sections;
                                            const filterdSections =
                                              sections.filter((_, id) => {
                                                return sectionIndex !== id;
                                              });
                                            if (
                                              window.confirm(
                                                'آیا از حذف این بخش مطمئن هستید؟'
                                              )
                                            ) {
                                              setForm({
                                                ...form,
                                                sections: filterdSections,
                                              });
                                            }
                                          }}
                                        />
                                      </div>
                                    </div>
                                    <ListGroup className="my-3">
                                      {section.fields.map(
                                        (field, fieldIndex) => {
                                          return (
                                            <ListGroup.Item
                                              variant="secondary"
                                              key={fieldIndex}
                                            >
                                              <Row>
                                                <Col>
                                                  <h6 className="d-inline">
                                                    {field.title}
                                                  </h6>
                                                </Col>
                                                <Col>
                                                  <h6 className="d-inline text-muted">
                                                    {field.type ===
                                                    FieldType.Text
                                                      ? FieldTypeTitle.Text
                                                      : field.type ===
                                                        FieldType.Number
                                                      ? FieldTypeTitle.Number
                                                      : field.type ===
                                                        FieldType.Select
                                                      ? FieldTypeTitle.Select
                                                      : field.type ===
                                                        FieldType.Bool
                                                      ? FieldTypeTitle.Bool
                                                      : field.type ===
                                                        FieldType.Conditional
                                                      ? FieldTypeTitle.Conditional
                                                      : field.type ===
                                                        FieldType.Image
                                                      ? FieldTypeTitle.Image
                                                      : '---'}
                                                  </h6>
                                                </Col>
                                              </Row>
                                            </ListGroup.Item>
                                          );
                                        }
                                      )}
                                    </ListGroup>
                                  </ListGroup.Item>
                                );
                              }}
                            </Draggable>
                          );
                        }
                      })}
                      {provided.placeholder}
                    </ListGroup>
                  );
                }}
              </Droppable>
            </DragDropContext>
          </Col>
        )}
      </Row>
    </>
  );
}

export default Forms;
