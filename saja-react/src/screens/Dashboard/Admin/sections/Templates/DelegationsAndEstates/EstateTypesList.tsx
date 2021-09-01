import { useEffect, useState } from "react";
import {
    DragDropContext,
    Droppable,
    Draggable,
    DropResult,
} from "react-beautiful-dnd";
import { Row, Col, Button, InputGroup, Form, ListGroup } from "react-bootstrap";
import { fetchData } from "../../../../../../services/api/fetchData";

function EstateTypesList() {
    const [estateTypes, setEstateTypes] = useState<string[]>([]);
    const [newEstateType, setNewEstateType] = useState<string>("");

    function handleEstateTypesDragEnd(result: DropResult) {
        if (!result.destination) {
            return;
        }

        const items = [...estateTypes];
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setEstateTypes(items);
    }

    useEffect(() => {
        fetchData("http://localhost:8000/estateTypes")
            .then((data) => {
                setEstateTypes(data);
            })
            .catch((error) => {
                console.log(error);
            });
    });

    return (
        <>
            <Row className="align-items-center">
                <Col xl={6}>
                    <h4>نوع ملک ها</h4>
                </Col>
                <Col xl={6}>
                    <Button
                        variant="success"
                        className="mb-3"
                        onClick={() => {
                            console.log(estateTypes);
                        }}
                    >
                        ذخیره تغییرات
                    </Button>
                </Col>
            </Row>
            <InputGroup className="mb-4" style={{ direction: "ltr" }}>
                <Button
                    variant="dark"
                    onClick={() => {
                        newEstateType.trim() !== "" &&
                            setEstateTypes((prev) => [...prev, newEstateType]);
                        setNewEstateType("");
                    }}
                >
                    <i className="bi-plus-lg"></i>
                </Button>
                <Form.Control
                    type="text"
                    placeholder="افزودن نوع جدید"
                    value={newEstateType}
                    onChange={(e) => {
                        setNewEstateType(e.target.value);
                    }}
                />
            </InputGroup>
            <DragDropContext onDragEnd={handleEstateTypesDragEnd}>
                <Droppable droppableId="estateTypes">
                    {(provided) => {
                        return (
                            <ListGroup
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                            >
                                {estateTypes.map((estateType, index) => {
                                    return (
                                        <Draggable
                                            key={index}
                                            draggableId={`id-${index}`}
                                            index={index}
                                        >
                                            {(provided) => {
                                                return (
                                                    <ListGroup.Item
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        ref={provided.innerRef}
                                                    >
                                                        {estateType}
                                                    </ListGroup.Item>
                                                );
                                            }}
                                        </Draggable>
                                    );
                                })}
                                {provided.placeholder}
                            </ListGroup>
                        );
                    }}
                </Droppable>
            </DragDropContext>
        </>
    );
}

export default EstateTypesList;
