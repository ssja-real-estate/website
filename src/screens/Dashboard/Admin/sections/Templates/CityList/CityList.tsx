import { tokenAtom } from 'global/states/globalStates';
import City from 'global/types/City';
import Province from 'global/types/Province';
import { useState, useEffect, useRef } from 'react';
import { Button, Row, Col, ListGroup, Spinner, Form } from 'react-bootstrap';
import { useRecoilValue } from 'recoil';
import ProvinceCityService from 'services/api/ProvinceCityService/ProvinceCityService';
import './CityList.css';

function CityList() {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<Province>();
  const [loading, setLoading] = useState<boolean>(true);
  const token = useRecoilValue(tokenAtom);
  const service = useRef(new ProvinceCityService());

  useEffect(() => {
    service.current.setToken(token);
  }, [token]);

  async function getProvinceData(url: string) {}

  async function getCityData(url: string) {}

  return (
    <>
      <h4 className="mt-4 ms-3 d-inline">شهر ها</h4>
      <Button
        variant="dark"
        className="refresh-btn d-inline rounded-circle"
        onClick={() => {
          setLoading(true);
          getProvinceData('http://localhost:8000/provinces');
          getCityData(`http://localhost:8000/cities`);
        }}
      >
        <i className="bi-arrow-counterclockwise"></i>
      </Button>
      <div className="d-flex flex-row justify-content-center mt-3">
        <Form.Select
          style={{ maxWidth: 300 }}
          defaultValue="default"
          value={selectedProvince?.name}
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
