import { useEffect, useState } from "react";
import "./AddEstate.css";
import { motion } from "framer-motion";
import {
    crossfadeAnimation,
    elevationEffect,
} from "../../animations/motionVariants";
import { Button, Form } from "react-bootstrap";
import { delegationTypes, estateTypes } from "../../global/constants/estates";
import axios from "axios";
import { FieldType, EstateForm } from "../../global/types/EstateSection";

function AddEstateScreen() {
    const [delegationType, setDelegationType] = useState<string>("default");
    const [estateType, setEstateType] = useState<string>("default");
    const isDefault: boolean =
        delegationType !== "default" && estateType !== "default" ? true : false;
    const [form, setForm] = useState<EstateForm>();

    function handleDelegationChange(
        event: React.ChangeEvent<HTMLSelectElement>
    ) {
        setDelegationType(event.target.value);
    }
    function handleTypeChange(event: React.ChangeEvent<HTMLSelectElement>) {
        setEstateType(event.target.value);
    }

    function onFormItemChange(
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

        console.log(currentField);
        setForm({
            ...form,
            sections: sections,
        });
    }

    async function fetchData(url: string) {
        const response = await axios.get(url);
        const data = response.data;
        return data;
    }

    useEffect(() => {
        fetchData("http://localhost:8000/forms/1").then((data) => {
            setForm(data);
        });
    }, []);

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
            {!isDefault ? (
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
                                <h3 className="section-title py-3">
                                    {section.title}
                                </h3>
                                {section.fields.map((field, fieldIndex) => {
                                    return (
                                        <div
                                            key={fieldIndex}
                                            className="input-item py-3"
                                        >
                                            <label htmlFor={field.name}>
                                                {field.title}
                                            </label>
                                            {field.type === FieldType.String ? (
                                                <Form.Control
                                                    type="text"
                                                    name={field.name}
                                                    id={field.name}
                                                    value={
                                                        field.value
                                                            ? String(
                                                                  field.value
                                                              )
                                                            : ""
                                                    }
                                                    onChange={(e) => {
                                                        const stringValue =
                                                            String(
                                                                e.target.value
                                                            );

                                                        onFormItemChange(
                                                            stringValue,
                                                            form,
                                                            sectionIndex,
                                                            fieldIndex
                                                        );
                                                    }}
                                                />
                                            ) : field.type ===
                                              FieldType.Number ? (
                                                <Form.Control
                                                    type="number"
                                                    name={field.name}
                                                    id={field.name}
                                                    value={
                                                        field.value
                                                            ? Number(
                                                                  field.value
                                                              )
                                                            : ""
                                                    }
                                                    onChange={(e) => {
                                                        const numberValue =
                                                            Number(
                                                                e.target.value
                                                            );

                                                        onFormItemChange(
                                                            numberValue,
                                                            form,
                                                            sectionIndex,
                                                            fieldIndex
                                                        );
                                                    }}
                                                />
                                            ) : field.type ===
                                              FieldType.Select ? (
                                                <Form.Select
                                                    value={
                                                        field.value
                                                            ? String(
                                                                  field.value
                                                              )
                                                            : "default"
                                                    }
                                                    onChange={(e) => {
                                                        const numberValue =
                                                            String(
                                                                e.currentTarget
                                                                    .value
                                                            );

                                                        onFormItemChange(
                                                            numberValue,
                                                            form,
                                                            sectionIndex,
                                                            fieldIndex
                                                        );
                                                    }}
                                                >
                                                    <option
                                                        value="default"
                                                        disabled
                                                    >
                                                        انتخاب کنید
                                                    </option>
                                                    {field.options?.map(
                                                        (option, index) => {
                                                            return (
                                                                <option
                                                                    key={index}
                                                                >
                                                                    {option}
                                                                </option>
                                                            );
                                                        }
                                                    )}
                                                </Form.Select>
                                            ) : field.type ===
                                              FieldType.Bool ? (
                                                <Form.Check
                                                    className="d-inline mx-3"
                                                    type="switch"
                                                    name={field.name}
                                                    id={field.name}
                                                    checked={
                                                        field.value
                                                            ? true
                                                            : false
                                                    }
                                                    onChange={(e) => {
                                                        const booleanValue =
                                                            e.target.checked;

                                                        onFormItemChange(
                                                            booleanValue,
                                                            form,
                                                            sectionIndex,
                                                            fieldIndex
                                                        );
                                                    }}
                                                />
                                            ) : field.type ===
                                              FieldType.Conditional ? (
                                                <>
                                                    <Form.Check
                                                        className="d-inline mx-3"
                                                        type="switch"
                                                        checked={
                                                            field.value
                                                                ? true
                                                                : false
                                                        }
                                                        onChange={(e) => {
                                                            const booleanValue =
                                                                e.target
                                                                    .checked;
                                                            onFormItemChange(
                                                                booleanValue,
                                                                form,
                                                                sectionIndex,
                                                                fieldIndex
                                                            );
                                                        }}
                                                    />
                                                    {field.value && <div></div>}
                                                </>
                                            ) : (
                                                <Form.Control
                                                    type="text"
                                                    name={field.name}
                                                    id={field.name}
                                                    value={
                                                        field.value
                                                            ? String(
                                                                  field.value
                                                              )
                                                            : ""
                                                    }
                                                    onChange={(e) => {
                                                        onFormItemChange(
                                                            e.target.value,
                                                            form,
                                                            sectionIndex,
                                                            fieldIndex
                                                        );
                                                    }}
                                                />
                                            )}
                                        </div>
                                    );
                                })}
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
