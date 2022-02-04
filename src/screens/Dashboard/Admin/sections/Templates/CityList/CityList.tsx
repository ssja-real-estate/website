import Strings from "global/constants/strings";
import { globalState } from "global/states/globalStates";
import City from "global/types/City";
import Province from "global/types/Province";
import { useState, useEffect, useRef } from "react";
import { Button, Row, Col, ListGroup, Spinner, Form } from "react-bootstrap";
import { useRecoilValue } from "recoil";
import LocationService from "services/api/LocationService/LocationService";
import "./CityList.css";

function CityList() {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<Province>();
  const [loading, setLoading] = useState<boolean>(true);

  const state = useRecoilValue(globalState);
  const service = useRef(new LocationService());
  const mounted = useRef(true);

  useEffect(() => {
    service.current.setToken(state.token);
    loadData();

    return () => {
      mounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.token]);

  const loadData = async () => {
    if (!loading) {
      setLoading((prev) => true);
    }
    const provinces = await service.current.getAllProvinces();

    if (!mounted.current) return;

    setProvinces(provinces);
    if (selectedProvince) {
      const province = provinces.find((p) => p.id === selectedProvince.id);
      if (province) {
        setSelectedProvince(province);
        setCities(province.cities);
      }
    }
    setLoading((prev) => false);
  };
  return (
    <>
      <h4 className="mt-4 ms-3 d-inline">{Strings.cities}</h4>
      <Button
        variant="dark"
        className="refresh-btn d-inline rounded-circle"
        onClick={async () => {
          await loadData();
        }}
      >
        <i className="bi-arrow-counterclockwise"></i>
      </Button>
      <div className="d-flex flex-row justify-content-center mt-3">
        <Form.Select
          style={{ maxWidth: 300 }}
          defaultValue="default"
          value={selectedProvince?.id}
          onChange={(e) => {
            const provinceId = e.currentTarget.value;
            if (provinceId) {
              const province = provinces.find((p) => p.id === provinceId);
              if (province) {
                setSelectedProvince(province);
                setCities(province.cities);
              }
            }
          }}
        >
          <option value="default" disabled>
            {Strings.chooseProvince}
          </option>
          {provinces.map((province, index) => {
            return (
              <option key={index} value={province.id}>
                {province.name}
              </option>
            );
          })}
        </Form.Select>
      </div>
      {loading ? (
        <Row className="align-items-center">
          <Col>
            <Spinner animation="border" variant="primary" className="my-5" />
          </Col>
        </Row>
      ) : (
        <div className="d-flex flex-column justify-content-center align-items-center">
          <ListGroup className="mt-3" style={{ minWidth: 300, maxWidth: 400 }}>
            {cities &&
              cities.map((city, index) => {
                return <ListGroup.Item key={index}>{city.name}</ListGroup.Item>;
              })}
          </ListGroup>
        </div>
      )}
    </>
  );
}

export default CityList;
