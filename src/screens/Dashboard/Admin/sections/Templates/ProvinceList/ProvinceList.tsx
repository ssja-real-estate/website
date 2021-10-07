import Strings from 'global/constants/strings';
import { globalState } from 'global/states/globalStates';
import Province from 'global/types/Province';
import { useEffect, useRef, useState } from 'react';
import { Button, Row, Col, ListGroup, Spinner } from 'react-bootstrap';
import { useRecoilValue } from 'recoil';
import ProvinceCityService from 'services/api/ProvinceCityService/ProvinceCityService';
import './ProvinceList.css';

function ProvinceList() {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const state = useRecoilValue(globalState);
  const service = useRef(new ProvinceCityService());

  useEffect(() => {
    service.current.setToken(state.token);
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.token]);

  const loadData = async () => {
    const data = await service.current.getAllProvinces();
    setProvinces(data);
    setLoading((prev) => false);
  };

  return (
    <>
      <h4 className="mt-4 ms-3 d-inline">{Strings.provinces}</h4>
      <Button
        variant="dark"
        className="refresh-btn d-inline rounded-circle"
        onClick={async () => {
          await loadData();
        }}
      >
        <i className="refresh-icon bi-arrow-counterclockwise"></i>
      </Button>
      {loading ? (
        <Row className="align-items-center">
          <Col>
            <Spinner animation="border" variant="primary" className="my-5" />
          </Col>
        </Row>
      ) : (
        <div className="d-flex flex-column justify-content-center align-items-center">
          <ListGroup className="mt-3" style={{ minWidth: 300, maxWidth: 400 }}>
            {provinces.map((province, index) => {
              return (
                <ListGroup.Item key={index}>{province.name}</ListGroup.Item>
              );
            })}
          </ListGroup>
        </div>
      )}
    </>
  );
}

export default ProvinceList;
