import React from "react";
import { useState } from "react";
import {
    InputGroup,
    Button,
    Form,
    ListGroup,
    CloseButton,
} from "react-bootstrap";
import { atom, useRecoilState } from "recoil";

export const optionsAtom = atom<string[]>({
    key: "modalOptionsState",
    default: [],
});

function NewSelectField() {
    const [newOptionTitle, setNewOptionTitle] = useState<string>("");
    const [options, setOptions] = useRecoilState(optionsAtom);

    return (
        <div className="w-100 d-flex flex-row justify-content-center">
            <div className="d-flex flex-column justify-content-center gap-2 pt-3">
                <InputGroup style={{ direction: "ltr" }}>
                    <Button
                        variant="dark"
                        onClick={() => {
                            if (newOptionTitle.trim() !== "") {
                                setOptions([...options, newOptionTitle]);
                                setNewOptionTitle("");
                            } else {
                                setNewOptionTitle("");
                                alert(
                                    "لطفاً یک عنوان معتبر برای گزینه جدید انتخاب کنید"
                                );
                            }
                        }}
                    >
                        <i className="bi-plus-lg fs-6"></i>
                    </Button>
                    <Form.Control
                        type="text"
                        placeholder="گزینه جدید"
                        value={newOptionTitle}
                        onChange={(e) => {
                            setNewOptionTitle(e.target.value);
                        }}
                    />
                </InputGroup>
                <ListGroup>
                    {options.map((option, optionIndex) => {
                        return (
                            <ListGroup.Item
                                key={optionIndex}
                                className="d-flex flex-row justify-content-between align-items-center"
                            >
                                {option}
                                <CloseButton
                                    onClick={() => {
                                        const newOptions = options;
                                        const filteredOptions =
                                            newOptions.filter((_, index) => {
                                                return optionIndex !== index;
                                            });
                                        setOptions(filteredOptions);
                                    }}
                                />
                            </ListGroup.Item>
                        );
                    })}
                </ListGroup>
            </div>
        </div>
    );
}

export default NewSelectField;
