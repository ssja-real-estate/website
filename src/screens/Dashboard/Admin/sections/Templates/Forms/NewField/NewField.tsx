import { useState } from "react";
import { InputGroup, Button, Form, Col, Row } from "react-bootstrap";
import { useRecoilState } from "recoil";
import {
    Field,
    FieldType,
    FieldTypeTitle,
} from "../../../../../../../global/types/Field";
import { modalSectionAtom } from "../Forms";
import NewConditionalField, { innerFieldsAtom } from "./NewConditionalField";
import NewSelectField, { optionsAtom } from "./NewSelectField";

function NewField() {
    const [modalSection, setModalSection] = useRecoilState(modalSectionAtom);
    const [selectedType, setSelectedType] = useState<number>(FieldType.Text);
    const [newFieldTitle, setNewFieldTitle] = useState<string>("");
    const [options, setOptions] = useRecoilState(optionsAtom);
    const [innerFields, setInnerFields] = useRecoilState(innerFieldsAtom);

    function addNewField(newField: Field) {
        const newFields = [newField, ...modalSection.fields];
        setModalSection({ ...modalSection, fields: newFields });
    }

    return (
        <>
            <Row className="align-items-center">
                <Col sm="auto">
                    <Form.Label>ورودی جدید</Form.Label>
                </Col>
                <Col>
                    <InputGroup style={{ direction: "ltr" }}>
                        <Button
                            variant="dark"
                            onClick={() => {
                                let newField: Field = {
                                    name: "",
                                    title: "",
                                    type: 0,
                                    value: "",
                                };
                                switch (selectedType) {
                                    case FieldType.Text:
                                        newField = {
                                            name: newFieldTitle,
                                            title: newFieldTitle,
                                            type: FieldType.Text,
                                            value: "",
                                        };
                                        break;
                                    case FieldType.Number:
                                        newField = {
                                            name: newFieldTitle,
                                            title: newFieldTitle,
                                            type: FieldType.Number,
                                            value: 0,
                                        };
                                        break;
                                    case FieldType.Select:
                                        newField = {
                                            name: newFieldTitle,
                                            title: newFieldTitle,
                                            type: FieldType.Select,
                                            value: "",
                                            options: options,
                                        };
                                        break;
                                    case FieldType.Bool:
                                        newField = {
                                            name: newFieldTitle,
                                            title: newFieldTitle,
                                            type: FieldType.Bool,
                                            value: false,
                                        };
                                        break;
                                    case FieldType.Conditional:
                                        newField = {
                                            name: newFieldTitle,
                                            title: newFieldTitle,
                                            type: FieldType.Conditional,
                                            value: false,
                                            fields: innerFields,
                                        };
                                        break;
                                    default:
                                        break;
                                }
                                console.log(newField);
                                if (newFieldTitle.trim() !== "") {
                                    if (selectedType === FieldType.Select) {
                                        if (options.length > 1) {
                                            addNewField(newField);
                                            setNewFieldTitle("");
                                            setOptions([]);
                                        } else {
                                            alert(
                                                "لطفاً حدأقل دو گزینه برای ورودی جدید اضافه کنید"
                                            );
                                        }
                                    } else if (
                                        selectedType === FieldType.Conditional
                                    ) {
                                        if (innerFields.length > 0) {
                                            addNewField(newField);
                                            setNewFieldTitle("");
                                            setInnerFields([]);
                                            setOptions([]);
                                        } else {
                                            alert(
                                                "لطفاً حداقل یک ورودی داخلی برای ورودی شرطی اضافه کنید"
                                            );
                                        }
                                    } else {
                                        addNewField(newField);
                                        setNewFieldTitle("");
                                        setOptions([]);
                                    }
                                } else {
                                    setNewFieldTitle("");
                                    alert(
                                        "لطفاً یک عنوان برای ورودی جدید انتخاب کنید"
                                    );
                                }
                            }}
                        >
                            <i className="bi-plus-lg fs-6"></i>
                        </Button>
                        <Form.Select
                            style={{ minWidth: 100, maxWidth: "15vw" }}
                            value={selectedType}
                            onChange={(e) => {
                                setSelectedType(Number(e.currentTarget.value));
                            }}
                        >
                            <option value={FieldType.Text}>
                                {FieldTypeTitle.Text}
                            </option>
                            <option value={FieldType.Number}>
                                {FieldTypeTitle.Number}
                            </option>
                            <option value={FieldType.Select}>
                                {FieldTypeTitle.Select}
                            </option>
                            <option value={FieldType.Bool}>
                                {FieldTypeTitle.Bool}
                            </option>
                            <option value={FieldType.Conditional}>
                                {FieldTypeTitle.Conditional}
                            </option>
                        </Form.Select>
                        <Form.Control
                            type="text"
                            placeholder="عنوان ورودی جدید"
                            maxLength={30}
                            value={newFieldTitle}
                            onChange={(e) => {
                                setNewFieldTitle(e.target.value);
                            }}
                        />
                    </InputGroup>
                </Col>
            </Row>
            {selectedType === FieldType.Select ? (
                <NewSelectField />
            ) : (
                selectedType === FieldType.Conditional && (
                    <NewConditionalField />
                )
            )}
        </>
    );
}

export default NewField;
