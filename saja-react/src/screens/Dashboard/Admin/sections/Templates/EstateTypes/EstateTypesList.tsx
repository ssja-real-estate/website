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
import { useHistory } from "react-router-dom";
import { EstateType } from "../../../../../../global/types/Estate";
import { fetchGet, fetchPost } from "../../../../../../services/api/fetch";
import { randomId } from "../../../../../../services/utilities/randomId";

function EstateTypesList() {
    const [estateTypes, setEstateTypes] = useState<EstateType[]>([]);
    const [newItems, setNewItems] = useState<EstateType[]>([]);
    const [newEstateType, setNewEstateType] = useState<EstateType>({
        value: "",
    });
    const [loading, setLoading] = useState<boolean>(true);

    const history = useHistory();

    async function getData(url: string) {
        fetchGet(url)
            .then((data) => {
                setEstateTypes(data.data);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    useEffect(() => {
        getData("http://localhost:8000/estateTypes");
    }, [history.location]);

    return (
        <>
            <h4 className="mt-4">نوع ملک ها</h4>
            <Row>
                <Col>
                    <InputGroup className="my-4" style={{ direction: "ltr" }}>
                        <Button
                            variant="dark"
                            onClick={() => {
                                newEstateType.value.trim() !== "" &&
                                    setNewItems((prev) => [
                                        ...prev,
                                        {
                                            id: randomId(),
                                            value: newEstateType.value.trim(),
                                        },
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
                </Col>
                <Col sm={"auto"}>
                    <Button
                        variant="success"
                        className="my-4"
                        onClick={() => {
                            toast.promise(
                                fetchPost("http://localhost:8000/estateTypes", {
                                    id: 1,
                                    data: [...newItems, ...estateTypes],
                                }).then(() => {
                                    setLoading(true);
                                    getData(
                                        "http://localhost:8000/estateTypes"
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
                            {estateTypes.map((estateType, index) => {
                                return (
                                    <ListGroup.Item key={index}>
                                        {estateType.value}
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

export default EstateTypesList;
