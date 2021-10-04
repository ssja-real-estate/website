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
import toast from 'react-hot-toast';
import { useRecoilValue } from 'recoil';
import DelegationTypeService from 'services/api/DelegationTypeService/DelegationTypeService';
import ListItem from '../../../../../../components/ListItem/ListItem';
import './DelegationTypesList.css';

function DelegationTypesList() {
  const [delegationTypes, setDelegationTypes] = useState<DelegationType[]>([]);
  const [removedItems, setRemovedItems] = useState<DelegationType[]>([]);
  const [newItems, setNewItems] = useState<DelegationType[]>([]);
  const [newDelegationType, setNewDelegationType] = useState<DelegationType>({
    name: '',
    id: '',
    createdAt: new Date(),
    updateAt: new Date(),
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

  const createNewDelegationType = async (delegationTypes: DelegationType[]) => {
    delegationTypes.forEach(async (element) => {
      await service.current.createDelegationType(element);
    });
  };

  return (
    <>
      <h4 className="mt-4 ms-3 d-inline">نوع واگذاری ها</h4>
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
              placeholder="افزودن نوع جدید"
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
              setLoading(true);
              setNewItems([]);
              setRemovedItems([]);
              const allItems = [...newItems, ...delegationTypes];
              const finalItems = allItems.filter(
                (item) =>
                  !removedItems
                    .map((removedItem) => removedItem.id)
                    .includes(item.id)
              );
              toast.promise(
                createNewDelegationType(finalItems).then(() => {
                  loadData();
                }),
                {
                  loading: 'در حال ذخیره سازی تغییرات',
                  success: 'تغییرات با موفقیت ذخیره شد',
                  error: 'خطا در ذخیره سازی تغییرات',
                },
                {
                  style: { width: 250 },
                }
              );
            }}
          >
            ذخیره تغییرات
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
                        setRemovedItems((prev) => {
                          let exists: boolean = false;
                          prev.every((item) => {
                            if (item.id === delegationType.id) {
                              exists = true;

                              return false;
                            } else {
                              return true;
                            }
                          });
                          if (exists) {
                            const newRemovedItems = prev.filter(
                              (item) => item.id !== delegationType.id
                            );
                            return newRemovedItems;
                          } else {
                            const newRemovedItems = [...prev, delegationType];
                            return newRemovedItems;
                          }
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
