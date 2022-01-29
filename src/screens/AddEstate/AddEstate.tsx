import { ChangeEvent, useEffect, useRef, useState } from "react";
import "./AddEstate.css";
import { motion } from "framer-motion";
import {
  crossfadeAnimation,
  elevationEffect,
} from "../../animations/motionVariants";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { defaultForm, EstateForm } from "../../global/types/EstateForm";
import { FieldType, Field } from "../../global/types/Field";
import Strings from "global/constants/strings";
import EstateType from "global/types/EstateType";
import { globalState } from "global/states/globalStates";
import { useRecoilValue } from "recoil";
import DelegationTypeService from "services/api/DelegationTypeService/DelegationTypeService";
import EstateTypeService from "services/api/EstateTypeService/EstateTypeService";
import FormService from "services/api/FormService/FormService";
import toast from "react-hot-toast";
import DelegationType from "global/types/DelegationType";
import EstateService from "services/api/EstateService/EstateService";

function AddEstateScreen() {
  const [loading, setLoading] = useState<boolean>(true);
  const [delegationTypes, setDelegationTypes] = useState<DelegationType[]>([]);
  const [estateTypes, setEstateTypes] = useState<EstateType[]>([]);
  const [delegationType, setDelegationType] = useState<DelegationType>({
    id: "",
    name: "default",
  });
  const [estateType, setEstateType] = useState<EstateType>({
    id: "",
    name: "default",
  });
  const isDefault: boolean =
    delegationType.name === "default" || estateType.name === "default"
      ? true
      : false;
  const [estate, setForm] = useState<EstateForm>(defaultForm);

  const state = useRecoilValue(globalState);
  const formService = useRef(new FormService());
  const delegationTypeService = useRef(new DelegationTypeService());
  const estateTypeService = useRef(new EstateTypeService());
  const estateService = useRef(new EstateService());
  const mounted = useRef(true);

  useEffect(() => {
    formService.current.setToken(state.token);
    delegationTypeService.current.setToken(state.token);
    estateTypeService.current.setToken(state.token);
    estateService.current.setToken(state.token);

    loadOptions();
    loadData();

    return () => {
      mounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delegationType, estateType, state.token]);

  async function loadOptions() {
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
  }

  async function loadData() {
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
  }

  function handleDelegationChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setDelegationType({
      ...delegationType,
      id: event.target.value,
      name: event.target.value,
    });
  }
  function handleTypeChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setEstateType({
      ...estateType,
      id: event.target.value,
      name: event.target.value,
    });
  }

  function checkMaxFiles(files: File[]): boolean {
    const maxFiles = 10;
    return files.length > maxFiles ? false : true;
  }

  function onFieldChange(
    targetValue: any,
    form: EstateForm,
    sectionIndex: number,
    fieldIndex: number
  ) {
    const currentField = {
      ...form.sections[sectionIndex].fields[fieldIndex],
      value: targetValue,
    };
    const sections = form.sections;
    const fields = sections[sectionIndex].fields;
    fields[fieldIndex] = currentField;
    sections[sectionIndex].fields = fields;

    setForm({
      ...form,
      sections: sections,
    });
  }

  function onConditionalFieldChange(
    targetValue: any,
    sectionIndex: number,
    fieldIndex: number,
    innerFieldIndex: number,
    form: EstateForm
  ) {
    const currentField = {
      ...form.sections[sectionIndex].fields[fieldIndex].fields![
        innerFieldIndex
      ],
      value: targetValue,
    };
    const sections = form.sections;
    const fields = sections[sectionIndex].fields;
    const innerFields = fields[fieldIndex].fields!;
    innerFields[innerFieldIndex] = currentField;
    fields[fieldIndex] = { ...fields[fieldIndex], fields: innerFields };
    sections[sectionIndex].fields = fields;

    setForm({
      ...form,
      sections: sections,
    });
  }

  function mapFields(fields: Field[], form: EstateForm, sectionIndex: number) {
    return fields.map((field, fieldIndex) => {
      return (
        <div key={fieldIndex} className="input-item py-3">
          <label>{field.title}</label>
          {field.type === FieldType.Text ? (
            <Form.Control
              type="text"
              value={field.value ? String(field.value) : ""}
              onChange={(e) => {
                const stringValue = String(e.target.value);

                onFieldChange(stringValue, form, sectionIndex, fieldIndex);
              }}
            />
          ) : field.type === FieldType.Number ? (
            <Form.Control
              type="number"
              value={field.value ? Number(field.value) : ""}
              onChange={(e) => {
                const numberValue = Number(e.target.value);

                onFieldChange(numberValue, form, sectionIndex, fieldIndex);
              }}
            />
          ) : field.type === FieldType.Select ? (
            <Form.Select
              value={field.value ? String(field.value) : "default"}
              onChange={(e) => {
                const numberValue = String(e.currentTarget.value);

                onFieldChange(numberValue, form, sectionIndex, fieldIndex);
              }}
            >
              <option value="default" disabled>
                {Strings.choose}
              </option>
              {field.options?.map((option, index) => {
                return <option key={index}>{option}</option>;
              })}
            </Form.Select>
          ) : field.type === FieldType.Bool ? (
            <Form.Check
              className="d-inline mx-3"
              type="switch"
              checked={field.value ? true : false}
              onChange={(e) => {
                const booleanValue = e.target.checked;

                onFieldChange(booleanValue, form, sectionIndex, fieldIndex);
              }}
            />
          ) : field.type === FieldType.Conditional ? (
            <>
              <Form.Check
                className="d-inline mx-3"
                type="switch"
                checked={field.value ? true : false}
                onChange={(e) => {
                  const booleanValue = e.target.checked;

                  onFieldChange(booleanValue, form, sectionIndex, fieldIndex);
                }}
              />
              {field.value &&
                mapConditionalFields(
                  field.fields!,
                  form,
                  sectionIndex,
                  fieldIndex
                )}
            </>
          ) : field.type === FieldType.Image ? (
            <Form.Control
              type="file"
              multiple
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                let selectedFiles = Array.from(e.target.files!);

                if (!checkMaxFiles(selectedFiles)) {
                  alert(Strings.imagesLimit);
                  e.target.value = "";
                  selectedFiles = [];
                }

                const data = new FormData();
                selectedFiles.forEach((file, index) => {
                  data.append(`image${index}`, file);
                });

                onFieldChange(data, form, sectionIndex, fieldIndex);
              }}
            />
          ) : (
            <Form.Control
              type="text"
              value={field.value ? String(field.value) : ""}
              onChange={(e) => {
                const stringValue = String(e.target.value);

                onFieldChange(stringValue, form, sectionIndex, fieldIndex);
              }}
            />
          )}
        </div>
      );
    });
  }

  function mapConditionalFields(
    fields: Field[],
    form: EstateForm,
    sectionIndex: number,
    fieldIndex: number
  ) {
    return fields.map((innerField, innerFieldIndex) => {
      return (
        <div key={innerFieldIndex} className="input-item py-3">
          <label>{innerField.title}</label>
          {innerField.type === FieldType.Text ? (
            <Form.Control
              type="text"
              value={innerField.value ? String(innerField.value) : ""}
              onChange={(e) => {
                const stringValue = String(e.target.value);

                onConditionalFieldChange(
                  stringValue,
                  sectionIndex,
                  fieldIndex,
                  innerFieldIndex,
                  form
                );
              }}
            />
          ) : innerField.type === FieldType.Number ? (
            <Form.Control
              type="number"
              value={innerField.value ? Number(innerField.value) : ""}
              onChange={(e) => {
                const numberValue = Number(e.target.value);

                onConditionalFieldChange(
                  numberValue,
                  sectionIndex,
                  fieldIndex,
                  innerFieldIndex,
                  form
                );
              }}
            />
          ) : innerField.type === FieldType.Select ? (
            <Form.Select
              value={innerField.value ? String(innerField.value) : "default"}
              onChange={(e) => {
                const numberValue = String(e.currentTarget.value);

                onConditionalFieldChange(
                  numberValue,
                  sectionIndex,
                  fieldIndex,
                  innerFieldIndex,
                  form
                );
              }}
            >
              <option value="default" disabled>
                {Strings.choose}
              </option>
              {innerField.options?.map((option, index) => {
                return <option key={index}>{option}</option>;
              })}
            </Form.Select>
          ) : innerField.type === FieldType.Bool ? (
            <Form.Check
              className="d-inline mx-3"
              type="switch"
              checked={innerField.value ? true : false}
              onChange={(e) => {
                const booleanValue = e.target.checked;

                onConditionalFieldChange(
                  booleanValue,
                  sectionIndex,
                  fieldIndex,
                  innerFieldIndex,
                  form
                );
              }}
            />
          ) : innerField.type === FieldType.Conditional ? (
            <>
              <Form.Check
                className="d-inline mx-3"
                type="switch"
                checked={innerField.value ? true : false}
                onChange={(e) => {
                  const booleanValue = e.target.checked;

                  onConditionalFieldChange(
                    booleanValue,
                    sectionIndex,
                    fieldIndex,
                    innerFieldIndex,
                    form
                  );
                }}
              />
              {innerField.value &&
                mapConditionalFields(
                  innerField.fields!,
                  form,
                  sectionIndex,
                  fieldIndex
                )}
            </>
          ) : innerField.type === FieldType.Image ? (
            <Form.Control
              type="file"
              multiple
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                let selectedFiles = Array.from(e.target.files!);

                if (!checkMaxFiles(selectedFiles)) {
                  alert(Strings.imagesLimit);
                  e.target.value = "";
                  selectedFiles = [];
                }

                const data = new FormData();
                selectedFiles.forEach((file, index) => {
                  data.append(`image${index}`, file);
                });

                onFieldChange(data, form, sectionIndex, fieldIndex);
              }}
            />
          ) : (
            <Form.Control
              type="text"
              value={innerField.value ? String(innerField.value) : ""}
              onChange={(e) => {
                const stringValue = String(e.target.value);

                onConditionalFieldChange(
                  stringValue,
                  sectionIndex,
                  fieldIndex,
                  innerFieldIndex,
                  form
                );
              }}
            />
          )}
        </div>
      );
    });
  }

  return (
    <div className="add-estate-container">
      <motion.div
        variants={elevationEffect}
        initial="first"
        animate="second"
        className="add-estate card glass shadow rounded-3 py-3 my-4"
      >
        <h2 className="add-estate-title text-center">{Strings.addEstate}</h2>
        <form className="add-estate-form">
          <label htmlFor="delegationType">{Strings.delegationType}</label>
          <Form.Select
            className="form-select rounded-3"
            name="delegationType"
            id="delegationType"
            value={delegationType.name}
            onChange={handleDelegationChange}
          >
            <option value="default" disabled>
              {Strings.choose}
            </option>
            {delegationTypes.map((option, index) => {
              return (
                <option key={index} value={option.id}>
                  {option.name}
                </option>
              );
            })}
          </Form.Select>
          <label htmlFor="delegationType">{Strings.estateType}</label>
          <Form.Select
            className="form-select rounded-3"
            name="estateType"
            id="estateType"
            value={estateType.name}
            onChange={handleTypeChange}
          >
            <option value="default" disabled>
              {Strings.choose}
            </option>
            {estateTypes.map((option, index) => {
              return (
                <option key={index} value={option.id}>
                  {option.name}
                </option>
              );
            })}
          </Form.Select>
        </form>
      </motion.div>
      {isDefault ? (
        <motion.div
          variants={crossfadeAnimation}
          initial="first"
          animate="second"
          className="card glass shadow rounded-3 glass p-5"
        >
          <h4 className="fw-light fs-4">
            {Strings.chooseDelegationAndEstateTypes}
          </h4>
        </motion.div>
      ) : loading ? (
        <Row>
          <Col>
            <Spinner animation="border" variant="primary" className="my-5" />
          </Col>
        </Row>
      ) : (
        <div className="items-container">
          {estate?.sections.map((section, sectionIndex) => {
            return (
              <div
                className="section card glass shadow-sm py-2 px-4 my-2"
                key={sectionIndex}
              >
                <h3 className="section-title py-3">{section.title}</h3>
                {mapFields(section.fields, estate, sectionIndex)}
              </div>
            );
          })}
          {!estate.id ? (
            <motion.div
              variants={crossfadeAnimation}
              initial="first"
              animate="second"
              className="card glass shadow rounded-3 glass p-5 align-items-center"
            >
              <h4 className="fw-light">{Strings.formDoesNotExist}</h4>
            </motion.div>
          ) : (
            <Button
              className="w-100 mb-5 mt-3"
              variant="purple"
              onClick={() => {
                estateService.current.requestAddEtate(estate);
              }}
            >
              {Strings.addEstate}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default AddEstateScreen;
