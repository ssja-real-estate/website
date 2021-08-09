import Button from "../../components/Button/Button";
import Select from "../../components/Select/Select";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import "./SearchEstate.css";

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

function SearchEstateScreen() {
    const [delegationType, setDelegationType] = useState<string>("default");
    const [estateType, setEstateType] = useState<string>("default");

    let history = useHistory();

    function handleDelegationChange(
        event: React.ChangeEvent<HTMLSelectElement>
    ) {
        setDelegationType(event.target.value);
    }
    function handleTypeChange(event: React.ChangeEvent<HTMLSelectElement>) {
        setEstateType(event.target.value);
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        console.log(delegationType, estateType);
        history.push("/");
    }

    return (
        <div className="search-estate-container">
            <div className="search-estate card shadow rounded-3 py-4 px-3">
                <h1 className="search-estate-title text-center">جستجوی ملک</h1>
                <form className="search-estate-form" onSubmit={handleSubmit}>
                    <Select
                        className="form-select py-2 mb-3 rounded-3"
                        name="delegationType"
                        id="delegationType"
                        label="نوع واگذاری"
                        options={delegationTypes}
                        value={delegationType}
                        onChange={handleDelegationChange}
                    />
                    <Select
                        className="form-select py-2 rounded-3"
                        name="estateType"
                        id="estateType"
                        label="نوع ملک"
                        options={estateTypes}
                        value={estateType}
                        onChange={handleTypeChange}
                    />
                    <Button
                        className="btn btn-purple w-100 mt-5 rounded-3"
                        name="searchEstateBtn"
                        id="searchEstateBtn"
                        type="submit"
                        value="جستجوی ملک"
                    />
                </form>
            </div>
        </div>
    );
}

export default SearchEstateScreen;
