import Strings from 'global/constants/strings';
import { tokenAtom } from 'global/states/globalStates';
import DelegationType from 'global/types/DelegationType';
import React, { useRef } from 'react';
import { useEffect, useState } from 'react';
import {
  Row,
  Col,
  Button,
  InputGroup,
  Form,
  ListGroup,
  Spinner,
} from 'react-bootstrap';
import { useRecoilValue } from 'recoil';
import DelegationTypeService from 'services/api/DelegationTypeService/DelegationTypeService';
import ListItem from '../../../../../../components/ListItem/ListItem';
import './DelegationTypesList.css';

function DelegationTypesList() {
  const [delegationTypes, setDelegationTypes] = useState<DelegationType[]>([]);
  const [removedItems, setRemovedItems] = useState<DelegationType[]>([]);
  const [newItems, setNewItems] = useState<DelegationType[]>([]);
  const [newDelegationType, setNewDelegationType] = useState<DelegationType>({
    id: '',
    name: '',
  });
  const token = useRecoilValue(tokenAtom);
  const service = useRef(new DelegationTypeService());
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    service.current.setToken(token);
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const loadData = async () => {
    setLoading((prev) => true);
    const data = await service.current.getAllDelegationTypes();
    setDelegationTypes(data);
    setLoading((prev) => false);
  };

  const selectItemAsRemoved = (delegationType: DelegationType) => {
    setRemovedItems((prev) => {
      let type = prev.find((item) => item.id === delegationType.id);
      let newRemovedItems = [];
      if (type) {
        newRemovedItems = prev.filter((item) => item.id !== delegationType.id);
        return newRemovedItems;
      } else {
        newRemovedItems = [...prev, delegationType];
        return newRemovedItems;
      }
    });
  };

  const createNewDelegationTypes = async (
    delegationTypes: DelegationType[]
  ) => {
    for (let i = 0; i < delegationTypes.length; i++) {
      const element = delegationTypes[i];
      await service.current.createDelegationType(element);
    }
  };

  const deleteDelegationTypes = async (delegationTypes: DelegationType[]) => {
    for (let i = 0; i < delegationTypes.length; i++) {
      const element = delegationTypes[i];
      await service.current.deleteDelegationType(element.id);
    }
  };

  const saveChanges = async (
    newItems: DelegationType[],
    removedItems: DelegationType[]
  ) => {
    await deleteDelegationTypes(removedItems);
    await createNewDelegationTypes(newItems);
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
        <i className="bi-arrow-counterclockwise"></i>
      </Button>
      <Row>
        <Col>
          <InputGroup className="my-4" style={{ direction: 'ltr' }}>
            <Button
              variant="dark"
              onClick={() => {
                newDelegationType.name.trim() !== '' &&
                  setNewItems((prev) => [
                    ...prev,
                    {
                      ...newDelegationType,
                      name: newDelegationType.name.trim(),
                    },
                  ]);
                setNewDelegationType({
                  ...newDelegationType,
                  name: '',
                });
              }}
            >
              <i className="bi-plus-lg fs-6"></i>
            </Button>
            <Form.Control
              type="text"
              placeholder={Strings.addNewDelegationType}
              value={newDelegationType.name}
              onChange={(e) => {
                setNewDelegationType({
                  ...newDelegationType,
                  name: e.target.value,
                });
              }}
            />
          </InputGroup>
        </Col>
        <Col sm={'auto'}>
          <Button
            variant="purple"
            className="my-4"
            onClick={() => {
              saveChanges(newItems, removedItems)
                .then(() => loadData())
                .then(() => {
                  setNewItems([]);
                  setRemovedItems([]);
                  setLoading((prev) => false);
                });
            }}
          >
            {Strings.saveChanges}
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>
          {loading ? (
            <Spinner animation="border" variant="primary" className="my-5" />
          ) : (
            <ListGroup>
              {delegationTypes.map((delegationType, index) => {
                return (
                  <React.Fragment key={index}>
                    <ListItem
                      title={delegationType.name}
                      onRemove={() => {
                        console.log('remove');
                        selectItemAsRemoved(delegationType);
                      }}
                    />
                  </React.Fragment>
                );
              })}
            </ListGroup>
          )}
        </Col>
        <Col>
          <ListGroup>
            {newItems.map((newItem, index) => {
              return (
                <ListGroup.Item
                  key={index}
                  variant="warning"
                  action
                  className="new-item d-flex flex-row justify-content-between align-items-center"
                >
                  {newItem.name}
                  <i
                    className="remove-icon bi-x-lg"
                    onClick={() => {
                      setNewItems((prev) =>
                        prev.filter((_, id) => id !== index)
                      );
                    }}
                  ></i>
                </ListGroup.Item>
              );
            })}
          </ListGroup>
        </Col>
      </Row>
    </>
  );
}

export default DelegationTypesList;
