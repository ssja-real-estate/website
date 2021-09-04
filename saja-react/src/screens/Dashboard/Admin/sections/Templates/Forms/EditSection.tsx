import { useEffect, useState } from "react";
import {
    Button,
    CloseButton,
    Col,
    Form,
    InputGroup,
    ListGroup,
    Row,
} from "react-bootstrap";
import { useRecoilState } from "recoil";
import { FieldType } from "../../../../../../global/types/Field";
import { modalSectionAtom } from "./Forms";
import NewField from "./NewField/NewField";

function EditSection() {
    const [modalSection, setModalSection] = useRecoilState(modalSectionAtom);
    const [sectionTitle, setSectionTitle] = useState<string>("");

    function moveItemUp(fieldIndex: number) {
        const tempFields = [...modalSection!.fields];
        const indexToMoveTo = fieldIndex === 0 ? 0 : fieldIndex - 1;
        const [reorderedItem] = tempFields.splice(fieldIndex, 1);
        tempFields.splice(indexToMoveTo, 0, reorderedItem);
        setModalSection({ ...modalSection!, fields: tempFields });
    }

    function moveItemDown(fieldIndex: number) {
        const tempFields = [...modalSection!.fields];
        const indexToMoveTo =
            fieldIndex === tempFields.length - 1
                ? tempFields.length - 1
                : fieldIndex + 1;
        const [reorderedItem] = tempFields.splice(fieldIndex, 1);
        tempFields.splice(indexToMoveTo, 0, reorderedItem);
        setModalSection({ ...modalSection!, fields: tempFields });
    }

    useEffect(() => {
        modalSection && setSectionTitle(modalSection.title);
    }, [modalSection, modalSection?.title]);

    return (
        <>
            <Row className="align-items-center my-3">
                <Col sm="auto">
                    <Form.Label>عنوان بخش</Form.Label>
                </Col>
                <InputGroup style={{ direction: "ltr" }}>
                    <Button
                        variant="dark"
                        onClick={() => {
                            if (sectionTitle.trim() === "") {
                                alert(
                                    "لطفاً یک عنوان معتبر برای بخش انتخاب کنید"
                                );
                                setSectionTitle("");
                            } else {
                                setModalSection({
                                    ...modalSection!,
                                    title: sectionTitle!,
                                });
                            }
                        }}
                    >
                        ذخیره
                    </Button>
                    <Form.Control
                        type="text"
                        value={sectionTitle}
                        onChange={(e) => {
                            setSectionTitle(e.target.value);
                        }}
                    />
                </InputGroup>
            </Row>
            <ListGroup>
                {modalSection?.fields.map((field, fieldIndex) => {
                    return (
                        <ListGroup.Item key={fieldIndex} variant="info">
                            <Row className="align-items-center">
                                <Col>
                                    <i
                                        className="bi-chevron-up d-block"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => {
                                            moveItemUp(fieldIndex);
                                        }}
                                    ></i>
                                    <i
                                        className="bi-chevron-down d-block"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => {
                                            moveItemDown(fieldIndex);
                                        }}
                                    ></i>
                                </Col>
                                <Col>
                                    <h6 className="d-inline">{field.title}</h6>
                                </Col>
                                <Col>
                                    <h6 className="d-inline text-muted">
                                        {field.type === FieldType.Text
                                            ? "متن"
                                            : field.type === FieldType.Number
                                            ? "عدد"
                                            : field.type === FieldType.Select
                                            ? "انتخابی"
                                            : field.type === FieldType.Bool
                                            ? "کلید"
                                            : field.type ===
                                              FieldType.Conditional
                                            ? "شرطی"
                                            : field.type === FieldType.Image
                                            ? "تصویر"
                                            : "---"}
                                    </h6>
                                </Col>
                                <CloseButton
                                    className="m-3"
                                    onClick={() => {
                                        const fields = modalSection.fields;
                                        const filteredFields = fields.filter(
                                            (_, index) => {
                                                return fieldIndex !== index;
                                            }
                                        );
                                        if (
                                            window.confirm(
                                                "آیا از حذف این ورودی مطمئن هستید؟"
                                            )
                                        ) {
                                            setModalSection({
                                                ...modalSection,
                                                fields: filteredFields,
                                            });
                                        }
                                    }}
                                />
                            </Row>
                        </ListGroup.Item>
                    );
                })}
            </ListGroup>
            <div className="d-flex flex-column justify-content-center align-items-stretch my-3">
                <h5>ورودی ها</h5>
                <NewField />
            </div>
        </>
    );
}

export default EditSection;
