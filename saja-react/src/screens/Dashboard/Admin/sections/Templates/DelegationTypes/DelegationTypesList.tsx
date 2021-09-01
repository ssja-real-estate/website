import { useEffect, useState } from "react";
import {
    Row,
    Col,
    Button,
    InputGroup,
    Form,
    ListGroup,
    Spinner,
} from "react-bootstrap";
import toast from "react-hot-toast";
import { DelegationType } from "../../../../../../global/types/Estate";
import { fetchGet, fetchPost } from "../../../../../../services/api/fetch";
import { randomId } from "../../../../../../services/utilities/randomId";

function DelegationTypesList() {
    const [delegationTypes, setDelegationTypes] = useState<DelegationType[]>(
        []
    );
    const [newItems, setNewItems] = useState<DelegationType[]>([]);
    const [newDelegationType, setNewDelegationType] = useState<DelegationType>({
        value: "",
    });
    const [loading, setLoading] = useState<boolean>(true);

    async function getData(url: string) {
        fetchGet(url)
            .then((data) => {
                setDelegationTypes(data.data);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    useEffect(() => {
        getData("http://localhost:8000/delegationTypes");
    }, []);

    return (
        <>
            <h4 className="mt-4">نوع واگذاری ها</h4>
            <Row>
                <Col>
                    <InputGroup className="my-4" style={{ direction: "ltr" }}>
                        <Button
                            variant="dark"
                            onClick={() => {
                                newDelegationType.value.trim() !== "" &&
                                    setNewItems((prev) => [
                                        ...prev,
                                        {
                                            id: randomId(),
                                            value: newDelegationType.value.trim(),
                                        },
                                    ]);
                                setNewDelegationType({ value: "" });
                            }}
                        >
                            <i className="bi-plus-lg fs-6"></i>
                        </Button>
                        <Form.Control
                            type="text"
                            placeholder="افزودن نوع جدید"
                            value={newDelegationType.value}
                            onChange={(e) => {
                                setNewDelegationType({ value: e.target.value });
                            }}
                        />
                    </InputGroup>
                </Col>
                <Col sm={"auto"}>
                    <Button
                        variant="success"
                        className="my-4"
                        onClick={() => {
                            toast.promise(
                                fetchPost(
                                    "http://localhost:8000/delegationTypes",
                                    {
                                        id: 1,
                                        data: [...newItems, ...delegationTypes],
                                    }
                                ).then(() => {
                                    setLoading(true);
                                    getData(
                                        "http://localhost:8000/delegationTypes"
                                    ).then(() => {
                                        setNewItems([]);
                                    });
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
                    <ListGroup>
                        {newItems.map((item, index) => {
                            return (
                                <ListGroup.Item key={index} variant="warning">
                                    {item.value}
                                </ListGroup.Item>
                            );
                        })}
                    </ListGroup>
                </Col>
                <Col>
                    {loading ? (
                        <Spinner
                            animation="border"
                            variant="primary"
                            className="my-5"
                        />
                    ) : (
                        <ListGroup>
                            {delegationTypes.map((delegationType, index) => {
                                return (
                                    <ListGroup.Item key={index}>
                                        {delegationType.value}
                                    </ListGroup.Item>
                                );
                            })}
                        </ListGroup>
                    )}
                </Col>
            </Row>
        </>
    );
}

export default DelegationTypesList;
