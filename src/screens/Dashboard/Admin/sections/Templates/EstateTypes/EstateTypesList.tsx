import EstateType from 'global/types/EstateType';
import { useEffect, useState } from 'react';
import { Row, Col, Button, ListGroup, Spinner } from 'react-bootstrap';
import './EstateTypesList.css';

function EstateTypesList() {
  const [estateTypes, setEstateTypes] = useState<EstateType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  async function getData(url: string) {
    // fetchGet(url)
    //   .then((data) => {
    //     setEstateTypes(data.data);
    //     setLoading(false);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  }

  useEffect(() => {
    getData('http://localhost:8000/estateTypes');
  }, []);

  return (
    <>
      <h4 className="mt-4 ms-3 d-inline">نوع ملک ها</h4>
      <Button
        variant="dark"
        className="refresh-btn d-inline rounded-circle"
        onClick={() => {
          setLoading(true);
          getData('http://localhost:8000/estateTypes');
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
            {estateTypes.map((estateType, index) => {
              return (
                <ListGroup.Item key={index}>{estateType.name}</ListGroup.Item>
              );
            })}
          </ListGroup>
        </div>
      )}
    </>
  );
}

export default EstateTypesList;
