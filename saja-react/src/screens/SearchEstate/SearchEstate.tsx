import { useState } from "react";
import "./SearchEstate.css";
import { motion } from "framer-motion";
import {
    crossfadeAnimation,
    elevationEffect,
} from "../../animations/motionVariants";
import { Form } from "react-bootstrap";
import { delegationTypes, estateTypes } from "../../global/constants/estates";

function SearchEstateScreen() {
    const [delegationType, setDelegationType] = useState<string>("default");
    const [estateType, setEstateType] = useState<string>("default");
    const isDefault: boolean =
        delegationType !== "default" && estateType !== "default" ? true : false;

    function handleDelegationChange(
        event: React.ChangeEvent<HTMLSelectElement>
    ) {
        setDelegationType(event.target.value);
    }
    function handleTypeChange(event: React.ChangeEvent<HTMLSelectElement>) {
        setEstateType(event.target.value);
    }

    return (
        <div className="search-estate-container">
            <motion.div
                variants={elevationEffect}
                initial="first"
                animate="second"
                className="search-estate card glass shadow rounded-3 py-3 px-4 my-4 sticky-top"
            >
                <h2 className="search-estate-title text-center">جستجوی ملک</h2>
                <form className="search-estate-form py-3">
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
                <div>
                    <h6>{delegationType}</h6>
                    <h6>{estateType}</h6>
                </div>
            )}
        </div>
    );
}

export default SearchEstateScreen;
