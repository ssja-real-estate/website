import { useEffect, useRef, useState } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import {
  Button,
  CloseButton,
  Col,
  Form,
  InputGroup,
  ListGroup,
  Row,
  Spinner,
} from "react-bootstrap";

import {
  defaultForm,
  EstateForm,
} from "../../../../../../global/types/EstateForm";
import {
  defaultField,
  FieldType,
  getFieldTitle,
} from "../../../../../../global/types/Field";
import CustomModal from "../../../../../../components/CustomModal/CustomModal";
import EditSection from "./EditSection";
import { useRecoilState, useRecoilValue } from "recoil";
import DelegationType from "global/types/DelegationType";
import EstateType from "global/types/EstateType";
import { defaultModalSection, modalSectionAtom } from "./FormsState";
import Strings from "global/constants/strings";
import { globalState } from "global/states/globalStates";
import FormService from "services/api/FormService/FormService";
import DelegationTypeService from "services/api/DelegationTypeService/DelegationTypeService";
import EstateTypeService from "services/api/EstateTypeService/EstateTypeService";
import Section, { defaultSection } from "global/types/Section";
import toast from "react-hot-toast";

const Forms = () => {
  const [delegationTypes, setDelegationTypes] = useState<DelegationType[]>([]);
  const [estateTypes, setEstateTypes] = useState<EstateType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [delegationType, setDelegationType] = useState<DelegationType>({
    id: "",
    name: "default",
  });

  const [estateType, setEstateType] = useState<EstateType>({
    id: "",
    name: "default",
  });

  const isDefault =
    delegationType.name === "default" || estateType.name === "default"
      ? true
      : false;

  const [form, setForm] = useState<EstateForm>(defaultForm);
  const [hasImage, setHasImage] = useState<boolean>(false);
  const [showNewSectionModal, setShowNewSectionModal] =
    useState<boolean>(false);
  const [newSectionTitle, setNewSectionTitle] = useState<string>("");
  const [showEditSectionModal, setShowEditSectionModal] =
    useState<boolean>(false);
  const [modalSection, setModalSection] = useRecoilState(modalSectionAtom);

  const state = useRecoilValue(globalState);
  const formService = useRef(new FormService());
  const delegationTypeService = useRef(new DelegationTypeService());
  const estateTypeService = useRef(new EstateTypeService());
  const mounted = useRef(true);

  useEffect(() => {
    if (mounted.current) {
      formService.current.setToken(state.token);
      delegationTypeService.current.setToken(state.token);
      estateTypeService.current.setToken(state.token);
      loadOptions();
      loadData();
    }

    return () => {
      mounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.token]);

  useEffect(() => {
    !isDefault && loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDefault, delegationType.name, estateType.name]);

  // useEffect(() => {
  //   // if (form) {
  //   //   if (includesImageSection()) {
  //   //     setHasImage(true);
  //   //   } else {
  //   //     setHasImage(false);
  //   //   }
  //   // }

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [form]);

  const loadOptions = async () => {
    toast.promise(
      delegationTypeService.current
        .getAllDelegationTypes()
        .then((delegationTypes) => {
          setDelegationTypes(delegationTypes);
        })
        .then(() => estateTypeService.current.getAllEstateTypes())
        .then((estateTypes) => {
          setEstateTypes(estateTypes);
        })
        .catch((error) => {
          console.log(error);
        }),
      {
        success: Strings.loadingOptionsSuccess,
        loading: Strings.loadingOptions,
        error: Strings.loadingOptionsFailed,
      }
    );
  };

  const loadData = async () => {
    if (!loading) {
      setLoading((prev) => true);
    }
    // await loadOptions();

    setLoading((prev) => false);
  };

  const addNewSectionToForm = () => {
    const newSection: Section = {
      ...defaultSection,
      title: newSectionTitle,
    };
    setForm({ ...form, sections: [...form.sections, newSection] });
    setShowNewSectionModal((prev) => false);
    setNewSectionTitle("");
  };

  const handleSectionDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const tempSections = [...form!.sections];
    const [reorderedSection] = tempSections.splice(result.source.index, 1);
    tempSections.splice(result.destination!.index, 0, reorderedSection);

    setForm({ ...form!, sections: tempSections });
  };

  const handleImagesSection = () => {
    if (!form) return;

    let newSections = form.sections.slice();
    const hasImageSection = includesImageSection();
    if (hasImageSection) {
      newSections.shift();
    } else {
      const newSection: Section = {
        title: Strings.images,
        fields: [
          {
            ...defaultField,
            type: FieldType.Image,
            title: Strings.chooseImages,
            value: [],
          },
        ],
      };
      newSections.unshift(newSection);
    }
    setForm({ ...form, sections: newSections });
  };

  const includesImageSection = () => {
    if (!form.sections.length) return false;

    const imageField = form.sections[0].fields.find((field) => {
      return field.type === FieldType.Image;
    });

    return imageField !== undefined;
  };

  const updateChangedSection = () => {
    const sectionIndex = modalSection.index;
    const section = form.sections[sectionIndex];
    const changedSection: Section = {
      ...section,
      title: modalSection.data.title,
      fields: modalSection.data.fields,
    };
    let sections = form.sections.slice();
    sections.splice(sectionIndex, 1, changedSection);

    setForm({ ...form, sections: sections });
    setModalSection(defaultModalSection);
  };

  const saveChanges = async () => {
    setLoading((prev) => true);
    if (form) {
      const formDelegationType = delegationTypes.find(
        (d) => d.id === delegationType.id
      );
      const formEstateType = estateTypes.find((e) => e.id === estateType.id);
      if (!formDelegationType || !formEstateType) {
        toast.error(Strings.chooseDelegationAndEstateTypes);
      }
      const newForm: EstateForm = {
        ...form,
        title: `${formDelegationType!.name} ${formEstateType!.name}`,
        assignmentTypeId: delegationType.id,
        estateTypeId: estateType.id,
      };
      await formService.current.createForm(newForm);
    }
    await loadData();
  };

  return (
    <>
      <h4 className="mt-4 ms-3 d-inline">{Strings.forms}</h4>
      <Button
        variant="dark"
        className="refresh-btn d-inline rounded-circle"
        onClick={async () => {
          if (isDefault) {
            await loadOptions();
            return;
          }
          await loadData();
        }}
      >
        <i className="bi-arrow-counterclockwise"></i>
      </Button>
      <CustomModal
        title={Strings.addNewSection}
        cancelTitle={Strings.cancel}
        successTitle={Strings.confirm}
        show={showNewSectionModal}
        handleClose={() => {
          setShowNewSectionModal(false);
        }}
        handleSuccess={() => {
          if (newSectionTitle.trim() !== "") {
            addNewSectionToForm();
          } else {
            toast.error(Strings.sectionTitleCantBeEmpty);
            setNewSectionTitle("");
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
          <InputGroup className="my-4" style={{ direction: "ltr" }}>
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
                  id: e.currentTarget.value,
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
                  id: e.currentTarget.value,
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
            <Button
              variant="dark"
              onClick={async () => {
                await loadOptions();
              }}
            >
              <i className="bi-arrow-counterclockwise"></i>
            </Button>
          </InputGroup>
        </Col>
        <Col sm={"auto"}>
          <Button
            variant="purple"
            className="my-4"
            onClick={async () => {
              await saveChanges();
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
                handleImagesSection();
                setHasImage(e.target.checked);
              }}
            />
            <CustomModal
              isFullscreen
              show={showEditSectionModal}
              title={modalSection.data.title}
              cancelTitle={Strings.cancel}
              successTitle={Strings.saveChanges}
              handleClose={() => {
                setShowEditSectionModal(false);
              }}
              handleSuccess={() => {
                updateChangedSection();
                setShowEditSectionModal(false);
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
                      style={{ userSelect: "none" }}
                    >
                      {form.sections.map((section, sectionIndex) => {
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
                                      </div>
                                      <div>
                                        <i
                                          className="bi-pencil-square edit-section-icon text-muted px-4 fs-5"
                                          style={{ cursor: "pointer" }}
                                          onClick={() => {
                                            setModalSection({
                                              index: sectionIndex,
                                              data: {
                                                ...section,
                                                id: section.id,
                                                title: section.title,
                                                fields: section.fields,
                                              },
                                            });
                                            setShowEditSectionModal(true);
                                          }}
                                        ></i>
                                        <CloseButton
                                          onClick={() => {
                                            const sections = [...form.sections];
                                            const filteredSections =
                                              sections.splice(
                                                sectionIndex - 1,
                                                1
                                              );
                                            if (
                                              window.confirm(
                                                Strings.sectionDeleteConfirm
                                              )
                                            ) {
                                              setForm({
                                                ...form,
                                                sections: filteredSections,
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
