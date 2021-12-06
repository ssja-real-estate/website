import Strings from "global/constants/strings";
import { globalState } from "global/states/globalStates";
import User, { defaultUser, Role, roleMap } from "global/types/User";
import React, { useEffect, useRef, useState } from "react";
import {
  Card,
  Col,
  Form,
  ListGroup,
  Row,
  Tab,
  Spinner,
  Button,
  InputGroup,
} from "react-bootstrap";
import { useRecoilValue } from "recoil";
import UserService from "services/api/UserService/UserService";

const AdminList = (): JSX.Element => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<User>(defaultUser);

  const state = useRecoilValue(globalState);
  const userService = useRef(new UserService());
  const mounted = useRef(true);

  useEffect(() => {
    userService.current.setToken(state.token);
    if (mounted.current) {
      loadData();
    }

    return () => {
      mounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.token]);

  const loadData = async () => {
    if (!loading) {
      setLoading(true);
    }
    const admins = await userService.current.getAllUsers(Role.ADMIN);
    setUsers(admins);
    setLoading(false);
  };

  const changeRole = async () => {
    if (selectedAdmin.id === "") return;
    const userId = selectedAdmin.id;
    const role = selectedAdmin.role;
    setLoading(true);
    await userService.current.changeUserRole(userId, role);
    await loadData();
  };

  return (
    <>
      {loading ? (
        <Spinner animation="border" variant="primary" className="my-5" />
      ) : (
        <div className="users-section">
          <Tab.Container>
            <Row>
              <Col md={5} className="users-list">
                <h3 className="users-list-title fw-light mb-4 d-inline">
                  {Strings.admins}
                </h3>
                <Button
                  variant="dark"
                  className="refresh-btn d-inline rounded-circle my-2 mx-2"
                  onClick={async () => {
                    await loadData();
                  }}
                >
                  <i className="bi-arrow-counterclockwise"></i>
                </Button>
                <Form.Control
                  className="mb-3"
                  placeholder={Strings.searchAdmins}
                  value={searchValue}
                  onChange={(event) => {
                    setSearchValue(event.target.value);
                  }}
                ></Form.Control>
                <ListGroup>
                  {users
                    .filter((user) => {
                      const value = searchValue.trim();
                      if (value === "") return true;

                      let result = user.mobile.includes(value);

                      return result;
                    })
                    .map((user, index) => {
                      return (
                        <ListGroup.Item
                          key={index}
                          action
                          href={`#user${user.id}`}
                          onClick={() => {
                            setSelectedAdmin({
                              id: user.id,
                              mobile: user.mobile,
                              role: user.role,
                              name: user.name,
                            });
                          }}
                        >
                          <div className="d-flex justify-content-center">
                            <span className="user-phone" style={{ width: 150 }}>
                              {user.mobile}
                            </span>
                          </div>
                        </ListGroup.Item>
                      );
                    })}
                </ListGroup>
              </Col>
              <Col md={7} className="user-info">
                <Tab.Content className="sticky-top">
                  <h3 className="user-info-title fw-light mb-4">
                    {Strings.adminInfo}
                  </h3>
                  {users.map((user, index) => {
                    return (
                      <Tab.Pane key={index} eventKey={`#user${user.id}`}>
                        <Card className="shadow p-3">
                          <span
                            className="user-phone pt-4"
                            style={{ fontSize: 20 }}
                          >
                            {user.mobile}
                            <i className="bi-telephone-fill me-2"></i>
                          </span>
                          <InputGroup
                            className="my-3"
                            style={{ direction: "ltr" }}
                          >
                            <Button
                              variant="purple"
                              onClick={async () => {
                                await changeRole();
                              }}
                            >
                              {Strings.save}
                            </Button>
                            <Form.Select
                              value={selectedAdmin.role}
                              onChange={(e) => {
                                const roleString = e.currentTarget.value;
                                if (roleString) {
                                  const role = Number(roleString) as Role;
                                  setSelectedAdmin({
                                    ...selectedAdmin,
                                    role,
                                  });
                                }
                              }}
                            >
                              {roleMap.map((role, index) => {
                                return (
                                  <option key={index} value={role.role}>
                                    {role.roleName}
                                  </option>
                                );
                              })}
                            </Form.Select>
                          </InputGroup>
                        </Card>
                      </Tab.Pane>
                    );
                  })}
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
        </div>
      )}
    </>
  );
};

export default AdminList;
