// import Select from "../../components/Select/Select";
import { useState } from "react";
import "./AddEstate.css";
import { motion } from "framer-motion";
import {
    crossfadeAnimation,
    elevationEffect,
} from "../../animations/motionVariants";
import { Form } from "react-bootstrap";

const delegationTypes = [
    { value: "sell", text: "فروش" },
    { value: "exchange", text: "معاوضه" },
    { value: "mortgage", text: "رهن" },
    { value: "rent", text: "اجاره" },
    { value: "preSell", text: "پیش‌فروش" },
    { value: "constructionParticipation", text: "مشارکت در ساخت" },
    { value: "interestParticipation", text: "مشارکت در بهره برداری" },
];

const estateTypes = [
    { value: "house", text: "خانه" },
    { value: "apartment", text: "آپارتمان" },
    { value: "villa", text: "ویلا" },
    { value: "residentialLand", text: "زمین مسکونی" },
    { value: "farmingLand", text: "زمین کشاورزی" },
    { value: "garden", text: "باغ" },
    { value: "shop", text: "مغازه" },
    { value: "office", text: "دفتر کار" },
    { value: "basement", text: "زیرزمین" },
    { value: "storehouse", text: "انبار" },
    { value: "parking", text: "پارکینگ" },
    { value: "garage", text: "گاراژ" },
    { value: "workshop", text: "کارگاه" },
    { value: "manufactory", text: "کارخانه" },
    { value: "chickenFarm", text: "مرغداری" },
    { value: "ranch", text: "دامداری" },
    { value: "refrigeratedRoom", text: "سردخانه" },
    { value: "hotel", text: "هتل" },
    { value: "motel", text: "مسافرخانه" },
    { value: "restaurant", text: "رستوران" },
    { value: "suite", text: "سوئیت" },
    { value: "weddingVenue", text: "تالار عروسی" },
    { value: "mine", text: "معدن" },
    { value: "loan", text: "وام" },
    { value: "receipt", text: "فیش" },
    { value: "petrolStation", text: "جایگاه سوخت" },
    { value: "warehouse", text: "سوله" },
];

function AddEstateScreen() {
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
        <div className="add-estate-container">
            <motion.div
                variants={elevationEffect}
                initial="first"
                animate="second"
                className="add-estate card glass shadow rounded-3 py-3 px-4 my-4 sticky-top"
            >
                <h2 className="add-estate-title text-center">ثبت ملک</h2>
                <form className="add-estate-form input-group d-flex align-items-center">
                    <label htmlFor="delegationType">نوع واگذاری</label>
                    <Form.Select
                        className="form-select rounded-3 my-1 me-3 ms-5"
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
                                    {option.text}
                                </option>
                            );
                        })}
                    </Form.Select>
                    <label htmlFor="delegationType">نوع ملک</label>
                    <Form.Select
                        className="form-select rounded-3 my-1 me-3"
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
                                    {option.text}
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

export default AddEstateScreen;
