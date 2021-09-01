import { useEffect, useState } from "react";
import {
    DragDropContext,
    Droppable,
    Draggable,
    DropResult,
} from "react-beautiful-dnd";
import { Row, Col, Button, InputGroup, Form, ListGroup } from "react-bootstrap";
import { EstateType } from "../../../../../../global/types/Estate";
import { fetchGet } from "../../../../../../services/api/fetch";

function EstateTypesList() {
    const [estateTypes, setEstateTypes] = useState<EstateType[]>([]);
    const [newEstateType, setNewEstateType] = useState<EstateType>({
        value: "",
    });

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
        fetchGet("http://localhost:8000/estateTypes")
            .then((data) => {
                setEstateTypes(data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

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
                        newEstateType.value.trim() !== "" &&
                            setEstateTypes((prev) => [
                                ...prev,
                                { value: newEstateType.value.trim() },
                            ]);
                        setNewEstateType({ value: "" });
                    }}
                >
                    <i className="bi-plus-lg fs-6"></i>
                </Button>
                <Form.Control
                    type="text"
                    placeholder="افزودن نوع جدید"
                    value={newEstateType.value}
                    onChange={(e) => {
                        setNewEstateType({ value: e.target.value });
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
                                                        {estateType.value}
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
