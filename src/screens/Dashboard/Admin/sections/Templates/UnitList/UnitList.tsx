import { useState, useEffect } from 'react';
import { Button, Row, Col, ListGroup, Spinner } from 'react-bootstrap';
import { Unit } from '../../../../../../global/types/Estate';
import { fetchGet } from '../../../../../../services/api/fetch';
import './UnitList.css';

function UnitList() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  async function getData(url: string) {
    fetchGet(url)
      .then((data) => {
        setUnits(data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    getData('http://localhost:8000/units');
  }, []);

  return (
    <>
      <h4 className="mt-4 ms-3 d-inline">واحد ها</h4>
      <Button
        variant="dark"
        className="refresh-btn d-inline rounded-circle"
        onClick={() => {
          setLoading(true);
          getData('http://localhost:8000/units');
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
              return <ListGroup.Item key={index}>{unit.value}</ListGroup.Item>;
            })}
          </ListGroup>
        </div>
      )}
    </>
  );
}

export default UnitList;
