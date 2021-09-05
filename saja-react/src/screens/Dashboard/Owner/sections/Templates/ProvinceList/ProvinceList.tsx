import React, { useEffect, useState } from "react";
import {
    Button,
    Row,
    Col,
    InputGroup,
    Form,
    ListGroup,
    Spinner,
} from "react-bootstrap";
import toast from "react-hot-toast";
import ListItem from "../../../../../../components/ListItem/ListItem";
import { Province } from "../../../../../../global/types/Estate";
import { fetchGet, fetchPut } from "../../../../../../services/api/fetch";
import { randomId } from "../../../../../../services/utilities/randomId";

function ProvinceList() {
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [removedItems, setRemovedItems] = useState<Province[]>([]);
    const [newItems, setNewItems] = useState<Province[]>([]);
    const [newProvince, setNewProvince] = useState<Province>({
        value: "",
        id: randomId(),
    });
    const [loading, setLoading] = useState<boolean>(true);

    async function getData(url: string) {
        fetchGet(url)
            .then((data) => {
                setProvinces(data.data);
                setNewItems([]);
                setRemovedItems([]);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    useEffect(() => {
        getData("http://localhost:8000/provinces");
    }, []);

    return (
        <>
            <h4 className="mt-4 ms-3 d-inline">استان ها</h4>
            <Button
                variant="dark"
                className="refresh-btn d-inline rounded-circle"
                onClick={() => {
                    setLoading(true);
                    getData("http://localhost:8000/provinces");
                }}
            >
                <i className="bi-arrow-counterclockwise"></i>
            </Button>
            <Row>
                <Col>
                    <InputGroup className="my-4" style={{ direction: "ltr" }}>
                        <Button
                            variant="dark"
                            onClick={() => {
                                newProvince.value.trim() !== "" &&
                                    setNewItems((prev) => [
                                        ...prev,
                                        {
                                            id: randomId(),
                                            value: newProvince.value.trim(),
                                        },
                                    ]);
                                setNewProvince({
                                    ...newProvince,
                                    value: "",
                                });
                            }}
                        >
                            <i className="bi-plus-lg fs-6"></i>
                        </Button>
                        <Form.Control
                            type="text"
                            placeholder="افزودن استان جدید"
                            value={newProvince.value}
                            onChange={(e) => {
                                setNewProvince({
                                    ...newProvince,
                                    value: e.target.value,
                                });
                            }}
                        />
                    </InputGroup>
                </Col>
                <Col sm={"auto"}>
                    <Button
                        variant="purple"
                        className="my-4"
                        onClick={() => {
                            setLoading(true);
                            setNewItems([]);
                            setRemovedItems([]);
                            const allItems = [...newItems, ...provinces];
                            const finalItems = allItems.filter(
                                (item) =>
                                    !removedItems
                                        .map((removedItem) => removedItem.id)
                                        .includes(item.id)
                            );
                            toast.promise(
                                fetchPut("http://localhost:8000/provinces", {
                                    id: 1,
                                    data: finalItems,
                                }).then(() => {
                                    getData("http://localhost:8000/provinces");
                                }),
                                {
                                    loading: "در حال ذخیره سازی تغییرات",
                                    success: "تغییرات با موفقیت ذخیره شد",
                                    error: "خطا در ذخیره سازی تغییرات",
                                },
                                {
                                    style: { width: 250 },
                                }
                            );
                        }}
                    >
                        ذخیره تغییرات
                    </Button>
                </Col>
            </Row>
            <Row>
                <Col>
                    {loading ? (
                        <Spinner
                            animation="border"
                            variant="primary"
                            className="my-5"
                        />
                    ) : (
                        <ListGroup>
                            {provinces.map((province, index) => {
                                return (
                                    <React.Fragment key={index}>
                                        <ListItem
                                            title={province.value}
                                            onRemove={() => {
                                                setRemovedItems((prev) => {
                                                    let exists: boolean = false;
                                                    prev.every((item) => {
                                                        if (
                                                            item.id ===
                                                            province.id
                                                        ) {
                                                            exists = true;
                                                            return false;
                                                        } else {
                                                            return true;
                                                        }
                                                    });
                                                    if (exists) {
                                                        const newRemovedItems =
                                                            prev.filter(
                                                                (item) =>
                                                                    item.id !==
                                                                    province.id
                                                            );
                                                        return newRemovedItems;
                                                    } else {
                                                        const newRemovedItems =
                                                            [...prev, province];
                                                        return newRemovedItems;
                                                    }
                                                });
                                            }}
                                        />
                                    </React.Fragment>
                                );
                            })}
                        </ListGroup>
                    )}
                </Col>
                <Col>
                    <ListGroup>
                        {newItems.map((newItem, index) => {
                            return (
                                <ListGroup.Item
                                    key={index}
                                    variant="warning"
                                    action
                                    className="new-item d-flex flex-row justify-content-between align-items-center"
                                >
                                    {newItem.value}
                                    <i
                                        className="remove-icon bi-x-lg"
                                        onClick={() => {
                                            setNewItems((prev) =>
                                                prev.filter(
                                                    (_, id) => id !== index
                                                )
                                            );
                                        }}
                                    ></i>
                                </ListGroup.Item>
                            );
                        })}
                    </ListGroup>
                </Col>
            </Row>
        </>
    );
}

export default ProvinceList;
