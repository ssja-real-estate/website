/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useRef, useState } from 'react';
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

import { EstateForm, Section } from '../../../../../../global/types/EstateForm';
import {
  Field,
  FieldType,
  FieldTypeTitle,
} from '../../../../../../global/types/Field';
import CustomModal from '../../../../../../components/CustomModal/CustomModal';
import EditSection from './EditSection';
import { useRecoilState } from 'recoil';
import DelegationType from 'global/types/DelegationType';
import EstateType from 'global/types/EstateType';
import { modalSectionAtom } from './FormsState';
import Strings from 'global/constants/strings';
import { globalState } from 'global/states/globalStates';

const Forms = () => {
  const [delegationTypes, setDelegationTypes] = useState<DelegationType[]>([]);
  const [estateTypes, setEstateTypes] = useState<EstateType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [delegationType, setDelegationType] = useState<DelegationType>({
    id: '',
    name: 'default',
  });

  const [estateType, setEstateType] = useState<EstateType>({
    id: '',
    name: 'default',
  });

  const isDefault =
    delegationType.name === 'default' || estateType.name === 'default'
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

  const [state, setGlobalState] = useRecoilState(globalState);
  const mounted = useRef(true);

  useEffect(() => {
    if (mounted.current) {
    }

    return () => {
      mounted.current = false;
    };
  }, [state.token]);

  const handleSectionDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const tempSections = [...form!.sections];
    const [reorderedSection] = tempSections.splice(result.source.index, 1);
    tempSections.splice(result.destination!.index, 0, reorderedSection);

    setForm({ ...form!, sections: tempSections });
  };

  const includesImageSection = (form: EstateForm): boolean => {
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
  };

  const formWithImageSection = (form: EstateForm): EstateForm => {
    const imageSection: Section = {
      title: Strings.images,
      name: 'imageSection',
      fields: [
        {
          type: FieldType.Image,
          title: Strings.chooseImages,
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
  };

  const formNoImageSection = (form: EstateForm): EstateForm => {
    if (includesImageSection(form)) {
      form.sections.shift();
    }

    return form;
  };

  const formWithNewSection = (form: EstateForm, title: string): EstateForm => {
    const sections = form.sections;
    const newSection: Section = {
      name: title,
      title: title,
      fields: [],
    };
    sections.push(newSection);

    const newForm = { ...form, sections: sections };

    return newForm;
  };

  const updateChangedSection = (form: EstateForm, sectionIndex: number) => {
    const sections = form.sections;
    const changedSection: Section = {
      title: modalSection.title,
      name: modalSection.name,
      fields: modalSection.fields,
    };
    sections.splice(sectionIndex, 1, changedSection);

    setForm({ ...form, sections: sections });
  };

  // const getDelegationTypes = async () => {};

  // const getEstateTypes = async () => {};

  // const getFormData = async () => {};

  const getFieldTitle = (field: Field) => {
    let title = '---';

    switch (field.type) {
      case FieldType.Text:
        title = FieldTypeTitle.Text;
        break;
      case FieldType.Number:
        title = FieldTypeTitle.Number;
        break;
      case FieldType.Select:
        title = FieldTypeTitle.Select;
        break;
      case FieldType.Bool:
        title = FieldTypeTitle.Bool;
        break;
      case FieldType.Conditional:
        title = FieldTypeTitle.Conditional;
        break;
      case FieldType.Image:
        title = FieldTypeTitle.Image;
        break;
      case FieldType.Range:
        title = FieldTypeTitle.Range;
        break;
    }

    return title;
  };

  // const loadData = async () => {};

  // useEffect(() => {
  //   setLoading(true);
  //   !isDefault &&
  //     getFormData(
  //       `http://localhost:8000/forms/${delegationType.name}-${estateType.name}`
  //     );
  // }, [isDefault, delegationType.name, estateType.name]);

  // useEffect(() => {
  //   if (form) {
  //     if (includesImageSection(form)) {
  //       setHasImage(true);
  //     } else {
  //       setHasImage(false);
  //     }
  //   }
  // }, [form]);

  return (
    <>
      <h4 className="mt-4 ms-3 d-inline">{Strings.forms}</h4>
      <Button
        variant="dark"
        className="refresh-btn d-inline rounded-circle"
        onClick={() => {}}
      >
        <i className="bi-arrow-counterclockwise"></i>
      </Button>
      <CustomModal
        title={Strings.addNewSection}
        cancelTitle={Strings.save}
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
            alert(Strings.chooseNewTitleForTheSection);
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
              value={estateType.name}
              onChange={(e) => {
                setEstateType({
                  ...estateType,
                  name: e.currentTarget.value,
                });
              }}
            >
              <option value="default" disabled>
                {Strings.chooseEstateType}
              </option>
              {estateTypes.map((estateType, index) => {
                return (
                  <option key={index} value={estateType.id}>
                    {estateType.name}
                  </option>
                );
              })}
            </Form.Select>
            <Form.Select
              value={delegationType.name}
              onChange={(e) => {
                setDelegationType({
                  ...delegationType,
                  name: e.currentTarget.value,
                });
              }}
            >
              <option value="default" disabled>
                {Strings.chooseDelegationType}
              </option>
              {delegationTypes.map((delegationType, index) => {
                return (
                  <option key={index} value={delegationType.id}>
                    {delegationType.name}
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
              }
            }}
          >
            {Strings.saveChanges}
          </Button>
        </Col>
      </Row>
      <Row>
        {isDefault ? (
          <h5 className="fw-light py-5">{Strings.chooseFormFilters}</h5>
        ) : loading ? (
          <Row>
            <Col>
              <Spinner animation="border" variant="primary" className="my-5" />
            </Col>
          </Row>
        ) : (
          <Col>
            <Form.Switch
              label={Strings.imageSelectionFeature}
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
              cancelTitle={Strings.cancel}
              successTitle={Strings.save}
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
                                            {getFieldTitle(field)}
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
                                                Strings.sectionDeleteConfirm
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
                                                    {getFieldTitle(field)}
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
};

export default Forms;
