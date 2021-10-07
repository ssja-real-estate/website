import Strings from 'global/constants/strings';
import { tokenAtom } from 'global/states/globalStates';
import Unit from 'global/types/Unit';
import { useState, useEffect, useRef } from 'react';
import { Button, Row, Col, ListGroup, Spinner } from 'react-bootstrap';
import { useRecoilValue } from 'recoil';
import UnitService from 'services/api/UnitService/UnitService';
import './UnitList.css';

function UnitList() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const token = useRecoilValue(tokenAtom);
  const service = useRef(new UnitService());

  useEffect(() => {
    service.current.setToken(token);
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const loadData = async () => {
    if (!loading) {
      setLoading((prev) => true);
    }
    const units = await service.current.getAllUnits();
    setUnits(units);
    setLoading((prev) => false);
  };

  return (
    <>
      <h4 className="mt-4 ms-3 d-inline">{Strings.units}</h4>
      <Button
        variant="dark"
        className="refresh-btn d-inline rounded-circle"
        onClick={async () => {
          await loadData();
        }}
      >
        <i className="bi-arrow-counterclockwise"></i>
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
            {units.map((unit, index) => {
              return <ListGroup.Item key={index}>{unit.name}</ListGroup.Item>;
            })}
          </ListGroup>
        </div>
      )}
    </>
  );
}

export default UnitList;
