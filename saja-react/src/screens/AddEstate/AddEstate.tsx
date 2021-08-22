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
import { Section } from "../../global/types/EstateSection";

function AddEstateScreen() {
    const [delegationType, setDelegationType] = useState<string>("default");
    const [estateType, setEstateType] = useState<string>("default");
    const isDefault: boolean =
        delegationType !== "default" && estateType !== "default" ? true : false;
    const [sections, setSections] = useState<Section[]>();

    function handleDelegationChange(
        event: React.ChangeEvent<HTMLSelectElement>
    ) {
        setDelegationType(event.target.value);
    }
    function handleTypeChange(event: React.ChangeEvent<HTMLSelectElement>) {
        setEstateType(event.target.value);
    }

    useEffect(() => {
        axios.get("http://localhost:8000/items").then((response) => {
            const data = response.data;
            setSections(data);
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
                    {sections?.map((item, index) => {
                        return (
                            <div
                                className="section card glass shadow-sm py-2 px-4 my-2"
                                key={index}
                            >
                                <h3 className="section-title py-3">
                                    {item.section.title}
                                </h3>
                                {item.section.items.map((item, index) => {
                                    return (
                                        <div
                                            key={index}
                                            className="input-item py-3"
                                        >
                                            <label htmlFor={item.name}>
                                                {item.title}
                                            </label>
                                            {item.type === "string" ? (
                                                <Form.Control
                                                    type="text"
                                                    name={item.name}
                                                    id={item.name}
                                                />
                                            ) : item.type === "int" ? (
                                                <Form.Control
                                                    type="number"
                                                    name={item.name}
                                                    id={item.name}
                                                />
                                            ) : item.type === "list" ? (
                                                <Form.Select defaultValue="default">
                                                    <option
                                                        value="default"
                                                        disabled
                                                    >
                                                        انتخاب کنید
                                                    </option>
                                                    {item.data?.map(
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
                                            ) : item.type === "bool" ? (
                                                <Form.Check
                                                    className="d-inline mx-3"
                                                    type="switch"
                                                    name={item.name}
                                                    id={item.name}
                                                />
                                            ) : (
                                                item.type === "conditional" && (
                                                    <Form.Check
                                                        className="d-inline mx-3"
                                                        type="radio"
                                                    />
                                                )
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                    <Button className="w-100 mb-5 mt-3" variant="purple">
                        ثبت ملک
                    </Button>
                </div>
            )}
        </div>
    );
}

export default AddEstateScreen;
