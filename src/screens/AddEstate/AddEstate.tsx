import { ChangeEvent, useEffect, useState } from 'react';
import './AddEstate.css';
import { motion } from 'framer-motion';
import {
  crossfadeAnimation,
  elevationEffect,
} from '../../animations/motionVariants';
import { Button, Form } from 'react-bootstrap';
import { delegationTypes, estateTypes } from '../../global/constants/estates';
import { EstateForm } from '../../global/types/EstateForm';
import { FieldType, Field } from '../../global/types/Field';
// import { fetchGet } from "../../services/api/fetch";

function AddEstateScreen() {
  const [delegationType, setDelegationType] = useState<string>('default');
  const [estateType, setEstateType] = useState<string>('default');
  const isDefault: boolean =
    delegationType === 'default' || estateType === 'default' ? true : false;
  const [form, setForm] = useState<EstateForm>();

  function handleDelegationChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setDelegationType(event.target.value);
    // fetchGet("http://localhost:8000/forms/1-1")
    //     .then((data) => {
    //         setForm(data);
    //     })
    //     .catch((error) => {
    //         console.log(error);
    //     });
  }
  function handleTypeChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setEstateType(event.target.value);
    // fetchGet("http://localhost:8000/forms/1-1")
    //     .then((data) => {
    //         setForm(data);
    //     })
    //     .catch((error) => {
    //         console.log(error);
    //     });
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

    console.log(currentField.value);

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

    console.log(currentField.value);

    setForm({
      ...form,
      sections: sections,
    });
  }

  async function getData() {
    // fetchGet("http://localhost:8000/forms/1-1")
    //     .then((data) => {
    //         setForm(data);
    //     })
    //     .catch((error) => {
    //         console.log(error);
    //     });
  }

  useEffect(() => {
    getData();
  }, [delegationType, estateType]);

  function mapFields(fields: Field[], form: EstateForm, sectionIndex: number) {
    return fields.map((field, fieldIndex) => {
      return (
        <div key={fieldIndex} className="input-item py-3">
          <label htmlFor={field.name}>{field.title}</label>
          {field.type === FieldType.Text ? (
            <Form.Control
              type="text"
              name={field.name}
              id={field.name}
              value={field.value ? String(field.value) : ''}
              onChange={(e) => {
                const stringValue = String(e.target.value);

                onFieldChange(stringValue, form, sectionIndex, fieldIndex);
              }}
            />
          ) : field.type === FieldType.Number ? (
            <Form.Control
              type="number"
              name={field.name}
              id={field.name}
              value={field.value ? Number(field.value) : ''}
              onChange={(e) => {
                const numberValue = Number(e.target.value);

                onFieldChange(numberValue, form, sectionIndex, fieldIndex);
              }}
            />
          ) : field.type === FieldType.Select ? (
            <Form.Select
              value={field.value ? String(field.value) : 'default'}
              onChange={(e) => {
                const numberValue = String(e.currentTarget.value);

                onFieldChange(numberValue, form, sectionIndex, fieldIndex);
              }}
            >
              <option value="default" disabled>
                انتخاب کنید
              </option>
              {field.options?.map((option, index) => {
                return <option key={index}>{option}</option>;
              })}
            </Form.Select>
          ) : field.type === FieldType.Bool ? (
            <Form.Check
              className="d-inline mx-3"
              type="switch"
              name={field.name}
              id={field.name}
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
                  alert('حداکثر تعداد تصاویر انتخابی 10 عدد می باشد!');
                  e.target.value = '';
                  selectedFiles = [];
                }

                const data = new FormData();
                selectedFiles.forEach((file, index) => {
                  data.append(`image${index}`, file);
                });

                data.forEach((file, index) => {
                  console.log(file, index);
                });

                onFieldChange(data, form, sectionIndex, fieldIndex);
              }}
            />
          ) : (
            <Form.Control
              type="text"
              name={field.name}
              id={field.name}
              value={field.value ? String(field.value) : ''}
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
          <label htmlFor={innerField.name}>{innerField.title}</label>
          {innerField.type === FieldType.Text ? (
            <Form.Control
              type="text"
              name={innerField.name}
              id={innerField.name}
              value={innerField.value ? String(innerField.value) : ''}
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
              name={innerField.name}
              id={innerField.name}
              value={innerField.value ? Number(innerField.value) : ''}
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
              value={innerField.value ? String(innerField.value) : 'default'}
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
                انتخاب کنید
              </option>
              {innerField.options?.map((option, index) => {
                return <option key={index}>{option}</option>;
              })}
            </Form.Select>
          ) : innerField.type === FieldType.Bool ? (
            <Form.Check
              className="d-inline mx-3"
              type="switch"
              name={innerField.name}
              id={innerField.name}
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
                  alert('حداکثر تعداد تصاویر انتخابی 10 عدد می باشد!');
                  e.target.value = '';
                  selectedFiles = [];
                }

                const data = new FormData();
                selectedFiles.forEach((file, index) => {
                  data.append(`image${index}`, file);
                });

                data.forEach((file, index) => {
                  console.log(file, index);
                });

                onFieldChange(data, form, sectionIndex, fieldIndex);
              }}
            />
          ) : (
            <Form.Control
              type="text"
              name={innerField.name}
              id={innerField.name}
              value={innerField.value ? String(innerField.value) : ''}
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
        <h2 className="add-estate-title text-center">ثبت ملک</h2>
        <form className="add-estate-form">
          <label htmlFor="delegationType">نوع واگذاری</label>
          <Form.Select
            className="form-select rounded-3"
            name="delegationType"
            id="delegationType"
            value={delegationType}
            onChange={handleDelegationChange}
          >
            <option value="default" disabled>
              انتخاب کنید
            </option>
            {delegationTypes.map((option, index) => {
              return (
                <option key={index} value={option.value}>
                  {option.value}
                </option>
              );
            })}
          </Form.Select>
          <label htmlFor="delegationType">نوع ملک</label>
          <Form.Select
            className="form-select rounded-3"
            name="estateType"
            id="estateType"
            value={estateType}
            onChange={handleTypeChange}
          >
            <option value="default" disabled>
              انتخاب کنید
            </option>
            {estateTypes.map((option, index) => {
              return (
                <option key={index} value={option.value}>
                  {option.value}
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
            لطفاً نوع واگذاری و نوع ملک را انتخاب کنید
          </h4>
        </motion.div>
      ) : (
        <div className="items-container">
          {form?.sections.map((section, sectionIndex) => {
            return (
              <div
                className="section card glass shadow-sm py-2 px-4 my-2"
                key={sectionIndex}
              >
                <h3 className="section-title py-3">{section.title}</h3>
                {mapFields(section.fields, form, sectionIndex)}
              </div>
            );
          })}
          <Button
            className="w-100 mb-5 mt-3"
            variant="purple"
            onClick={() => {
              console.log(form);
            }}
          >
            ثبت ملک
          </Button>
        </div>
      )}
    </div>
  );
}

export default AddEstateScreen;
