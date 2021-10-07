import Strings from 'global/constants/strings';
import { tokenAtom } from 'global/states/globalStates';
import Unit from 'global/types/Unit';
import React, { useState, useEffect, useRef } from 'react';
import {
  Button,
  Row,
  Col,
  InputGroup,
  Form,
  ListGroup,
  Spinner,
} from 'react-bootstrap';
import { useRecoilValue } from 'recoil';
import UnitService from 'services/api/UnitService/UnitService';
import ListItem from '../../../../../../components/ListItem/ListItem';

function UnitList() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [removedItems, setRemovedItems] = useState<Unit[]>([]);
  const [newItems, setNewItems] = useState<Unit[]>([]);
  const [newUnit, setNewUnit] = useState<Unit>({
    id: '',
    name: '',
  });
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

  const selectItemAsDeleted = (unit: Unit) => {
    setRemovedItems((prev) => {
      const existingItem = prev.find((e) => e.id === unit.id);

      if (existingItem) {
        const newRemovedItems = prev.filter((item) => item.id !== unit.id);
        return newRemovedItems;
      } else {
        const newRemovedItems = [...prev, unit];
        return newRemovedItems;
      }
    });
  };

  const deleteUnits = async (units: Unit[]) => {
    for (let i = 0; i < units.length; i++) {
      const unit = units[i];
      await service.current.deleteUnit(unit.id);
    }
  };

  const createNewUnits = async (units: Unit[]) => {
    for (let i = 0; i < units.length; i++) {
      const unit = units[i];
      await service.current.createUnit(unit);
    }
  };

  const saveChanges = async () => {
    await deleteUnits(removedItems);
    await createNewUnits(newItems);
    await loadData();
  };

  return (
    <>
      <h4 className="mt-4 ms-3 d-inline">واحد ها</h4>
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
                newUnit.name.trim() !== '' &&
                  setNewItems((prev) => [
                    ...prev,
                    {
                      ...newUnit,
                      name: newUnit.name.trim(),
                    },
                  ]);
                setNewUnit({
                  ...newUnit,
                  name: '',
                });
              }}
            >
              <i className="bi-plus-lg fs-6"></i>
            </Button>
            <Form.Control
              type="text"
              placeholder={Strings.addNewUnit}
              value={newUnit.name}
              onChange={(e) => {
                setNewUnit({
                  ...newUnit,
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
              await saveChanges();
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
              {units.map((unit, index) => {
                return (
                  <React.Fragment key={index}>
                    <ListItem
                      title={unit.name}
                      onRemove={() => {
                        selectItemAsDeleted(unit);
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

export default UnitList;
