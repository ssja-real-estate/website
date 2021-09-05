import { useState, useEffect } from "react";
import { Button, Row, Col, ListGroup, Spinner, Form } from "react-bootstrap";
import { City, Province } from "../../../../../../global/types/Estate";
import { fetchGet } from "../../../../../../services/api/fetch";
import "./CityList.css";

function CityList() {
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [cities, setCities] = useState<City[]>([]);
    const [selectedProvince, setSelectedProvince] = useState<Province>();
    const [loading, setLoading] = useState<boolean>(true);

    async function getProvinceData(url: string) {
        fetchGet(url)
            .then((data) => {
                setProvinces(data.data);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    async function getCityData(url: string) {
        fetchGet(url)
            .then((data) => {
                setCities(data.data);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    useEffect(() => {
        getProvinceData("http://localhost:8000/provinces");
    }, []);

    useEffect(() => {
        setLoading(true);
        if (selectedProvince && selectedProvince.id !== "default") {
            getCityData(`http://localhost:8000/cities/${selectedProvince?.id}`);
        }
    }, [selectedProvince]);

    return (
        <>
            <h4 className="mt-4 ms-3 d-inline">شهر ها</h4>
            <Button
                variant="dark"
                className="refresh-btn d-inline rounded-circle"
                onClick={() => {
                    setLoading(true);
                    getProvinceData("http://localhost:8000/provinces");
                    getCityData(`http://localhost:8000/cities`);
                }}
            >
                <i className="bi-arrow-counterclockwise"></i>
            </Button>
            <div className="d-flex flex-row justify-content-center mt-3">
                <Form.Select
                    style={{ maxWidth: 300 }}
                    defaultValue="default"
                    value={selectedProvince?.value}
                    onChange={(e) => {
                        setSelectedProvince({
                            ...selectedProvince!,
                            id: e.currentTarget.value,
                        });
                    }}
                >
                    <option value="default" disabled>
                        انتخاب کنید
                    </option>
                    {provinces.map((province, index) => {
                        return (
                            <option key={index} value={province.id}>
                                {province.value}
                            </option>
                        );
                    })}
                </Form.Select>
            </div>
            {loading ? (
                <Row className="align-items-center">
                    <Col>
                        <Spinner
                            animation="border"
                            variant="primary"
                            className="my-5"
                        />
                    </Col>
                </Row>
            ) : (
                <div className="d-flex flex-column justify-content-center align-items-center">
                    <ListGroup
                        className="mt-3"
                        style={{ minWidth: 300, maxWidth: 400 }}
                    >
                        {cities &&
                            cities.map((city, index) => {
                                return (
                                    <ListGroup.Item key={index}>
                                        {city.value}
                                    </ListGroup.Item>
                                );
                            })}
                    </ListGroup>
                </div>
            )}
        </>
    );
}

export default CityList;
