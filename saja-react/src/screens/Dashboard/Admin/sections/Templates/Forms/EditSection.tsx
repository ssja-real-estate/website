import { useState } from "react";
import { Button, Col, Form, ListGroup, Row } from "react-bootstrap";
import { useRecoilState } from "recoil";
import { FieldType } from "../../../../../../global/types/Field";
import { modalSectionAtom } from "./Forms";

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

    return (
        <>
            <Row className="align-items-center">
                <Col sm="auto">
                    <Form.Label>تغییر عنوان بخش</Form.Label>
                </Col>
                <Col sm="auto">
                    <Form.Control
                        type="text"
                        value={sectionTitle}
                        onChange={(e) => {
                            setSectionTitle(e.target.value);
                        }}
                    />
                </Col>
            </Row>
            <Row className="align-items-center my-3">
                <Col xs={"auto"}>
                    <h5>ورودی ها</h5>
                </Col>
                <Col xs={"auto"}>
                    <Button variant="dark">
                        <i className="bi-plus-lg fs-6"></i>
                    </Button>
                </Col>
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
                                        {field.type === FieldType.String
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
                            </Row>
                        </ListGroup.Item>
                    );
                })}
            </ListGroup>
        </>
    );
}

export default EditSection;
