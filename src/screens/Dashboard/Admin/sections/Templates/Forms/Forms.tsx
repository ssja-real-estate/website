import { useEffect, useRef, useState } from "react";
import {
  Button,
  Col,
  Form,
  InputGroup,
  ListGroup,
  Row,
  Spinner,
} from "react-bootstrap";
import { useRecoilValue } from "recoil";
import toast from "react-hot-toast";

import DelegationType from "global/types/DelegationType";
import EstateType from "global/types/EstateType";
import Strings from "global/constants/strings";
import { globalState } from "global/states/globalStates";
import FormService from "services/api/FormService/FormService";
import DelegationTypeService from "services/api/DelegationTypeService/DelegationTypeService";
import EstateTypeService from "services/api/EstateTypeService/EstateTypeService";
import { defaultForm, EstateForm } from "global/types/EstateForm";
import { FieldType, getFieldTitle } from "global/types/Field";

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

    if (!delegationType.id || !estateType.id) {
      return;
    }
    const loadedForm = await formService.current.getForm(
      delegationType.id,
      estateType.id
    );

    setForm(loadedForm);

    await loadOptions();
    setLoading((prev) => false);
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
      <Row>
        <Col>
          <InputGroup className="my-4" style={{ direction: "ltr" }}>
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
            <ListGroup style={{ userSelect: "none" }}>
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
                                  <h6 className="d-inline">{field.title}</h6>
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
                    <ListGroup.Item key={sectionIndex} className="section py-3">
                      <div className="d-flex flex-row justify-content-between align-items-center py-3">
                        <div>
                          <h5 className="d-inline ps-4">{section.title}</h5>
                        </div>
                      </div>
                      <ListGroup className="my-3">
                        {section.fields.map((field, fieldIndex) => {
                          return (
                            <ListGroup.Item
                              variant="secondary"
                              key={fieldIndex}
                            >
                              <Row>
                                <Col>
                                  <h6 className="d-inline">{field.title}</h6>
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
                }
              })}
            </ListGroup>
          </Col>
        )}
      </Row>
    </>
  );
};

export default Forms;
