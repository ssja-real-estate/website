import { useEffect, useState } from "react";
import {
    DragDropContext,
    Droppable,
    Draggable,
    DropResult,
} from "react-beautiful-dnd";
import { Row, Col, Button, InputGroup, Form, ListGroup } from "react-bootstrap";
import { DelegationType } from "../../../../../../global/types/Estate";
import { fetchGet } from "../../../../../../services/api/fetch";

function DelegationTypesList() {
    const [delegationTypes, setDelegationTypes] = useState<DelegationType[]>(
        []
    );
    const [newDelegationType, setNewDelegationType] = useState<DelegationType>({
        value: "",
    });

    function handleDelegationTypesDragEnd(result: DropResult) {
        if (!result.destination) {
            return;
        }

        const items = [...delegationTypes];
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setDelegationTypes([...items]);
    }

    useEffect(() => {
        fetchGet("http://localhost:8000/delegationTypes")
            .then((data) => {
                setDelegationTypes(data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

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
                        newDelegationType.value.trim() !== "" &&
                            setDelegationTypes((prev) => [
                                ...prev,
                                { value: newDelegationType.value.trim() },
                            ]);
                        setNewDelegationType({ value: "" });
                    }}
                >
                    <i className="bi-plus-lg"></i>
                </Button>
                <Form.Control
                    type="text"
                    placeholder="افزودن نوع جدید"
                    value={newDelegationType.value}
                    onChange={(e) => {
                        setNewDelegationType({ value: e.target.value.trim() });
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
                                                            {
                                                                delegationType.value
                                                            }
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
