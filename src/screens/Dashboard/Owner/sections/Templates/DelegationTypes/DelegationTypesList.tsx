import EditItemModal from "components/EditItemModal/EditItemModal";
import editItemModalState, {
  buildMap,
  defaultEditItemModalState,
  EditItemType,
} from "components/EditItemModal/EditItemModalState";
import Strings from "global/constants/strings";
import { globalState } from "global/states/globalStates";
import DelegationType from "global/types/DelegationType";
import React, { useRef } from "react";
import { useEffect, useState } from "react";
import {
  Row,
  Col,
  Button,
  InputGroup,
  Form,
  ListGroup,
  Spinner,
} from "react-bootstrap";
import { useRecoilState, useRecoilValue } from "recoil";
import DelegationTypeService from "services/api/DelegationTypeService/DelegationTypeService";
import ListItem from "../../../../../../components/ListItem/ListItem";
import "./DelegationTypesList.css";

function DelegationTypesList() {
  const [delegationTypes, setDelegationTypes] = useState<DelegationType[]>([]);
  const [removedItems, setRemovedItems] = useState<DelegationType[]>([]);
  const [newItems, setNewItems] = useState<DelegationType[]>([]);
  const [newDelegationType, setNewDelegationType] = useState<DelegationType>({
    id: "",
    name: "",
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [modalState, setModalState] = useRecoilState(editItemModalState);

  const state = useRecoilValue(globalState);
  const service = useRef(new DelegationTypeService());
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
    if (modalState.editMap[EditItemType.DelegationType]) {
      editDelegationType();
    }

    return () => {
      modalMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalState.editMap[EditItemType.DelegationType]]);

  const loadData = async () => {
    if (!loading) {
      setLoading((prev) => true);
    }
    const data = await service.current.getAllDelegationTypes();

    if (!mounted.current) return;

    setDelegationTypes(data);
    setLoading((prev) => false);
  };

  const selectItemAsDeleted = (delegationType: DelegationType) => {
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

  const createNewDelegationTypes = async () => {
    for (let i = 0; i < newItems.length; i++) {
      const element = newItems[i];
      await service.current.createDelegationType(element);
    }
  };

  const editDelegationType = async () => {
    if (modalState.id === "") return;

    setLoading((prev) => true);
    let newType = await service.current.editDelegationType({
      id: modalState.id,
      name: modalState.value,
    });

    if (newType) {
      setDelegationTypes((types) => {
        let prevType = types.find((t) => t.id === newType!.id);
        if (prevType) {
          prevType.name = newType!.name;
        }
        return types;
      });
    }
    if (modalMounted.current) {
      setModalState(defaultEditItemModalState);
    }
    setLoading((prev) => false);
  };

  const deleteDelegationTypes = async () => {
    for (let i = 0; i < removedItems.length; i++) {
      const element = removedItems[i];
      await service.current.deleteDelegationType(element.id);
    }
  };

  const saveChanges = async () => {
    setLoading((prev) => true);
    await deleteDelegationTypes();
    await createNewDelegationTypes();
    await loadData();
  };

  return (
    <>
      <EditItemModal
        title={Strings.edit}
        placeholder={Strings.delegationType}
        editItemType={EditItemType.DelegationType}
      />
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
          <InputGroup className="my-4" style={{ direction: "ltr" }}>
            <Button
              variant="dark"
              onClick={() => {
                newDelegationType.name.trim() !== "" &&
                  setNewItems((prev) => [
                    ...prev,
                    {
                      ...newDelegationType,
                      name: newDelegationType.name.trim(),
                    },
                  ]);
                setNewDelegationType({
                  ...newDelegationType,
                  name: "",
                });
              }}
            >
              <i className="bi-plus-lg fs-6"></i>
            </Button>
            <Form.Control
              type="text"
              placeholder={Strings.addNewType}
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
              {delegationTypes.map((delegationType, index) => {
                return (
                  <React.Fragment key={index}>
                    <ListItem
                      title={delegationType.name}
                      onRemove={() => {
                        selectItemAsDeleted(delegationType);
                      }}
                      onEdit={() => {
                        const newMap = buildMap(EditItemType.DelegationType);
                        if (!modalMounted.current) return;
                        setModalState({
                          ...defaultEditItemModalState,
                          id: delegationType.id,
                          value: delegationType.name,
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

export default DelegationTypesList;
