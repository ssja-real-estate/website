import Strings from 'global/constants/strings';
import { globalState } from 'global/states/globalStates';
import EstateType from 'global/types/EstateType';
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
import EstateTypeService from 'services/api/EstateTypeService/EstateTypeService';
import ListItem from '../../../../../../components/ListItem/ListItem';
import './EstateTypesList.css';

function EstateTypesList() {
  const [estateTypes, setEstateTypes] = useState<EstateType[]>([]);
  const [removedItems, setRemovedItems] = useState<EstateType[]>([]);
  const [newItems, setNewItems] = useState<EstateType[]>([]);
  const [newEstateType, setNewEstateType] = useState<EstateType>({
    id: '',
    name: '',
  });
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

  const selectItemAsDeleted = (estateType: EstateType) => {
    setRemovedItems((prev) => {
      const type = prev.find((item) => item.id === estateType.id);
      if (type) {
        const newRemovedItems = prev.filter(
          (item) => item.id !== estateType.id
        );
        return newRemovedItems;
      } else {
        const newRemovedItems = [...prev, estateType];
        return newRemovedItems;
      }
    });
  };

  const deleteEstateTypes = async (removedItems: EstateType[]) => {
    for (let i = 0; i < removedItems.length; i++) {
      const element = removedItems[i];
      await service.current.deleteEstateType(element.id);
    }
  };

  const createNewEstateTypes = async (newItems: EstateType[]) => {
    for (let i = 0; i < newItems.length; i++) {
      const element = newItems[i];
      await service.current.createEstateType(element);
    }
  };

  const saveChanges = async (
    newItems: EstateType[],
    removedItems: EstateType[]
  ) => {
    setLoading((prev) => true);
    await deleteEstateTypes(removedItems);
    await createNewEstateTypes(newItems);
    await loadData();
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
      <Row>
        <Col>
          <InputGroup className="my-4" style={{ direction: 'ltr' }}>
            <Button
              variant="dark"
              onClick={() => {
                newEstateType.name.trim() !== '' &&
                  setNewItems((prev) => [
                    ...prev,
                    {
                      ...newEstateType,
                      name: newEstateType.name.trim(),
                    },
                  ]);
                setNewEstateType({
                  ...newEstateType,
                  name: '',
                });
              }}
            >
              <i className="bi-plus-lg fs-6"></i>
            </Button>
            <Form.Control
              type="text"
              placeholder={Strings.addNewType}
              value={newEstateType.name}
              onChange={(e) => {
                setNewEstateType({
                  ...newEstateType,
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
            onClick={async () => {
              await saveChanges(newItems, removedItems);
              setNewItems([]);
              setRemovedItems([]);
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
              {estateTypes.map((estateType, index) => {
                return (
                  <React.Fragment key={index}>
                    <ListItem
                      title={estateType.name}
                      onRemove={() => {
                        selectItemAsDeleted(estateType);
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

export default EstateTypesList;
