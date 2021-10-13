import Strings from 'global/constants/strings';
import { globalState } from 'global/states/globalStates';
import DelegationType from 'global/types/DelegationType';
import { useEffect, useRef, useState } from 'react';
import { Row, Col, Button, ListGroup, Spinner } from 'react-bootstrap';
import { useRecoilValue } from 'recoil';
import DelegationTypeService from 'services/api/DelegationTypeService/DelegationTypeService';
import './DelegationTypesList.css';

function DelegationTypesList() {
  const [delegationTypes, setDelegationTypes] = useState<DelegationType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const state = useRecoilValue(globalState);
  const service = useRef(new DelegationTypeService());
  const mounted = useRef(true);

  useEffect(() => {
    if (mounted.current) {
      service.current.setToken(state.token);
      loadData();
    }

    return () => {
      mounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.token]);

  const loadData = async () => {
    if (!loading) {
      setLoading((prev) => true);
    }
    const data = await service.current.getAllDelegationTypes();
    setDelegationTypes(data);
    setLoading((prev) => false);
  };
  return (
    <>
      <h4 className="mt-4 ms-3 d-inline">{Strings.delegationTypes}</h4>
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
            {delegationTypes.map((delegationType, index) => {
              return (
                <ListGroup.Item key={index}>
                  {delegationType.name}
                </ListGroup.Item>
              );
            })}
          </ListGroup>
        </div>
      )}
    </>
  );
}

export default DelegationTypesList;
