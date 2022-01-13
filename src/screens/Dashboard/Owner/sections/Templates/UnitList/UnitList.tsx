import EditItemModal from "components/EditItemModal/EditItemModal";
import editItemModalState, {
  buildMap,
  defaultEditItemModalState,
  EditItemType,
} from "components/EditItemModal/EditItemModalState";
import Strings from "global/constants/strings";
import { globalState } from "global/states/globalStates";
import Unit from "global/types/Unit";
import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Row,
  Col,
  InputGroup,
  Form,
  ListGroup,
  Spinner,
} from "react-bootstrap";
import { useRecoilState, useRecoilValue } from "recoil";
import UnitService from "services/api/UnitService/UnitService";
import ListItem from "../../../../../../components/ListItem/ListItem";

function UnitList() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [removedItems, setRemovedItems] = useState<Unit[]>([]);
  const [newItems, setNewItems] = useState<Unit[]>([]);
  const [newUnit, setNewUnit] = useState<Unit>({
    id: "",
    name: "",
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [modalState, setModalState] = useRecoilState(editItemModalState);

  const state = useRecoilValue(globalState);
  const service = useRef(new UnitService());
  const mounted = useRef(true);
  const modalMounted = useRef(true);

  useEffect(() => {
    service.current.setToken(state.token);
    loadData();

    return () => {
      mounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.token]);

  useEffect(() => {
    if (modalState.editMap[EditItemType.Unit]) {
      editUnit();
    }

    return () => {
      modalMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalState.editMap[EditItemType.Unit]]);

  const loadData = async () => {
    if (!loading) {
      setLoading((prev) => true);
    }
    const units = await service.current.getAllUnits();

    if (!mounted.current) return;
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

  const createNewUnits = async () => {
    for (let i = 0; i < newItems.length; i++) {
      const unit = newItems[i];
      await service.current.createUnit(unit);
    }
  };

  const editUnit = async () => {
    if (modalState.id === "") return;
    setLoading((prev) => true);

    let updatedUnit = await service.current.editUnit({
      id: modalState.id,
      name: modalState.value,
    });

    if (updatedUnit) {
      setUnits((prev) => {
        let prevType = prev.find((t) => t.id === updatedUnit!.id);
        if (prevType) {
          prevType.name = updatedUnit!.name;
        }
        return prev;
      });
    }
    if (modalMounted.current) {
      setModalState(defaultEditItemModalState);
    }
    setLoading((prev) => false);
  };

  const deleteUnits = async () => {
    for (let i = 0; i < removedItems.length; i++) {
      const unit = removedItems[i];
      await service.current.deleteUnit(unit.id);
    }
  };
  const saveChanges = async () => {
    await deleteUnits();
    await createNewUnits();
    await loadData();
  };

  return (
    <>
      <EditItemModal
        title={Strings.edit}
        placeholder={Strings.unit}
        editItemType={EditItemType.Unit}
      />

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
      <Row>
        <Col>
          <InputGroup className="my-4" style={{ direction: "ltr" }}>
            <Button
              variant="dark"
              onClick={() => {
                newUnit.name.trim() !== "" &&
                  setNewItems((prev) => [
                    ...prev,
                    {
                      ...newUnit,
                      name: newUnit.name.trim(),
                    },
                  ]);
                setNewUnit({
                  ...newUnit,
                  name: "",
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
        <Col sm={"auto"}>
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
                      onEdit={() => {
                        const newMap = buildMap(EditItemType.Unit);
                        if (!modalMounted.current) return;
                        setModalState({
                          ...defaultEditItemModalState,
                          id: unit.id,
                          value: unit.name,
                          displayMap: [...newMap],
                        });
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
                    className="bi-x-lg remove-icon"
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
