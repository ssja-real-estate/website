import Strings from 'global/constants/strings';
import { globalState } from 'global/states/globalStates';
import EstateType from 'global/types/EstateType';
import { useEffect, useRef, useState } from 'react';
import { Row, Col, Button, ListGroup, Spinner } from 'react-bootstrap';
import { useRecoilValue } from 'recoil';
import EstateTypeService from 'services/api/EstateTypeService/EstateTypeService';
import './EstateTypesList.css';

function EstateTypesList() {
  const [estateTypes, setEstateTypes] = useState<EstateType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const state = useRecoilValue(globalState);
  const service = useRef(new EstateTypeService());

  useEffect(() => {
    service.current.setToken(state.token);
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.token]);

  const loadData = async () => {
    if (!loading) {
      setLoading((prev) => true);
    }
    const data = await service.current.getAllEstateTypes();
    setEstateTypes(data);
    setLoading((prev) => false);
  };

  return (
    <>
      <h4 className="mt-4 ms-3 d-inline">{Strings.estateTypes}</h4>
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
