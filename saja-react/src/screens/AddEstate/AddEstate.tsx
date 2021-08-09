import Button from "../../components/Button/Button";
import Select from "../../components/Select/Select";
import { useHistory } from "react-router-dom";
import "./AddEstate.css";

const testArray = [
    { value: "option1", text: "option1" },
    { value: "option2", text: "option2" },
    { value: "option3", text: "option3" },
];

function AddEstateScreen() {
    let history = useHistory();

    function handleClick(
        event: React.MouseEvent<HTMLInputElement, MouseEvent>
    ) {
        event.preventDefault();
        history.push("/");
    }

    return (
        <div className="add-estate-container">
            <div className="add-estate card shadow rounded-3 py-4 px-3">
                <h1 className="add-estate-title text-center">ثبت ملک</h1>
                <form className="add-estate-form">
                    <Select
                        className="form-select py-2 mb-3 rounded-3"
                        name="delegationType"
                        id="delegationType"
                        label="نوع واگذاری"
                        options={testArray}
                    />
                    <Select
                        className="form-select py-2 rounded-3"
                        name="estateType"
                        id="estateType"
                        label="نوع ملک"
                        options={testArray}
                    />
                    <Button
                        className="btn btn-purple w-100 mt-5 rounded-3"
                        name="addEstateBtn"
                        id="addEstateBtn"
                        type="submit"
                        value="ثبت ملک"
                        onClick={handleClick}
                    />
                </form>
            </div>
        </div>
    );
}

export default AddEstateScreen;
