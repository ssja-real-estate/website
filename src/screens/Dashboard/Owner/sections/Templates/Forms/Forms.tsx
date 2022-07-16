import { useEffect, useRef, useState } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import {
  Button,
  Col,
  Form,
  InputGroup,
  ListGroup,
  Row,
  Spinner,
} from "react-bootstrap";
import toast from "react-hot-toast";
import { useRecoilState, useRecoilValue } from "recoil";

import CustomModal from "components/CustomModal/CustomModal";
import Strings from "global/constants/strings";
import { globalState } from "global/states/globalStates";
import DelegationType from "global/types/DelegationType";
import { defaultForm, EstateForm } from "global/types/EstateForm";
import EstateType from "global/types/EstateType";
import { defaultField, Field, FieldType } from "global/types/Field";
import DelegationTypeService from "services/api/DelegationTypeService/DelegationTypeService";
import EstateTypeService from "services/api/EstateTypeService/EstateTypeService";
import FormService from "services/api/FormService/FormService";
import { getFieldTypeAndNecessity } from "services/utilities/stringUtility";
import { v4 } from "uuid";
import EditSection from "./EditSection";
import { defaultModalSection, modalSectionAtom } from "./FormsState";

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
  const [showEditSectionModal, setShowEditSectionModal] =
    useState<boolean>(false);
  const [modalSection, setModalSection] = useRecoilState(modalSectionAtom);

  const state = useRecoilValue(globalState);
  const formService = useRef(new FormService());
  const delegationTypeService = useRef(new DelegationTypeService());
  const estateTypeService = useRef(new EstateTypeService());
  const mounted = useRef(true);

  useEffect(() => {
    formService.current.setToken(state.token);
    delegationTypeService.current.setToken(state.token);
    estateTypeService.current.setToken(state.token);
    loadOptions();
    loadData();

    return () => {
      mounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.token]);

  useEffect(() => {
    !isDefault && loadData();

    return () => {
      mounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDefault, delegationType.name, estateType.name]);

  const loadOptions = async () => {
    delegationTypeService.current
      .getAllDelegationTypes()
      .then((delegationTypes) => {
        setDelegationTypes(delegationTypes);
      })
      .then(() => estateTypeService.current.getAllEstateTypes())
      .then((estateTypes) => {
        setEstateTypes(estateTypes);
      })
      .catch((_) => {
        toast.error(Strings.loadingLocationsFailed);
      });
  };

  const loadData = async () => {
    if (!loading) {
      setLoading((prev) => true);
    }

    if (!delegationType.id || !estateType.id) {
      return;
    }
    const loadedForm = await formService.current.getForm(
      delegationType.id,
      estateType.id
    );

    if (!loadedForm) {
      setLoading((prev) => false);
      setForm(defaultForm);
      setHasImage(false);
      return;
    }

    if (includesImageSection(loadedForm)) {
      setHasImage(true);
    } else {
      setHasImage(false);
    }
    setForm(loadedForm);
    await loadOptions();
    setLoading((prev) => false);
  };

  const handleFieldDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const tempFields = [...form!.fields];
    const [reorderedField] = tempFields.splice(result.source.index, 1);
    tempFields.splice(result.destination!.index, 0, reorderedField);

    setForm({ ...form!, fields: tempFields });
  };

  const handleImagesSection = () => {
    if (!form) return;

    let newFields = form.fields.slice();
    const hasImageSection = includesImageSection(form);
    if (hasImageSection) {
      newFields = newFields.slice(0, newFields.length - 1);
    } else {
      const newField: Field = {
        ...defaultField,
        type: FieldType.Image,
        title: Strings.chooseImages,
        value: [],
        optional: true,
      };
      newFields.push(newField);
    }

    setForm({ ...form, fields: newFields });
  };

  const includesImageSection = (estateForm: EstateForm) => {
    if (!estateForm.fields.length) return false;

    const imageField = estateForm.fields.find((field) => {
      return field.type === FieldType.Image;
    });

    return imageField !== undefined;
  };

  const updateChangedSection = () => {
    setForm({ ...form, fields: modalSection.data.fields });
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
      const targetForm: EstateForm = {
        ...form,
        title: `${formDelegationType!.name} ${formEstateType!.name}`,
        assignmentTypeId: delegationType.id,
        estateTypeId: estateType.id,
      };

      if (targetForm.id) {
        await formService.current.updateForm(targetForm.id, targetForm);
      } else {
        await formService.current.createForm(targetForm);
      }
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
        isFullscreen
        show={showEditSectionModal}
        title={Strings.editForm}
        cancelTitle={Strings.cancel}
        successTitle={Strings.saveChanges}
        handleClose={() => {
          setShowEditSectionModal(false);
          setModalSection({
            index: 0,
            data: { fields: form.fields },
          });
        }}
        handleSuccess={() => {
          updateChangedSection();
          setShowEditSectionModal(false);
        }}
      >
        <EditSection />
      </CustomModal>
      <Row>
        <Col>
          <InputGroup className="my-4" style={{ direction: "ltr" }}>
            <Button
              variant="dark"
              onClick={() => {
                setShowEditSectionModal(true);
                setModalSection({
                  index: 0,
                  data: { fields: form.fields },
                });
              }}
              disabled={isDefault}
            >
              <i className="bi-pencil-square fs-6"></i>
            </Button>
            <Form.Select
              value={estateType.name}
              onChange={(e: { currentTarget: { value: any } }) => {
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
              onChange={(e: { currentTarget: { value: any } }) => {
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
              onChange={(e: {
                target: {
                  checked: boolean | ((prevState: boolean) => boolean);
                };
              }) => {
                handleImagesSection();
                setHasImage(e.target.checked);
              }}
            />
            <DragDropContext onDragEnd={handleFieldDragEnd}>
              <Droppable droppableId="sections">
                {(provided) => {
                  return (
                    <ListGroup
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      style={{ userSelect: "none" }}
                    >
                      <Draggable draggableId={v4()} index={0}>
                        {(provided) => {
                          return (
                            <ListGroup
                              className="my-3"
                              {...provided.dragHandleProps}
                              {...provided.draggableProps}
                              ref={provided.innerRef}
                            >
                              {form.fields.map((field, fieldIndex) => {
                                if (field.type === FieldType.Image) return null;
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
                                          {getFieldTypeAndNecessity(field)}
                                        </h6>
                                      </Col>
                                    </Row>
                                  </ListGroup.Item>
                                );
                              })}
                            </ListGroup>
                          );
                        }}
                      </Draggable>
                      {hasImage ? (
                        <ListGroup.Item variant="secondary" key={v4()}>
                          <Row>
                            <Col>
                              <h6 className="d-inline">
                                {Strings.chooseImages}
                              </h6>
                            </Col>
                            <Col>
                              <h6 className="d-inline text-muted">
                                {getFieldTypeAndNecessity({
                                  ...defaultField,
                                  type: FieldType.Image,
                                  title: Strings.chooseImages,
                                  value: [],
                                  optional: true,
                                })}
                              </h6>
                            </Col>
                          </Row>
                        </ListGroup.Item>
                      ) : null}
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
