import { useEffect, useState } from "react";
import {
    DragDropContext,
    Droppable,
    Draggable,
    DropResult,
} from "react-beautiful-dnd";
import { Row, Col, Button, InputGroup, Form, ListGroup } from "react-bootstrap";
import { fetchData } from "../../../../../../services/api/fetchData";

function DelegationTypesList() {
    const [delegationTypes, setDelegationTypes] = useState<string[]>([]);
    const [newDelegationType, setNewDelegationType] = useState<string>("");

    function handleDelegationTypesDragEnd(result: DropResult) {
        if (!result.destination) {
            return;
        }

        const items = [...delegationTypes];
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setDelegationTypes(items);
    }

    useEffect(() => {
        fetchData("http://localhost:8000/delegationTypes")
            .then((data) => {
                setDelegationTypes(data);
            })
            .catch((error) => {
                console.log(error);
            });
    });

    return (
        <>
            <Row className="align-items-center">
                <Col xl={6}>
                    <h4>نوع واگذاری ها</h4>
                </Col>
                <Col xl={6}>
                    <Button
                        variant="success"
                        className="mb-3"
                        onClick={() => {
                            console.log(delegationTypes);
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
                        newDelegationType.trim() !== "" &&
                            setDelegationTypes((prev) => [
                                ...prev,
                                newDelegationType,
                            ]);
                        setNewDelegationType("");
                    }}
                >
                    <i className="bi-plus-lg"></i>
                </Button>
                <Form.Control
                    type="text"
                    placeholder="افزودن نوع جدید"
                    value={newDelegationType}
                    onChange={(e) => {
                        setNewDelegationType(e.target.value);
                    }}
                />
            </InputGroup>
            <DragDropContext onDragEnd={handleDelegationTypesDragEnd}>
                <Droppable droppableId="delegationTypes">
                    {(provided) => {
                        return (
                            <ListGroup
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                            >
                                {delegationTypes.map(
                                    (delegationType, index) => {
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
                                                            ref={
                                                                provided.innerRef
                                                            }
                                                        >
                                                            {delegationType}
                                                        </ListGroup.Item>
                                                    );
                                                }}
                                            </Draggable>
                                        );
                                    }
                                )}
                                {provided.placeholder}
                            </ListGroup>
                        );
                    }}
                </Droppable>
            </DragDropContext>
        </>
    );
}

export default DelegationTypesList;
